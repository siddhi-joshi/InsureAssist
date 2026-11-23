from __future__ import annotations

import hashlib
import hmac
import json
import os
import secrets
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
DB_PATH = Path(os.getenv("INSUREASSIST_DB", ROOT / "insureassist.db"))

def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")

def connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    c = sqlite3.connect(DB_PATH); c.row_factory = sqlite3.Row; c.execute("PRAGMA foreign_keys = ON"); return c

def init_db() -> None:
    with connect() as db:
        db.executescript("""
        CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS policies (id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE, policy_number TEXT NOT NULL UNIQUE, type TEXT NOT NULL, plan TEXT NOT NULL, status TEXT NOT NULL, sum_insured TEXT NOT NULL, premium TEXT NOT NULL, renewal_date TEXT NOT NULL, coverage_json TEXT NOT NULL, exclusions_json TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS claims (id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE, policy_id TEXT REFERENCES policies(id) ON DELETE SET NULL, claim_number TEXT NOT NULL UNIQUE, type TEXT NOT NULL, amount TEXT NOT NULL, submitted_on TEXT NOT NULL, status TEXT NOT NULL, next_action TEXT NOT NULL, missing_documents TEXT NOT NULL, assigned_team TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE, subject TEXT NOT NULL, description TEXT NOT NULL, priority TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL);
        CREATE INDEX IF NOT EXISTS idx_policies_customer ON policies(customer_id); CREATE INDEX IF NOT EXISTS idx_claims_customer ON claims(customer_id); CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets(customer_id);
        """)

def password_hash(password: str, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16); digest = hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt), n=2**14, r=8, p=1); return f"{salt}${digest.hex()}"

def verify_password(password: str, stored: str) -> bool:
    salt, expected = stored.split("$", 1); return hmac.compare_digest(password_hash(password, salt).split("$", 1)[1], expected)

def row(item: sqlite3.Row | None) -> dict[str, Any] | None: return dict(item) if item else None
def public_customer(item: dict[str, Any]) -> dict[str, Any]: item.pop("password_hash", None); return item

def create_customer(name: str, email: str, password: str) -> dict[str, Any]:
    ident = secrets.token_urlsafe(12)
    with connect() as db: db.execute("INSERT INTO customers VALUES (?, ?, ?, ?, ?)", (ident, name.strip(), email.lower().strip(), password_hash(password), now()))
    with connect() as db: return public_customer(row(db.execute("SELECT * FROM customers WHERE id = ?", (ident,)).fetchone()) or {})

def find_customer(email: str) -> dict[str, Any] | None:
    with connect() as db: return row(db.execute("SELECT * FROM customers WHERE email = ?", (email.lower().strip(),)).fetchone())

def customer(ident: str) -> dict[str, Any] | None:
    with connect() as db: return row(db.execute("SELECT id, name, email, created_at FROM customers WHERE id = ?", (ident,)).fetchone())

def records(table: str, customer_id: str) -> list[dict[str, Any]]:
    if table not in {"policies", "claims", "tickets"}: raise ValueError("Invalid table")
    with connect() as db: items = [dict(x) for x in db.execute(f"SELECT * FROM {table} WHERE customer_id = ? ORDER BY rowid DESC", (customer_id,)).fetchall()]
    for item in items:
        if table == "policies": item["coverage"] = json.loads(item.pop("coverage_json")); item["exclusions"] = json.loads(item.pop("exclusions_json"))
        if table == "claims": item["missing_documents"] = json.loads(item["missing_documents"])
    return items

def create_policy(customer_id: str, data: dict[str, Any]) -> dict[str, Any]:
    ident = secrets.token_urlsafe(12)
    with connect() as db: db.execute("INSERT INTO policies VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (ident, customer_id, data["policy_number"], data["type"], data["plan"], data["status"], data["sum_insured"], data["premium"], data["renewal_date"], json.dumps(data.get("coverage", [])), json.dumps(data.get("exclusions", []))))
    return next(x for x in records("policies", customer_id) if x["id"] == ident)

def create_claim(customer_id: str, data: dict[str, Any]) -> dict[str, Any]:
    ident = secrets.token_urlsafe(12)
    with connect() as db: db.execute("INSERT INTO claims VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (ident, customer_id, data.get("policy_id"), data["claim_number"], data["type"], data["amount"], data["submitted_on"], data["status"], data["next_action"], json.dumps(data.get("missing_documents", [])), data["assigned_team"]))
    return next(x for x in records("claims", customer_id) if x["id"] == ident)

def create_ticket(customer_id: str, data: dict[str, Any]) -> dict[str, Any]:
    ident = secrets.token_urlsafe(12)
    with connect() as db: db.execute("INSERT INTO tickets VALUES (?, ?, ?, ?, ?, ?, ?)", (ident, customer_id, data["subject"], data["description"], data["priority"], "Open", now()))
    return next(x for x in records("tickets", customer_id) if x["id"] == ident)

def dashboard(customer_id: str) -> dict[str, Any] | None:
    person = customer(customer_id)
    return {"customer": person, "policies": records("policies", customer_id), "claims": records("claims", customer_id), "tickets": records("tickets", customer_id)} if person else None

def workspace() -> dict[str, Any]:
    ident = os.getenv("INSUREASSIST_WORKSPACE_ID", "local-workspace")
    name = os.getenv("INSUREASSIST_WORKSPACE_NAME", "InsureAssist Workspace")
    email = f"{ident}@local.invalid"
    with connect() as db:
        db.execute("INSERT OR IGNORE INTO customers VALUES (?, ?, ?, ?, ?)", (ident, name, email, password_hash(secrets.token_urlsafe()), now()))
    return customer(ident) or {"id": ident, "name": name, "email": email}

init_db()

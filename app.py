from __future__ import annotations
import json, os, re, urllib.error, urllib.request
from pathlib import Path
from typing import Any
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
import db

ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")

class ChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=2000)
    history: list[dict[str, str]] = Field(default_factory=list)
class PolicyRequest(BaseModel):
    policy_number: str = Field(min_length=2, max_length=80); type: str = Field(min_length=2, max_length=80); plan: str = Field(min_length=2, max_length=120); status: str = "Active"; sum_insured: str = ""; premium: str = ""; renewal_date: str = ""; coverage: list[str] = Field(default_factory=list); exclusions: list[str] = Field(default_factory=list)
class ClaimRequest(BaseModel):
    claim_number: str = Field(min_length=2, max_length=80); policy_id: str | None = None; type: str = ""; amount: str = ""; submitted_on: str = ""; status: str = "Submitted"; next_action: str = "Awaiting review"; missing_documents: list[str] = Field(default_factory=list); assigned_team: str = "Claims Desk"
class TicketRequest(BaseModel):
    subject: str = Field(min_length=3, max_length=150); description: str = Field(min_length=5, max_length=2000); priority: str = "Normal"

class GeminiClient:
    def __init__(self) -> None: self.key = os.getenv("GEMINI_API_KEY", "").strip(); self.model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    def answer(self, instructions: str, context: Any, question: str, history: list[dict[str, str]]) -> str | None:
        if not self.key: return None
        contents = [{"role": "model" if x.get("role") == "assistant" else "user", "parts": [{"text": x.get("content", "")}]} for x in history[-6:]]
        contents.append({"role": "user", "parts": [{"text": f"{instructions}\n\nLive workspace records (authoritative):\n{json.dumps(context, ensure_ascii=False)}\n\nQuestion: {question}\nAnswer concisely. Never invent missing information."}]})
        request = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.key}", data=json.dumps({"contents": contents, "generationConfig": {"temperature": 0.2, "maxOutputTokens": 600}}).encode(), headers={"Content-Type": "application/json"}, method="POST")
        try:
            with urllib.request.urlopen(request, timeout=20) as response: body = json.loads(response.read().decode())
            return body["candidates"][0]["content"]["parts"][0]["text"].strip()
        except (urllib.error.URLError, urllib.error.HTTPError, KeyError, IndexError, json.JSONDecodeError): return None

gemini = GeminiClient()

def routed_answer(message: str, history: list[dict[str, str]]) -> tuple[str, str]:
    person = db.workspace(); data = db.dashboard(person["id"]) or {"customer": person, "policies": [], "claims": [], "tickets": []}; text = message.lower()
    routes = [("claim", r"claim|settle|approved|rejected|document|discharge"), ("payment", r"premium|payment|paid|receipt|amount due"), ("renewal", r"renew|expire|expiry|due date"), ("complaint", r"complaint|unhappy|frustrat|escalat|human|wrong"), ("policy", r"cover|policy|exclusion|benefit|insured|hospital")]
    intent = next((name for name, pattern in routes if re.search(pattern, text)), "policy")
    instructions = {"policy":"You are a policy information specialist.","claim":"You are a claims status specialist.","payment":"You are a premium and payment specialist. Never request card, OTP, or bank details.","renewal":"You are a policy renewal specialist.","complaint":"You are a complaint and escalation specialist."}[intent]
    answer = gemini.answer(instructions, data, message, history)
    if answer: return intent, answer
    fallbacks = {"policy":"I can answer from the live policy records, but no policy has been added yet. Add one in My policies or connect your insurer system.","claim":"I can track live claim records, but no claim has been added yet. Add one in Claims or connect your insurer claims API.","payment":"Payment processing requires a secure insurer or payment-gateway integration. I will never collect card or OTP details in chat.","renewal":"Renewal information comes from the live policy records. Add a policy or connect your insurer system.","complaint":"I can create a support ticket for a human team. Use the Support tab to submit the issue."}
    return intent, fallbacks[intent]

app = FastAPI(title="InsureAssist", version="3.0.0")
FRONTEND_DIST = ROOT / "frontend" / "dist"
if FRONTEND_DIST.exists(): app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")
else: app.mount("/static", StaticFiles(directory=ROOT / "static"), name="static")
@app.get("/")
def index() -> FileResponse: return FileResponse((FRONTEND_DIST / "index.html") if FRONTEND_DIST.exists() else (ROOT / "static" / "index.html"))
@app.get("/api/health")
def health() -> dict[str, Any]: return {"status":"ok","gemini_enabled":bool(gemini.key),"database":str(db.DB_PATH),"model":gemini.model,"authentication":False}
@app.get("/api/dashboard")
def dashboard() -> dict[str, Any]: return db.dashboard(db.workspace()["id"]) or {}
@app.get("/api/policies")
def policies() -> list[dict[str, Any]]: return db.records("policies", db.workspace()["id"])
@app.post("/api/policies")
def add_policy(request: PolicyRequest) -> dict[str, Any]:
    try: return db.create_policy(db.workspace()["id"], request.model_dump())
    except Exception as exc: raise HTTPException(400, "Policy number must be unique and all fields must be valid") from exc
@app.get("/api/claims")
def claims() -> list[dict[str, Any]]: return db.records("claims", db.workspace()["id"])
@app.post("/api/claims")
def add_claim(request: ClaimRequest) -> dict[str, Any]:
    try: return db.create_claim(db.workspace()["id"], request.model_dump())
    except Exception as exc: raise HTTPException(400, "Claim number must be unique and all fields must be valid") from exc
@app.get("/api/tickets")
def tickets() -> list[dict[str, Any]]: return db.records("tickets", db.workspace()["id"])
@app.post("/api/tickets")
def add_ticket(request: TicketRequest) -> dict[str, Any]: return db.create_ticket(db.workspace()["id"], request.model_dump())
@app.post("/api/chat")
def chat(request: ChatRequest) -> dict[str, Any]:
    intent, reply = routed_answer(request.message, request.history); return {"reply":reply,"intent":intent,"ai_mode":"Gemini" if gemini.key else "Data-driven mode"}

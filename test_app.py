import os
import tempfile

os.environ["INSUREASSIST_DB"] = os.path.join(tempfile.gettempdir(), f"insureassist-test-{os.getpid()}.db")
from app import db, health


def test_health_has_no_authentication():
    result = health()
    assert result["status"] == "ok"
    assert result["authentication"] is False


def test_workspace_persists_records_without_login():
    workspace = db.workspace()
    policy = db.create_policy(workspace["id"], {"policy_number":"POL-TEST", "type":"Health", "plan":"Basic", "status":"Active", "sum_insured":"100", "premium":"10", "renewal_date":"2030-01-01", "coverage":[], "exclusions":[]})
    assert db.dashboard(workspace["id"])["policies"][0]["id"] == policy["id"]

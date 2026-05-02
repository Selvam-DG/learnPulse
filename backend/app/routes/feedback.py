import smtplib
import ssl
from datetime import datetime, timezone
from email.message import EmailMessage

from bson import ObjectId
from flask import Blueprint, abort, jsonify, request

from ..config import settings
from ..db import db
from ..models import FeedbackIn
from ..utils.auth import require_admin

bp = Blueprint("feedback", __name__)


def utc_now():
    return datetime.now(timezone.utc)


def serialize_feedback(doc):
    if not doc:
        return doc

    doc["id"] = str(doc.pop("_id"))

    if isinstance(doc.get("created_at"), datetime):
        doc["created_at"] = doc["created_at"].isoformat()

    if isinstance(doc.get("updated_at"), datetime):
        doc["updated_at"] = doc["updated_at"].isoformat()

    return doc


@bp.post("/api/feedback")
def feedback():
    data = request.get_json() or {}

    try:
        payload = FeedbackIn(**data).model_dump()
    except Exception as e:
        abort(400, description=str(e))

    now = utc_now()

    payload["created_at"] = now
    payload["updated_at"] = now
    payload["status"] = "new"
    payload["source"] = data.get("source", "web")

    result = db.feedback.insert_one(payload)
    payload["_id"] = result.inserted_id

    if (
        settings.SMTP_HOST
        and settings.SMTP_FROM
        and settings.SMTP_USER
        and settings.SMTP_PASS
    ):
        try:
            msg = EmailMessage()
            msg["Subject"] = f"[LearnPulse] Topic suggestion: {payload['topic']}"
            msg["From"] = settings.SMTP_FROM
            msg["To"] = settings.SMTP_USER

            body = (
                f"From: {payload.get('name', '')} <{payload['email']}>\n"
                f"Topic: {payload['topic']}\n\n"
                f"{payload.get('message', '')}"
            )

            msg.set_content(body)

            context = ssl.create_default_context()

            with smtplib.SMTP_SSL(
                settings.SMTP_HOST, settings.SMTP_PORT or 465, context=context
            ) as server:
                server.login(settings.SMTP_USER, settings.SMTP_PASS)
                server.send_message(msg)

            response = serialize_feedback(payload)
            response["emailed"] = True

            return jsonify(response), 201
        except Exception as e:
            response = serialize_feedback(payload)
            response["emailed"] = False
            response["email_error"] = str(e)

            return jsonify(response), 201

    response = serialize_feedback(payload)
    response["emailed"] = False

    return jsonify(response), 201


@bp.get("/api/admin/suggestions")
def list_suggestions():
    require_admin()

    status = request.args.get("status")
    query = {}

    if status and status != "all":
        query["status"] = status

    cur = db.feedback.find(query).sort("created_at", -1)

    return jsonify({"items": [serialize_feedback(doc) for doc in cur]})


@bp.put("/api/admin/suggestions/<suggestion_id>")
def update_suggestion(suggestion_id):
    require_admin()

    data = request.get_json() or {}

    allowed_statuses = {"new", "reviewing", "added", "rejected"}

    updates = {}

    if "name" in data:
        updates["name"] = data.get("name") or ""

    if "email" in data:
        updates["email"] = data.get("email") or ""

    if "topic" in data:
        updates["topic"] = data.get("topic") or ""

    if "message" in data:
        updates["message"] = data.get("message") or ""

    if "status" in data:
        status = data.get("status")

        if status not in allowed_statuses:
            abort(400, description="Invalid suggestion status")

        updates["status"] = status

    if "admin_note" in data:
        updates["admin_note"] = data.get("admin_note") or ""

    if not updates:
        abort(400, description="No valid fields to update")

    updates["updated_at"] = utc_now()

    try:
        oid = ObjectId(suggestion_id)
    except Exception:
        abort(400, description="Invalid suggestion id")

    result = db.feedback.update_one({"_id": oid}, {"$set": updates})

    if result.matched_count == 0:
        abort(404, description="Suggestion not found")

    updated = db.feedback.find_one({"_id": oid})

    return jsonify(serialize_feedback(updated))


@bp.delete("/api/admin/suggestions/<suggestion_id>")
def delete_suggestion(suggestion_id):
    require_admin()

    try:
        oid = ObjectId(suggestion_id)
    except Exception:
        abort(400, description="Invalid suggestion id")

    result = db.feedback.delete_one({"_id": oid})

    if result.deleted_count == 0:
        abort(404, description="Suggestion not found")

    return jsonify({"ok": True})

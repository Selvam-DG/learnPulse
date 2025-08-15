from flask import Blueprint, request, abort, jsonify
from datetime import datetime
import smtplib, ssl
from email.message import EmailMessage
from ..db import db
from ..models import FeedbackIn
from ..config import settings

bp = Blueprint("feedback", __name__)

@bp.post("/api/feedback")
def feedback():
    data = request.get_json() or {}
    try:
        payload = FeedbackIn(**data).model_dump()
    except Exception as e:
        abort(400, description=str(e))
    payload["created_at"] = datetime.utcnow()
    db.feedback.insert_one(payload)
    # optionally email
    if settings.SMTP_HOST and settings.SMTP_FROM and settings.SMTP_USER and settings.SMTP_PASS:
        try:
            msg = EmailMessage()
            msg["Subject"] = f"[60secLearn] Topic suggestion: {payload['topic']}"
            msg["From"] = settings.SMTP_FROM
            msg["To"] = settings.SMTP_USER
            body = f"From: {payload.get('name','')} <{payload['email']}>\nTopic: {payload['topic']}\n\n{payload.get('message','')}"
            msg.set_content(body)
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT or 465, context=context) as s:
                s.login(settings.SMTP_USER, settings.SMTP_PASS)
                s.send_message(msg)
        except Exception as e:
            # Don't fail the API if email fails; just include a note
            return jsonify({"ok": True, "emailed": False, "error": str(e)}), 201
    return jsonify({"ok": True, "emailed": bool(settings.SMTP_HOST)}), 201
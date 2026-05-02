from flask import Blueprint, abort, jsonify, request

from ..db import db
from ..models import TopicOut
from ..utils.auth import require_admin

bp = Blueprint("topics", __name__)


@bp.get("/api/topics")
def list_topics():
    cur = db.topics.find({}, {"_id": 0}).sort([("order", 1), ("name", 1)])
    return jsonify(list(cur))


@bp.post("/api/topics")
def create_topics():
    require_admin()
    data = request.get_json() or {}
    try:
        topic = TopicOut(**data).model_dump()
    except Exception as e:
        abort(400, description=str(e))
    db.topics.insert_one(topic)
    return topic, 201


@bp.put("/api/topics/<slug>")
def update_topic(slug):
    require_admin()
    data = request.get_json() or {}
    try:
        topic = TopicOut(**data).model_dump()
    except Exception as e:
        abort(400, description=str(e))

    result = db.topics.update_one({"slug": slug}, {"$set": topic})
    if result.matched_count == 0:
        abort(404, "Topic not found")
    return topic, 200


@bp.delete("/api/topics/<slug>")
def delete_topic(slug):
    require_admin()
    db.topics.delete_one({"slug": slug})
    return jsonify({"ok": True})

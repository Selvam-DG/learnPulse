from flask import Blueprint, jsonify, request, abort
from bson import ObjectId
from pymongo import ASCENDING, DESCENDING
from ..db import db
from ..models import LessonCreate, LessonOut
from ..utils.auth import require_admin
from ..utils.pagination import parse_pagination, make_cursor

bp = Blueprint("lessons", __name__)

@bp.get("/api/topics/<slug>/lessons")
def by_topic_level(slug):
    level = request.args.get("level")
    q = {"topic_slug": slug}
    if level:
        q["level"] = level
    limit, after_id = parse_pagination()

    if after_id:
        q["_id"] = {"$gt": after_id}
    cur = (db.lessons.find(q, {"_id": 1, "title": 1, "slug": 1, "summary": 1, "level": 1, "order": 1})
           .sort("_id", ASCENDING)
           .limit(limit))
    items = list(cur)
    next_cursor = make_cursor(items[-1]) if items else None
    # strip _id for list view
    for it in items:
        it.pop("_id", None)

    return jsonify({"items": items, "next_cursor": next_cursor})

@bp.get("/api/lessons/<slug>")
def get_lesson(slug):
    doc = db.lessons.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        abort(404, description="Lesson not found")
    return jsonify(doc)

@bp.post("/api/lessons")
def create_lesson():
    require_admin()
    data = request.get_json() or {}
    try:
        payload = LessonCreate(**data).model_dump()
    except Exception as e:
        abort(400, description=str(e))
    # upsert by slug
    db.lessons.update_one({"slug": payload["slug"]}, {"$set": payload}, upsert=True)
    return payload, 201

@bp.get("/api/search")
def search():
    q = (request.args.get("q") or "").strip()
    if not q:
        return jsonify({"items": []})
    limit, _ = parse_pagination()
    cur = (db.lessons.find({"$text": {"$search": q}},
                           {"_id": 0, "title": 1, "slug": 1, "summary": 1, "level": 1, "topic_slug": 1,
                            "score": {"$meta": "textScore"}})
           .sort([("score", {"$meta": "textScore"})])
           .limit(limit))
    return jsonify({"items": list(cur)})
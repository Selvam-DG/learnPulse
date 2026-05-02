from datetime import datetime, timezone

from flask import Blueprint, abort, jsonify, request
from pymongo import ASCENDING

from ..db import db
from ..models import LessonCreate
from ..utils.auth import require_admin
from ..utils.pagination import make_cursor, parse_pagination

bp = Blueprint("lessons", __name__)


def utc_now():
    return datetime.now(timezone.utc)


def serialize_lesson(doc):
    if not doc:
        return doc

    doc.pop("_id", None)

    if isinstance(doc.get("created_at"), datetime):
        doc["created_at"] = doc["created_at"].isoformat()

    if isinstance(doc.get("updated_at"), datetime):
        doc["updated_at"] = doc["updated_at"].isoformat()

    return doc


@bp.get("/api/topics/<slug>/lessons")
def by_topic_level(slug):
    level = request.args.get("level")
    q = {"topic_slug": slug}

    if level:
        q["level"] = level

    limit, after_id = parse_pagination()

    if after_id:
        q["_id"] = {"$gt": after_id}

    cur = (
        db.lessons.find(
            q,
            {
                "_id": 1,
                "title": 1,
                "slug": 1,
                "summary": 1,
                "level": 1,
                "order": 1,
                "topic_slug": 1,
                "tags": 1,
                "created_at": 1,
                "updated_at": 1,
            },
        )
        .sort([("order", ASCENDING), ("_id", ASCENDING)])
        .limit(limit)
    )

    items = list(cur)
    next_cursor = make_cursor(items[-1]) if items else None
    items = [serialize_lesson(item) for item in items]

    return jsonify({"items": items, "next_cursor": next_cursor})


@bp.get("/api/lessons/<slug>")
def get_lesson(slug):
    doc = db.lessons.find_one({"slug": slug})

    if not doc:
        abort(404, description="Lesson not found")

    return jsonify(serialize_lesson(doc))


@bp.post("/api/lessons")
def create_lesson():
    require_admin()

    data = request.get_json() or {}

    try:
        payload = LessonCreate(**data).model_dump()
    except Exception as e:
        abort(400, description=str(e))

    now = utc_now()

    existing = db.lessons.find_one({"slug": payload["slug"]})

    if existing:
        abort(409, description="Lesson with this slug already exists")

    payload["created_at"] = now
    payload["updated_at"] = now

    db.lessons.insert_one(payload)

    return jsonify(serialize_lesson(payload)), 201


@bp.put("/api/lessons/<slug>")
def update_lesson(slug):
    require_admin()

    data = request.get_json() or {}

    try:
        payload = LessonCreate(**data).model_dump()
    except Exception as e:
        abort(400, description=str(e))

    payload["updated_at"] = utc_now()

    res = db.lessons.update_one({"slug": slug}, {"$set": payload})

    if res.matched_count == 0:
        abort(404, description="Lesson not found")

    updated = db.lessons.find_one({"slug": payload["slug"]})

    return jsonify(serialize_lesson(updated)), 200


@bp.delete("/api/lessons/<slug>")
def delete_lesson(slug):
    require_admin()

    db.lessons.delete_one({"slug": slug})

    return jsonify({"ok": True})


@bp.get("/api/search")
def search():
    q = (request.args.get("q") or "").strip()

    if not q:
        return jsonify({"items": []})

    limit, _ = parse_pagination()

    cur = (
        db.lessons.find(
            {"$text": {"$search": q}},
            {
                "_id": 0,
                "title": 1,
                "slug": 1,
                "summary": 1,
                "level": 1,
                "topic_slug": 1,
                "updated_at": 1,
                "score": {"$meta": "textScore"},
            },
        )
        .sort([("score", {"$meta": "textScore"})])
        .limit(limit)
    )

    items = [serialize_lesson(item) for item in list(cur)]

    return jsonify({"items": items})

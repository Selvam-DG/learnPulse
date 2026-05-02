from pymongo import ASCENDING, TEXT, MongoClient

from .config import settings

_client = MongoClient(settings.MONGODB_URI)

db = _client[settings.MONGODB_DB]


def ensure_indexes():
    db.topics.create_index(
        [("slugs", ASCENDING)],
        unique=True,
        name="topics_slug_uq",
        partialFilterExpression={"slugs": {"$exists": True}},
    )

    db.lessons.create_index([("slug", ASCENDING)], unique=True, name="lessons_slug_uq")
    db.lessons.create_index(
        [("topic_slug", ASCENDING), ("level", ASCENDING), ("order", ASCENDING)],
        name="lessons_topic_level_order_idx",
    )
    # Full-text search on selected fields
    db.lessons.create_index(
        [
            ("title", TEXT),
            ("summary", TEXT),
            ("content_markdown", TEXT),
            ("tags", TEXT),
        ],
        name="lessons_text_idx",
        default_language="english",
    )
    db.feedback.create_index([("created_at", ASCENDING)], name="feedback_created_idx")
    db.feedback.create_index([("status", ASCENDING)], name="feedback_status_idx")
    db.feedback.create_index(
        [("topic", TEXT), ("message", TEXT)], name="feedback_text_idx"
    )

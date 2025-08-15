from bson import ObjectId
from flask import request

def parse_pagination(default_limit=24, max_limit=100):
    limit = min(int(request.args.get("limit", default_limit)), max_limit)
    cursor=request.args.get("cursor")
    after_id = ObjectId(cursor) if cursor else None
    return limit, after_id

def make_cursor(doc):
    oid = doc.get("_id")
    return str(oid) if oid else None
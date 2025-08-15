from flask import request, abort
from ..config import settings

def require_admin():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        abort(401, description="Missing bearer token")

    token = auth.split(" ", 1)[1].strip()
    if token != settings.ADMIN_BEARER_TOKEN:
        abort(403, description="Invalid token")
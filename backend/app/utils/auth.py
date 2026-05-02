import jwt
from flask import abort, request

from ..config import settings


def require_admin():
    auth = request.headers.get("Authorization", "")

    if not auth.startswith("Bearer "):
        abort(401, description="Missing token")

    token = auth.split(" ", 1)[1]

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        abort(401, description="Token expired")
    except jwt.InvalidTokenError:
        abort(403, description="Invalid token")

    if payload.get("type") != "access":
        abort(403, description="Invalid access token type")

    if payload.get("role") != "admin":
        abort(403, description="Unauthorized")

    return payload

from datetime import datetime, timedelta, timezone

import jwt
from flask import Blueprint, abort, jsonify, request

from ..config import settings

bp = Blueprint("admin_auth", __name__)


def _utcnow():
    return datetime.now(timezone.utc)


def create_token(username: str, token_type: str):
    if token_type == "access":
        expires_at = _utcnow() + timedelta(minutes=settings.JWT_ACCESS_MINUTES)
    elif token_type == "refresh":
        expires_at = _utcnow() + timedelta(days=settings.JWT_REFRESH_DAYS)
    else:
        raise ValueError("Invalid token type")

    payload = {
        "sub": username,
        "role": "admin",
        "type": token_type,
        "iat": _utcnow(),
        "exp": expires_at,
    }

    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def decode_token(token: str):
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        abort(401, description="Token expired")
    except jwt.InvalidTokenError:
        abort(403, description="Invalid token")


@bp.post("/api/admin/login")
def admin_login():
    data = request.get_json() or {}

    username = data.get("username")
    password = data.get("password")

    if username != settings.ADMIN_USERNAME or password != settings.ADMIN_PASSWORD:
        abort(401, description="Invalid credentials")

    access_token = create_token(username, "access")
    refresh_token = create_token(username, "refresh")

    return jsonify(
        {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer",
            "expires_in": settings.JWT_ACCESS_MINUTES * 60,
            "user": {
                "username": username,
                "role": "admin",
            },
        }
    )


@bp.post("/api/admin/refresh")
def refresh_access_token():
    data = request.get_json() or {}
    refresh_token = data.get("refresh_token")

    if not refresh_token:
        abort(401, description="Missing refresh token")

    payload = decode_token(refresh_token)

    if payload.get("type") != "refresh":
        abort(403, description="Invalid refresh token type")

    if payload.get("role") != "admin":
        abort(403, description="Unauthorized")

    username = payload.get("sub")
    access_token = create_token(username, "access")

    return jsonify(
        {
            "access_token": access_token,
            "token_type": "Bearer",
            "expires_in": settings.JWT_ACCESS_MINUTES * 60,
        }
    )


@bp.get("/api/admin/me")
def admin_me():
    auth = request.headers.get("Authorization", "")

    if not auth.startswith("Bearer "):
        abort(401, description="Missing token")

    token = auth.split(" ", 1)[1]
    payload = decode_token(token)

    if payload.get("type") != "access":
        abort(403, description="Invalid access token type")

    if payload.get("role") != "admin":
        abort(403, description="Unauthorized")

    return jsonify(
        {
            "username": payload.get("sub"),
            "role": payload.get("role"),
        }
    )

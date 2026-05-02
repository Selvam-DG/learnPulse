import os

import pytest

os.environ.setdefault("SECRET_KEY", "test-secret")
os.environ.setdefault("FLASK_ENV", "testing")
os.environ.setdefault("MONGODB_URI", "mongodb://localhost:27017")
os.environ.setdefault("MONGODB_DB", "learnpulse_test")
os.environ.setdefault("CORS_ORIGINS", '["http://localhost:8080"]')
os.environ.setdefault("ADMIN_USERNAME", "admin")
os.environ.setdefault("ADMIN_PASSWORD", "password123")
os.environ.setdefault("ADMIN_BEARER_TOKEN", "test-token")
os.environ.setdefault("JWT_ACCESS_MINUTES", "15")
os.environ.setdefault("JWT_REFRESH_DAYS", "7")


@pytest.fixture()
def app():
    from app import create_app
    from app.db import db

    flask_app = create_app()
    flask_app.config.update(TESTING=True)

    db.topics.delete_many({})
    db.lessons.delete_many({})
    db.feedback.delete_many({})

    yield flask_app

    db.topics.delete_many({})
    db.lessons.delete_many({})
    db.feedback.delete_many({})


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def admin_tokens(client):
    response = client.post(
        "/api/admin/login",
        json={
            "username": os.environ["ADMIN_USERNAME"],
            "password": os.environ["ADMIN_PASSWORD"],
        },
    )

    assert response.status_code == 200

    data = response.get_json()

    return {
        "access_token": data["access_token"],
        "refresh_token": data["refresh_token"],
    }


@pytest.fixture()
def admin_headers(admin_tokens):
    return {
        "Authorization": f"Bearer {admin_tokens['access_token']}",
    }

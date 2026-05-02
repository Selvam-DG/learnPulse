def test_create_topic_requires_auth(client):
    response = client.post(
        "/api/topics",
        json={
            "name": "Python",
            "slug": "python",
            "levels": ["basics", "intermediate", "advanced"],
            "order": 1,
        },
    )

    assert response.status_code == 401


def test_create_topic_with_admin_token(client, admin_headers):
    response = client.post(
        "/api/topics",
        json={
            "name": "Python",
            "slug": "python",
            "levels": ["basics", "intermediate", "advanced"],
            "order": 1,
        },
        headers=admin_headers,
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["name"] == "Python"
    assert data["slug"] == "python"


def test_create_lesson_requires_auth(client):
    response = client.post(
        "/api/lessons",
        json={
            "topic_slug": "python",
            "level": "basics",
            "order": 1,
            "title": "Variables",
            "slug": "python-variables",
            "summary": "Variables store values.",
            "content_markdown":"Variables are used to store reusable values in Python.",
            "code_blocks": [],
            "tags": ["python", "basics"],
        },
    )

    assert response.status_code == 401


def test_create_lesson_with_admin_token(client, admin_headers):
    response = client.post(
        "/api/lessons",
        json={
            "topic_slug": "python",
            "level": "basics",
            "order": 1,
            "title": "Variables",
            "slug": "python-variables",
            "summary": "Variables store values.",
            "content_markdown":"Variables are used to store reusable values in Python.",
            "code_blocks": [
                {
                    "language": "python",
                    "snippet": "name = 'LearnPulse'\nprint(name)",
                }
            ],
            "tags": ["python", "basics"],
        },
        headers=admin_headers,
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["title"] == "Variables"
    assert data["slug"] == "python-variables"

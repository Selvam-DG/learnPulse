def test_admin_login_success(client):
    response = client.post(
        "/api/admin/login",
        json={
            "username": "admin",
            "password": "password123",
        },
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "Bearer"
    assert data["user"]["username"] == "admin"
    assert data["user"]["role"] == "admin"


def test_admin_login_invalid_credentials(client):
    response = client.post(
        "/api/admin/login",
        json={
            "username": "admin",
            "password": "wrong-password",
        },
    )

    assert response.status_code == 401

    data = response.get_json()
    assert "error" in data


def test_admin_me_with_access_token(client, admin_headers):
    response = client.get("/api/admin/me", headers=admin_headers)

    assert response.status_code == 200

    data = response.get_json()

    assert data["username"] == "admin"
    assert data["role"] == "admin"


def test_admin_me_without_token(client):
    response = client.get("/api/admin/me")

    assert response.status_code == 401

    data = response.get_json()
    assert "error" in data


def test_refresh_token_returns_new_access_token(client, admin_tokens):
    response = client.post(
        "/api/admin/refresh",
        json={
            "refresh_token": admin_tokens["refresh_token"],
        },
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "access_token" in data
    assert data["token_type"] == "Bearer"


def test_refresh_endpoint_rejects_access_token(client, admin_tokens):
    response = client.post(
        "/api/admin/refresh",
        json={
            "refresh_token": admin_tokens["access_token"],
        },
    )

    assert response.status_code == 403

    data = response.get_json()
    assert "error" in data

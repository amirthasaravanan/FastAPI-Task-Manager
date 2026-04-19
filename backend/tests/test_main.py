import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# tests user registration 
def test_register_user():
    response = client.post(
        "/register",
        json={"email": "tester@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "tester@example.com"

# tests user login
def test_login_user():
    response = client.post(
        "/login",
        data={"username": "tester@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
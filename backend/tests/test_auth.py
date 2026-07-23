"""
Integration test suite for Backend Authentication (Sprint 1A).

Verifies user registration, duplicate email handling, password strength validation,
login token generation, JWT verification, and protected profile access.
"""

import time
import unittest
from fastapi.testclient import TestClient
from sqlalchemy import delete

from main import app
from app.database.session import AsyncSessionLocal
from app.models.user import User


class TestAuthenticationEndpoints(unittest.TestCase):
    """Test case suite for authentication endpoints."""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.test_email = f"testuser_{int(time.time())}@nova.ai"
        cls.test_password = "Password123"
        cls.test_name = "Nova Tester"

    def test_01_health_check(self):
        """Test health status endpoints."""
        res_v1 = self.client.get("/api/v1/status")
        self.assertEqual(res_v1.status_code, 200)
        self.assertEqual(res_v1.json()["database"], "ok")

        res_legacy = self.client.get("/api/status")
        self.assertEqual(res_legacy.status_code, 200)

    def test_02_register_validation_failure(self):
        """Test registration with weak password (missing digit)."""
        payload = {
            "name": "Weak User",
            "email": "weak@nova.ai",
            "password": "OnlyLettersPassword",
        }
        response = self.client.post("/api/v1/auth/register", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_03_register_success(self):
        """Test successful user registration."""
        payload = {
            "name": self.test_name,
            "email": self.test_email,
            "password": self.test_password,
        }
        response = self.client.post("/api/v1/auth/register", json=payload)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["email"], self.test_email)
        self.assertEqual(data["name"], self.test_name)
        self.assertIn("user_id", data)
        self.assertNotIn("hashed_password", data)

    def test_04_register_duplicate_email(self):
        """Test registering with an existing email returns 409 Conflict."""
        payload = {
            "name": "Duplicate User",
            "email": self.test_email,
            "password": "Password456",
        }
        response = self.client.post("/api/v1/auth/register", json=payload)
        self.assertEqual(response.status_code, 409)
        self.assertIn("already exists", response.json()["detail"])

    def test_05_login_invalid_password(self):
        """Test login with wrong password returns 401 Unauthorized."""
        payload = {
            "email": self.test_email,
            "password": "WrongPassword123",
        }
        response = self.client.post("/api/v1/auth/login", json=payload)
        self.assertEqual(response.status_code, 401)

    def test_06_login_success(self):
        """Test login with correct credentials returns JWT token."""
        payload = {
            "email": self.test_email,
            "password": self.test_password,
        }
        response = self.client.post("/api/v1/auth/login", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["token_type"], "bearer")

        TestAuthenticationEndpoints.token = data["access_token"]

    def test_07_get_me_success(self):
        """Test GET /api/v1/auth/me with valid Bearer token."""
        headers = {"Authorization": f"Bearer {self.token}"}
        response = self.client.get("/api/v1/auth/me", headers=headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["email"], self.test_email)
        self.assertEqual(data["name"], self.test_name)

    def test_08_get_me_unauthorized(self):
        """Test GET /api/v1/auth/me without token or with bad token returns 401."""
        response = self.client.get("/api/v1/auth/me")
        self.assertEqual(response.status_code, 401)

        bad_headers = {"Authorization": "Bearer invalid_jwt_token_payload"}
        response = self.client.get("/api/v1/auth/me", headers=bad_headers)
        self.assertEqual(response.status_code, 401)


if __name__ == "__main__":
    unittest.main()

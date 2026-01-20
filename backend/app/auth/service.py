# backend/app/auth/service.py
from app.auth.schemas import LoginRequest
from app.auth.jwt import create_access_token
from app.core.security import verify_password


# 🔐 테스트용 유저 (password = "1234")
FAKE_USER = {
    "id": 1,
    "email": "test@test.com",
    "password_hash": "$2b$12$JV4fzWUcBJHvtZfIiakcVOt300nYmonQtcWNacZ/xvpIDVtvcVDla",
}


def login_user(data: LoginRequest) -> dict | None:
    if data.email != FAKE_USER["email"]:
        return None

    if not verify_password(data.password, FAKE_USER["password_hash"]):
        return None

    access_token = create_access_token(
        data={
            "user_id": FAKE_USER["id"],
            "email": FAKE_USER["email"],
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

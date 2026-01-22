# backend/app/auth/schemas.py

from pydantic import BaseModel, EmailStr


# ===== Login =====
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ===== Signup =====
class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


class SignupResponse(BaseModel):
    message: str
    user_id: int

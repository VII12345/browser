from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str

class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str

class UserInfo(BaseModel):
    id: str
    email: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserInfo

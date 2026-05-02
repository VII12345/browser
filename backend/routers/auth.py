from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.auth import LoginRequest, RegisterRequest, ResetPasswordRequest
from services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    return auth_service.register_user(data, db)

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.login_user(data, db)

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    return auth_service.reset_password(data, db)

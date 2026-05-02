from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.user import User
from schemas.auth import LoginRequest, RegisterRequest, ResetPasswordRequest
from utils.security import hash_password, verify_password, create_access_token

def register_user(data: RegisterRequest, db: Session) -> dict:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="邮箱已注册")
    
    user = User(
        email=data.email,
        hashed_password=hash_password(data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {"status": "success", "message": "注册成功"}

def login_user(data: LoginRequest, db: Session) -> dict:
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="邮箱或密码错误")
    
    token = create_access_token({"user_id": user.id, "email": user.email})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email}
    }

def reset_password(data: ResetPasswordRequest, db: Session) -> dict:
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    user.hashed_password = hash_password(data.new_password)
    db.commit()
    
    return {"status": "success", "message": "密码重置成功"}

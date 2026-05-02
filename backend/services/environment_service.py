from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from models.environment import Environment
from schemas.environment import EnvironmentCreate, EnvironmentUpdate
from typing import List

def create_environment(data: EnvironmentCreate, user_id: str, db: Session) -> dict:
    env_data = data.dict()
    if "group" in env_data:
        env_data["group_name"] = env_data.pop("group")
    env_data["user_id"] = user_id
    env = Environment(**env_data)
    db.add(env)
    db.commit()
    db.refresh(env)
    
    return {"status": "success", "data": {"id": env.id, "src": env.src}}

def list_environments(user_id: str, db: Session) -> list:
    envs = db.query(Environment).filter(Environment.user_id == user_id).all()
    return [
        {
            "id": e.id, "src": e.src, "name": e.name, "os": e.os,
            "user_agent": e.user_agent, "group": e.group_name, "notes": e.notes,
            "proxy_type": e.proxy_type, "proxy_ip_channel": e.proxy_ip_channel
        }
        for e in envs
    ]

def get_environment(env_id: int, user_id: str, db: Session) -> Environment:
    env = db.query(Environment).filter(
        Environment.id == env_id,
        Environment.user_id == user_id
    ).first()
    if not env:
        raise HTTPException(status_code=404, detail="环境不存在")
    return env

def update_environment(env_id: int, data: EnvironmentUpdate, user_id: str, db: Session) -> dict:
    env = get_environment(env_id, user_id, db)
    
    update_data = data.dict(exclude_unset=True)
    if "group" in update_data:
        update_data["group_name"] = update_data.pop("group")
    
    for key, value in update_data.items():
        setattr(env, key, value)
    
    db.commit()
    return {"status": "success"}

def delete_environment(env_id: int, user_id: str, db: Session) -> dict:
    env = get_environment(env_id, user_id, db)
    db.delete(env)
    db.commit()
    return {"status": "success", "message": "删除成功"}

def list_groups(user_id: str, db: Session) -> list:
    results = db.query(
        Environment.group_name,
        func.count(Environment.id)
    ).filter(
        Environment.user_id == user_id
    ).group_by(Environment.group_name).all()
    
    return [{"name": name, "count": count} for name, count in results]

def get_group_environments(group_name: str, user_id: str, db: Session) -> list:
    envs = db.query(Environment).filter(
        Environment.user_id == user_id,
        Environment.group_name == group_name
    ).all()
    
    return [
        {
            "id": e.id, "src": e.src, "name": e.name, "os": e.os,
            "user_agent": e.user_agent, "group": e.group_name, "notes": e.notes
        }
        for e in envs
    ]

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.environment import EnvironmentCreate, EnvironmentUpdate
from services import environment_service
from utils.deps import get_current_user

router = APIRouter(prefix="/api/environments", tags=["environments"])

@router.get("/")
def list_environments(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = environment_service.list_environments(user.id, db)
    return {"items": items}

@router.post("/")
def create_environment(data: EnvironmentCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return environment_service.create_environment(data, user.id, db)

@router.get("/{env_id}")
def get_environment(env_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    env = environment_service.get_environment(env_id, user.id, db)
    return env

@router.put("/{env_id}")
def update_environment(env_id: int, data: EnvironmentUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return environment_service.update_environment(env_id, data, user.id, db)

@router.delete("/{env_id}")
def delete_environment(env_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return environment_service.delete_environment(env_id, user.id, db)

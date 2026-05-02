from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from services import environment_service
from utils.deps import get_current_user

router = APIRouter(prefix="/api/groups", tags=["groups"])

@router.get("/")
def list_groups(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    groups = environment_service.list_groups(user.id, db)
    return {"groups": groups}

@router.get("/{group_name}/environments")
def get_group_environments(group_name: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = environment_service.get_group_environments(group_name, user.id, db)
    return {"items": items}

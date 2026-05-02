import os
import json
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from utils.deps import get_current_user
from config import UPLOAD_DIR

router = APIRouter(prefix="/api/sync", tags=["sync"])

@router.post("/upload")
async def upload_config(
    user_id: str = Form(...),
    config_file: UploadFile = File(...),
    fingerprint_file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_dir = os.path.join(UPLOAD_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)
    
    config_content = await config_file.read()
    with open(os.path.join(user_dir, config_file.filename), "wb") as f:
        f.write(config_content)
    
    fp_content = await fingerprint_file.read()
    with open(os.path.join(user_dir, fingerprint_file.filename), "wb") as f:
        f.write(fp_content)
    
    return {"status": "success", "message": "上传成功"}

@router.get("/download/{user_id}")
def download_configs(user_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_dir = os.path.join(UPLOAD_DIR, user_id)
    
    if not os.path.exists(user_dir):
        return {"status": "success", "instances": []}
    
    files = []
    for filename in os.listdir(user_dir):
        if filename.endswith(".json"):
            files.append({
                "file_name": filename,
                "url": f"/uploads/{user_id}/{filename}"
            })
    
    return {"status": "success", "instances": [{"files": files}]}

@router.post("/delete_files_by_folder")
def delete_files(
    data: dict,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = data.get("user_id")
    files = data.get("files", [])
    
    user_dir = os.path.join(UPLOAD_DIR, user_id)
    
    deleted = []
    for filename in files:
        filepath = os.path.join(user_dir, filename)
        if os.path.exists(filepath):
            os.remove(filepath)
            deleted.append(filename)
    
    return {"status": "success", "deleted_files": deleted}

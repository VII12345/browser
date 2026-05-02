from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
from routers import auth, environments, groups, sync
from config import UPLOAD_DIR
import os

# Create database tables
Base.metadata.create_all(bind=engine)

# Create upload directory
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="Browser Manager API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(environments.router)
app.include_router(groups.router)
app.include_router(sync.router)

@app.get("/health")
def health():
    return {"status": "ok"}

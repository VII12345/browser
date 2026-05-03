import os
import secrets

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", secrets.token_hex(32))
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 1440  # 24 hours

DATABASE_URL = "mysql+pymysql://root:050614Xzz@localhost:3306/browser_manager?charset=utf8mb4"
UPLOAD_DIR = "./uploads"

from sqlalchemy.orm import declarative_base

Base = declarative_base()

# 🔴 이게 핵심
from app.db.models import user
from app.db.models import battery_file_upload
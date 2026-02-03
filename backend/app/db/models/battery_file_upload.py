from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.db.base import Base  # 너희 Base 위치에 맞춰 유지

# ✅ Battery가 이미 있다면 이 클래스는 "참고용"이고, 실제론 기존 Battery를 사용해.
# class Battery(Base):
#     __tablename__ = "batteries"
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
#     battery_name = Column(String(100), nullable=False, index=True)
#     has_data = Column(Boolean, nullable=False, default=False)
#     created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

class BatteryFileUpload(Base):
    __tablename__ = "battery_file_uploads"

    id = Column(Integer, primary_key=True, index=True)

    battery_id = Column(Integer, ForeignKey("batteries.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    original_filename = Column(String(255), nullable=False)
    stored_path = Column(String(1024), nullable=False)
    file_ext = Column(String(16), nullable=False)
    file_size = Column(Integer, nullable=False, default=0)

    uploaded_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    battery = relationship("Battery", backref="uploads")

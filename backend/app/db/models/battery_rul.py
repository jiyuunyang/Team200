# backend/app/db/models/battery_rul.py

from sqlalchemy import Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from app.db.base import Base


class BatteryRUL(Base):
    __tablename__ = "battery_ruls"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    battery_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("batteries.id"), nullable=False
    )

    rul: Mapped[float] = mapped_column(Float, nullable=False)
    rul_status: Mapped[int] = mapped_column(Integer, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )

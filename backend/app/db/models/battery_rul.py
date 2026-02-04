# backend/app/db/models/battery_rul.py

from sqlalchemy import Integer, Float, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.db.base import Base

class BatteryRUL(Base):
    __tablename__ = "battery_ruls"

    id: Mapped[int] = mapped_column(primary_key=True)

    battery_id: Mapped[int] = mapped_column(
        ForeignKey("batteries.id"),
        nullable=False,
    )

    battery_file_upload_id: Mapped[int] = mapped_column(
        ForeignKey("battery_file_uploads.id"),
        nullable=True,
    )

    rul: Mapped[float]
    rul_status: Mapped[int]

    model: Mapped[str | None]
    model_version: Mapped[str | None]

    sequence_length: Mapped[int | None]
    feature_count: Mapped[int | None]
    latency_ms: Mapped[int | None]

    inference_time: Mapped[datetime | None]
    raw_response: Mapped[dict | None] = mapped_column(JSON)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

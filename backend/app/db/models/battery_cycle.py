from sqlalchemy import Integer, ForeignKey, JSON, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class BatteryCycle(Base):
    __tablename__ = "battery_cycles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    battery_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("batteries.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    cycle_index: Mapped[int] = mapped_column(
        Integer,
        index=True,
        nullable=False,
    )

    features: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
    )

    # ✅ 업로드/생성 시점
    created_at: Mapped[str] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    battery = relationship("Battery", back_populates="cycles")

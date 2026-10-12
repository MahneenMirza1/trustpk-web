from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.university import University


class Accreditation(Base):
    __tablename__ = "accreditations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    university_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("universities.id", ondelete="CASCADE"), nullable=False, index=True
    )
    program_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("programs.id", ondelete="SET NULL"), nullable=True
    )
    council: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(100), nullable=False)
    valid_till: Mapped[date | None] = mapped_column(Date, nullable=True)

    source_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    last_verified: Mapped[date | None] = mapped_column(Date, nullable=True)
    verification_status: Mapped[str | None] = mapped_column(String(50), nullable=True, default="VERIFIED")

    # Relationships
    university: Mapped["University"] = relationship("University", back_populates="accreditations")

from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy import Boolean, Date, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.program import Program
    from app.models.university import University


class AdmissionPolicy(Base):
    __tablename__ = "admission_policies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    university_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("universities.id", ondelete="CASCADE"), nullable=False, index=True
    )
    program_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("programs.id", ondelete="SET NULL"), nullable=True
    )

    min_intermediate_pct: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=60.00)
    entry_test_required: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    entry_test_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    required_background: Mapped[str | None] = mapped_column(String(255), nullable=True)
    additional_requirements: Mapped[str | None] = mapped_column(Text, nullable=True)

    source_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    last_verified: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    verification_status: Mapped[str] = mapped_column(String(50), nullable=False, default="VERIFIED")

    # Relationships
    university: Mapped["University"] = relationship("University", back_populates="admission_policies")
    program: Mapped["Program | None"] = relationship("Program", back_populates="admission_policy")


class HistoricalMerit(Base):
    __tablename__ = "historical_merit"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    program_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("programs.id", ondelete="CASCADE"), nullable=False, index=True
    )
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    closing_merit: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    source_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    last_verified: Mapped[date | None] = mapped_column(Date, nullable=True)
    verification_status: Mapped[str | None] = mapped_column(String(50), nullable=True, default="VERIFIED")

    # Relationship
    program: Mapped["Program"] = relationship("Program", back_populates="historical_merit")


class VerificationRecord(Base):
    __tablename__ = "verification_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    university_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("universities.id", ondelete="CASCADE"), nullable=False, index=True
    )
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False)  # HEC, ACCREDITATION, POLICY, MERIT_FORMULA
    item_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="VERIFIED")
    source_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    last_verified: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationship
    university: Mapped["University"] = relationship("University", back_populates="verification_records")

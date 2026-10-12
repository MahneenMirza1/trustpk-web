from datetime import date
from typing import TYPE_CHECKING, Any
from sqlalchemy import Date, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.policy_and_merit import AdmissionPolicy, HistoricalMerit
    from app.models.university import University


class Program(Base):
    __tablename__ = "programs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    university_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("universities.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, default="BS Program", index=True)
    degree_level: Mapped[str] = mapped_column(String(50), nullable=False, default="BS", index=True)
    department: Mapped[str] = mapped_column(String(255), nullable=False, default="General Faculty", index=True)

    # Dynamic merit formula & cutoffs
    merit_formula: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    last_closing_merit: Mapped[float | None] = mapped_column(Numeric(6, 2), nullable=True)
    closing_merit_display: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Admission timeline & test
    admission_deadline: Mapped[str | None] = mapped_column(String(100), nullable=True)
    admission_test: Mapped[str | None] = mapped_column(String(150), nullable=True)

    # Program-specific accreditation
    accreditation_body: Mapped[str | None] = mapped_column(String(100), nullable=True)
    accreditation_status: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Eligibility & fees
    eligibility_criteria: Mapped[str | None] = mapped_column(Text, nullable=True)
    fee_per_semester: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    fee_display: Mapped[str | None] = mapped_column(String(150), nullable=True)

    # Official verification source
    source_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    effective_year: Mapped[int] = mapped_column(Integer, nullable=False, default=2026, index=True)
    last_verified: Mapped[date | None] = mapped_column(Date, nullable=True)

    # Relationships
    university: Mapped["University"] = relationship("University", back_populates="programs")
    historical_merit: Mapped[list["HistoricalMerit"]] = relationship(
        "HistoricalMerit", back_populates="program", cascade="all, delete-orphan", lazy="selectin"
    )
    admission_policy: Mapped["AdmissionPolicy | None"] = relationship(
        "AdmissionPolicy", back_populates="program", uselist=False, lazy="selectin"
    )

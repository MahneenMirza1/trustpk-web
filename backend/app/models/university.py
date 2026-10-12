from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy import Date, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.accreditation import Accreditation
    from app.models.policy_and_merit import AdmissionPolicy, VerificationRecord
    from app.models.program import Program


class University(Base):
    __tablename__ = "universities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    sector: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    province: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    website: Mapped[str | None] = mapped_column(String(500), nullable=True)
    admission_portal_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    hec_recognition_status: Mapped[str | None] = mapped_column(String(50), nullable=True, default="Recognized")
    hec_source_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    hec_last_verified: Mapped[date | None] = mapped_column(Date, nullable=True)
    hec_tier: Mapped[str | None] = mapped_column(String(50), nullable=True)
    hec_advisory_note: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    # Admission deadline & latest closing merit
    latest_closing_merit: Mapped[float | None] = mapped_column(Numeric(6, 2), nullable=True)
    admission_closing_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    admission_closing_date_str: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Accommodation & Transport Charges + Portals
    hostel_charges: Mapped[str | None] = mapped_column(String(150), nullable=True)
    hostel_portal_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    route_charges: Mapped[str | None] = mapped_column(String(150), nullable=True)
    route_portal_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Relationships
    programs: Mapped[list["Program"]] = relationship(
        "Program", back_populates="university", cascade="all, delete-orphan", lazy="selectin"
    )
    accreditations: Mapped[list["Accreditation"]] = relationship(
        "Accreditation", back_populates="university", cascade="all, delete-orphan", lazy="selectin"
    )
    admission_policies: Mapped[list["AdmissionPolicy"]] = relationship(
        "AdmissionPolicy", back_populates="university", cascade="all, delete-orphan", lazy="selectin"
    )
    verification_records: Mapped[list["VerificationRecord"]] = relationship(
        "VerificationRecord", back_populates="university", cascade="all, delete-orphan", lazy="selectin"
    )
from datetime import date, datetime
from sqlalchemy import Boolean, Date, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class GovernmentJob(Base):
    """Stores verified government job opportunities from authentic official sources."""

    __tablename__ = "government_jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    organization: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    department: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    province: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)

    # Eligibility Criteria
    qualification: Mapped[str | None] = mapped_column(Text, nullable=True)
    degree_level: Mapped[str | None] = mapped_column(String(100), nullable=True)
    required_field: Mapped[str | None] = mapped_column(String(255), nullable=True)
    age_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    age_max: Mapped[int | None] = mapped_column(Integer, nullable=True)
    gender: Mapped[str | None] = mapped_column(String(50), nullable=True)
    domicile: Mapped[str | None] = mapped_column(String(255), nullable=True)
    quota: Mapped[str | None] = mapped_column(String(255), nullable=True)
    experience: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Job Details & Compensation
    pay_scale: Mapped[str | None] = mapped_column(String(100), nullable=True)  # e.g., BPS-16, BPS-17
    vacancies: Mapped[int | None] = mapped_column(Integer, nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    fee_amount: Mapped[str | None] = mapped_column(String(255), nullable=True)
    case_number: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Dates
    application_start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    application_deadline: Mapped[date | None] = mapped_column(Date, nullable=True, index=True)
    deadline_str: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Detailed Content
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    requirements: Mapped[str | None] = mapped_column(Text, nullable=True)
    required_documents: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Authentic Official Verification Links
    official_source: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    official_source_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)  # PPSC, NJP, OTS, SPSC, KPPSC, BPSC, FPSC
    source_website: Mapped[str] = mapped_column(String(500), nullable=False)
    official_advertisement_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    official_application_url: Mapped[str] = mapped_column(String(500), nullable=False)
    external_reference_id: Mapped[str | None] = mapped_column(String(500), nullable=True, unique=True, index=True)

    # Verification and Status
    last_verified_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now(), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="Active", nullable=False, index=True)  # Active, Closing Soon, Expired, Verification Required
    is_verified_source: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class JobSyncLog(Base):
    """Records audit logs of scraper sync runs from official government portals."""

    __tablename__ = "job_sync_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    source_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    source_name: Mapped[str] = mapped_column(String(200), nullable=False)
    jobs_found: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    jobs_added: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    jobs_updated: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    jobs_expired: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)  # success, partial, failed
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now(), nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

from datetime import date, datetime
from typing import Any
from pydantic import BaseModel, Field


class JobBase(BaseModel):
    title: str
    organization: str
    department: str | None = None
    province: str
    category: str
    qualification: str | None = None
    degree_level: str | None = None
    required_field: str | None = None
    age_min: int | None = None
    age_max: int | None = None
    gender: str | None = None
    domicile: str | None = None
    quota: str | None = None
    experience: str | None = None
    pay_scale: str | None = None
    vacancies: int | None = None
    location: str | None = None
    fee_amount: str | None = None
    case_number: str | None = None
    application_start_date: date | None = None
    application_deadline: date | None = None
    deadline_str: str | None = None
    description: str | None = None
    requirements: str | None = None
    required_documents: str | None = None
    official_source: str
    official_source_code: str
    source_website: str
    official_advertisement_url: str | None = None
    official_application_url: str
    status: str
    is_verified_source: bool = True


class JobListItem(BaseModel):
    id: int
    title: str
    organization: str
    department: str | None = None
    province: str
    category: str
    qualification: str | None = None
    degree_level: str | None = None
    pay_scale: str | None = None
    vacancies: int | None = None
    location: str | None = None
    application_deadline: date | None = None
    deadline_str: str | None = None
    official_source: str
    official_source_code: str
    status: str
    last_verified_at: datetime
    is_verified_source: bool

    class Config:
        from_attributes = True


class JobDetail(JobBase):
    id: int
    external_reference_id: str | None = None
    last_verified_at: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class JobsListResponse(BaseModel):
    items: list[JobListItem]
    total: int
    page: int
    page_size: int
    total_pages: int
    active_filters: dict[str, Any] = Field(default_factory=dict)


class FilterOptionCount(BaseModel):
    value: str
    label: str
    count: int


class JobFiltersResponse(BaseModel):
    provinces: list[FilterOptionCount]
    categories: list[FilterOptionCount]
    pay_scales: list[FilterOptionCount]
    qualifications: list[FilterOptionCount]
    sources: list[FilterOptionCount]
    total_active_jobs: int


class OfficialSourceSummary(BaseModel):
    code: str
    name: str
    website: str
    portal_type: str
    description: str
    status: str  # "Active", "Operational", "Syncing"
    last_synced_at: datetime | None = None
    total_jobs: int = 0
    active_jobs: int = 0


class EligibilityCheckRequest(BaseModel):
    job_id: int
    province: str | None = None
    qualification: str | None = None
    degree_major: str | None = None
    age: int | None = None
    gender: str | None = None
    experience_years: float | None = None


class EligibilityCriteriaCheck(BaseModel):
    criterion: str
    required: str
    user_value: str | None
    is_eligible: bool | None  # True: meets, False: does not meet, None: not specified / manual check
    notes: str


class EligibilityCheckResult(BaseModel):
    job_id: int
    job_title: str
    overall_status: str  # "Likely Eligible", "May Not Meet Requirements", "Information Needed"
    disclaimer: str = (
        "Eligibility is based on the information published in the official advertisement. "
        "Please verify all requirements on the official source before applying."
    )
    criteria_checks: list[EligibilityCriteriaCheck]
    official_advertisement_url: str | None = None
    official_application_url: str

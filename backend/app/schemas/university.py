from datetime import date
from typing import Any
from pydantic import BaseModel, ConfigDict


class MeritFormulaComponent(BaseModel):
    key: str
    label: str
    weight: float

    model_config = ConfigDict(from_attributes=True)


class MeritFormulaData(BaseModel):
    notes: str | None = None
    components: list[MeritFormulaComponent] = []

    model_config = ConfigDict(from_attributes=True)


class HistoricalMeritResponse(BaseModel):
    id: int
    year: int
    closing_merit: float
    source_url: str | None = None
    last_verified: date | None = None
    verification_status: str | None = "VERIFIED"

    model_config = ConfigDict(from_attributes=True)


class AdmissionPolicyResponse(BaseModel):
    id: int
    program_id: int | None = None
    min_intermediate_pct: float
    entry_test_required: bool
    entry_test_name: str | None = None
    required_background: str | None = None
    additional_requirements: str | None = None
    source_url: str
    last_verified: date
    verification_status: str

    model_config = ConfigDict(from_attributes=True)


class ProgramResponse(BaseModel):
    id: int
    university_id: int
    department: str = "General Faculty"
    name: str
    degree_level: str
    merit_formula: dict[str, Any] | None = None
    last_closing_merit: float | None = None
    closing_merit_display: str | None = None
    admission_deadline: str | None = None
    accreditation_body: str | None = None
    accreditation_status: str | None = None
    eligibility_criteria: str | None = None
    admission_test: str | None = None
    fee_per_semester: float | None = None
    fee_display: str | None = None
    source_url: str
    effective_year: int
    last_verified: date | None = None
    historical_merit: list[HistoricalMeritResponse] = []
    admission_policy: AdmissionPolicyResponse | None = None

    model_config = ConfigDict(from_attributes=True)


class DepartmentProgramsResponse(BaseModel):
    department: str
    programs_count: int
    programs: list[ProgramResponse]

    model_config = ConfigDict(from_attributes=True)


class AccreditationResponse(BaseModel):
    id: int
    council: str
    status: str
    valid_till: date | None = None
    source_url: str | None = None
    last_verified: date | None = None
    verification_status: str | None = "VERIFIED"

    model_config = ConfigDict(from_attributes=True)


class VerificationRecordResponse(BaseModel):
    id: int
    entity_type: str
    item_name: str
    status: str
    source_url: str
    last_verified: date
    notes: str | None = None

    model_config = ConfigDict(from_attributes=True)


class UniversityCardResponse(BaseModel):
    id: int
    name: str
    sector: str
    province: str
    city: str
    website: str | None = None
    admission_portal_url: str | None = None
    hec_recognition_status: str = "Recognized"
    hec_last_verified: date | None = None
    hec_advisory_note: str | None = None
    program_accreditation_status: str = "Verified"
    admission_policy_status: str = "Available"
    programs_count: int = 0
    sample_programs: list[str] = []
    last_verified_display: str = "20 September 2026"

    # Closing merit, deadline, hostel and route charges
    latest_closing_merit: float | None = None
    admission_closing_date: str | None = None
    hostel_charges: str | None = None
    hostel_portal_url: str | None = None
    route_charges: str | None = None
    route_portal_url: str | None = None

    model_config = ConfigDict(from_attributes=True)


class UniversityDetailResponse(BaseModel):
    id: int
    name: str
    sector: str
    province: str
    city: str
    website: str | None = None
    admission_portal_url: str | None = None
    hec_recognition_status: str = "Recognized"
    hec_source_url: str | None = None
    hec_last_verified: date | None = None
    hec_tier: str | None = None
    hec_advisory_note: str | None = None

    # Closing merit, deadline, hostel and route charges
    latest_closing_merit: float | None = None
    admission_closing_date: str | None = None
    hostel_charges: str | None = None
    hostel_portal_url: str | None = None
    route_charges: str | None = None
    route_portal_url: str | None = None

    departments: list[DepartmentProgramsResponse] = []
    programs: list[ProgramResponse] = []
    accreditations: list[AccreditationResponse] = []
    admission_policies: list[AdmissionPolicyResponse] = []
    verification_records: list[VerificationRecordResponse] = []

    model_config = ConfigDict(from_attributes=True)


# Calculation Schemas
class MeritCalculationRequest(BaseModel):
    program_id: int
    scores: dict[str, float]  # e.g. {"matric": 85, "intermediate": 80, "entry_test": 75}


class MeritCalculationResponse(BaseModel):
    program_id: int
    program_name: str
    calculated_merit: float
    formula_used: list[dict[str, Any]]
    notes: str | None = None
    source_url: str | None = None


# AI Query Schemas
class AskUniversityAIRequest(BaseModel):
    question: str


class AskUniversityAIResponse(BaseModel):
    answer: str
    citations: list[dict[str, str]]
    official_portal_url: str | None = None
    verified_data_used: bool = True

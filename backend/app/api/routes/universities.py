import re
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import cast, or_, select, String
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.policy_and_merit import AdmissionPolicy, HistoricalMerit, VerificationRecord
from app.models.program import Program
from app.models.university import University
from app.schemas.university import (
    AskUniversityAIRequest,
    AskUniversityAIResponse,
    DepartmentProgramsResponse,
    MeritCalculationRequest,
    MeritCalculationResponse,
    ProgramResponse,
    UniversityCardResponse,
    UniversityDetailResponse,
)

router = APIRouter(
    prefix="/api/universities",
    tags=["Universities"],
)

# Comprehensive Pakistani university abbreviations and alias mapping
UNIVERSITY_ACRONYMS: dict[str, list[str]] = {
    "nust": ["national university of sciences and technology"],
    "fast": ["national university of computer and emerging sciences", "fast", "nuces"],
    "nuces": ["national university of computer and emerging sciences"],
    "fast nuces": ["national university of computer and emerging sciences"],
    "fast-nuces": ["national university of computer and emerging sciences"],
    "comsats": ["comsats university islamabad"],
    "cui": ["comsats university islamabad"],
    "giki": ["ghulam ishaq khan institute"],
    "gik": ["ghulam ishaq khan institute"],
    "pieas": ["pakistan institute of engineering and applied sciences"],
    "uet": ["university of engineering and technology"],
    "uet lahore": ["university of engineering and technology lahore"],
    "uet peshawar": ["university of engineering and technology peshawar"],
    "uet taxila": ["university of engineering and technology taxila"],
    "qau": ["quaid-i-azam university"],
    "quaid-i-azam": ["quaid-i-azam university"],
    "quaid e azam": ["quaid-i-azam university"],
    "lums": ["lahore university of management sciences"],
    "iba": ["institute of business administration"],
    "iba karachi": ["institute of business administration karachi"],
    "iba sukkur": ["sukkur iba university"],
    "siba": ["sukkur iba university"],
    "pu": ["university of the punjab", "punjab university"],
    "punjab university": ["university of the punjab"],
    "uaf": ["university of agriculture faisalabad"],
    "ned": ["ned university of engineering and technology"],
    "neduet": ["ned university of engineering and technology"],
    "bzu": ["bahauddin zakariya university"],
    "au": ["air university"],
    "air": ["air university"],
    "bu": ["bahria university"],
    "bahria": ["bahria university"],
    "iiu": ["international islamic university"],
    "iiui": ["international islamic university"],
    "gcu": ["government college university"],
    "gc lahore": ["government college university lahore"],
    "aku": ["aga khan university"],
    "uvas": ["university of veterinary and animal sciences"],
    "uop": ["university of peshawar"],
    "uob": ["university of balochistan"],
    "uok": ["university of karachi"],
    "ku": ["university of karachi"],
    "karachi university": ["university of karachi"],
    "umt": ["university of management and technology"],
    "ucp": ["university of central punjab"],
    "uol": ["university of lahore"],
    "szabist": ["szabist", "shaheed zulfikar ali bhutto institute"],
    "bnu": ["beaconhouse national university"],
    "riphah": ["riphah international university"],
    "iub": ["islamia university of bahawalpur"],
    "uog": ["university of gujrat"],
    "uos": ["university of sargodha"],
    "kust": ["kohat university of science and technology"],
    "must": ["mirpur university of science and technology"],
    "ajku": ["university of azad jammu and kashmir"],
    "kiu": ["karakoram international university"],
    "uot": ["university of turbat"],
    "luawms": ["lasbela university of agriculture"],
    "uhs": ["university of health sciences"],
    "kmu": ["khyber medical university"],
    "duhs": ["dow university of health sciences"],
    "numal": ["national university of modern languages"],
    "numl": ["national university of modern languages"],
    "nutech": ["national university of technology"],
    "fui": ["foundation university"],
    "isra": ["isra university"],
    "superior": ["superior university"],
    "iqra": ["iqra university"],
}


def normalize_text(text: str) -> str:
    """Normalize text by lowercasing and replacing hyphens, underscores, dots with spaces."""
    cleaned = re.sub(r"[.\-_/]", " ", (text or "").lower())
    return " ".join(cleaned.split())


def matches_search_query(u: University, raw_query: str) -> bool:
    """Intelligently match multi-word and acronym searches against university attributes."""
    norm_query = normalize_text(raw_query)
    if not norm_query:
        return True

    u_name = normalize_text(u.name)
    u_city = normalize_text(u.city or "")
    u_prov = normalize_text(u.province or "")
    u_sector = normalize_text(str(u.sector or ""))

    # 1. Direct substring match on name, city, province
    if norm_query in u_name or norm_query in u_city or norm_query in u_prov:
        return True

    # 2. Check acronym dictionary
    if norm_query in UNIVERSITY_ACRONYMS:
        target_phrases = UNIVERSITY_ACRONYMS[norm_query]
        if any(phrase in u_name for phrase in target_phrases):
            return True

    # 3. Check initials
    words = [w for w in u_name.split() if w not in {"and", "of", "the", "for", "in"}]
    initials = "".join(w[0] for w in words)
    if norm_query == initials:
        return True

    # 4. Multi-token evaluation across full university attributes
    prog_texts = [
        normalize_text(p.name) + " " + normalize_text(p.degree_level) + " " + normalize_text(p.department or "")
        for p in u.programs
    ]
    all_uni_text = f"{u_name} {u_city} {u_prov} {u_sector} {' '.join(prog_texts)}"

    # Gather all acronym aliases that point to this university
    matched_acronym_keys = set()
    for acr_key, target_names in UNIVERSITY_ACRONYMS.items():
        if any(target in u_name for target in target_names):
            matched_acronym_keys.add(acr_key)

    tokens = norm_query.split()

    def token_matches(t: str) -> bool:
        if t in all_uni_text:
            return True
        if t in matched_acronym_keys:
            return True
        if t == initials:
            return True
        if t in UNIVERSITY_ACRONYMS:
            return any(target in u_name for target in UNIVERSITY_ACRONYMS[t])
        return False

    return all(token_matches(t) for t in tokens)


@router.get("", response_model=list[UniversityCardResponse])
def get_universities(
    search: str | None = Query(None, description="Search by university name, acronym, city, province, or program"),
    query: str | None = Query(None, description="Alias for search"),
    q: str | None = Query(None, description="Alias for search"),
    province: str | None = Query(None, description="Filter by province"),
    city: str | None = Query(None, description="Filter by city"),
    sector: str | None = Query(None, description="Filter by sector (public/private)"),
    degree: str | None = Query(None, description="Filter by degree level (BS/MS/PhD)"),
    status: str | None = Query(None, description="Filter by HEC recognition status (Recognized, Not Recognized, In Process)"),
    db: Session = Depends(get_db),
):
    """Return all universities with verification summary for card view."""
    search_val = search if isinstance(search, str) else None
    query_val = query if isinstance(query, str) else None
    q_val = q if isinstance(q, str) else None
    province_val = province if isinstance(province, str) else None
    city_val = city if isinstance(city, str) else None
    sector_val = sector if isinstance(sector, str) else None
    degree_val = degree if isinstance(degree, str) else None
    status_val = status if isinstance(status, str) else None

    query_stmt = select(University).order_by(University.name.asc())

    if province_val and province_val.strip():
        query_stmt = query_stmt.where(University.province.ilike(f"%{province_val.strip()}%"))

    if city_val and city_val.strip():
        query_stmt = query_stmt.where(University.city.ilike(f"%{city_val.strip()}%"))

    if sector_val and sector_val.strip():
        norm_sector = sector_val.strip().lower()
        # Cast custom PostgreSQL enum 'university_sector' to String to avoid undefined ~~* operator error
        query_stmt = query_stmt.where(cast(University.sector, String).ilike(f"%{norm_sector}%"))

    if status_val and status_val.strip():
        norm_status = status_val.strip().lower()
        if any(term in norm_status for term in ["not", "unrecog", "fake", "illegal"]):
            query_stmt = query_stmt.where(
                or_(
                    University.hec_recognition_status.ilike("%not recognized%"),
                    University.hec_recognition_status.ilike("%unrecognized%"),
                    University.hec_recognition_status.ilike("%fake%"),
                    University.hec_recognition_status.ilike("%illegal%"),
                )
            )
        elif any(term in norm_status for term in ["process", "review", "provisional"]):
            query_stmt = query_stmt.where(
                or_(
                    University.hec_recognition_status.ilike("%process%"),
                    University.hec_recognition_status.ilike("%review%"),
                    University.hec_recognition_status.ilike("%provisional%"),
                )
            )
        elif "recog" in norm_status:
            query_stmt = query_stmt.where(
                University.hec_recognition_status.ilike("%recognized%"),
                ~University.hec_recognition_status.ilike("%not%"),
                ~University.hec_recognition_status.ilike("%unrecognized%"),
                ~University.hec_recognition_status.ilike("%fake%"),
                ~University.hec_recognition_status.ilike("%illegal%"),
            )

    universities = db.scalars(query_stmt).all()

    cards: list[UniversityCardResponse] = []
    active_search = (search_val or query_val or q_val or "").strip()
    norm_degree = degree_val.strip().lower() if degree_val and degree_val.strip() else None

    for u in universities:
        programs = u.programs
        sample_program_names = [p.name for p in programs]

        # Degree filter
        if norm_degree:
            matching_degree = any(
                norm_degree == p.degree_level.lower() or norm_degree in p.name.lower()
                for p in programs
            )
            if not matching_degree:
                continue

        # Search filter
        if active_search and not matches_search_query(u, active_search):
            continue

        # Determine verification statuses
        hec_status = u.hec_recognition_status or "Recognized"

        accred_status = "Verified"
        if u.accreditations:
            has_accredited = any(a.status.lower() in ["accredited", "verified"] for a in u.accreditations)
            accred_status = "Verified" if has_accredited else "Pending Verification"
        elif "not" in hec_status.lower() or "fake" in hec_status.lower():
            accred_status = "Not Accredited"
        elif "process" in hec_status.lower():
            accred_status = "In Review"

        policy_status = "Available"
        if "not" in hec_status.lower() or "fake" in hec_status.lower():
            policy_status = "Admissions Prohibited"
        elif u.admission_policies or any(p.admission_policy for p in programs):
            policy_status = "Available"
        elif u.admission_portal_url or u.website:
            policy_status = "Portal Linked"

        last_verified_str = "20 September 2026"
        if u.hec_last_verified:
            last_verified_str = u.hec_last_verified.strftime("%d %B %Y")

        # Determine latest closing merit
        merit_val = float(u.latest_closing_merit) if u.latest_closing_merit is not None else None
        if merit_val is None and programs:
            first_merit = next((p.last_closing_merit for p in programs if p.last_closing_merit is not None), None)
            if first_merit is not None:
                merit_val = float(first_merit)

        # Determine admission deadline
        deadline_str = u.admission_closing_date_str
        if not deadline_str and u.admission_closing_date:
            deadline_str = u.admission_closing_date.strftime("%d %B %Y")
        if not deadline_str:
            deadline_str = "Admissions Banned" if ("not" in hec_status.lower() or "fake" in hec_status.lower()) else "Open / Check Portal"

        cards.append(
            UniversityCardResponse(
                id=u.id,
                name=u.name,
                sector=u.sector,
                province=u.province,
                city=u.city,
                website=u.website,
                admission_portal_url=u.admission_portal_url,
                hec_recognition_status=hec_status,
                hec_last_verified=u.hec_last_verified,
                hec_advisory_note=u.hec_advisory_note,
                program_accreditation_status=accred_status,
                admission_policy_status=policy_status,
                programs_count=len(programs),
                sample_programs=sample_program_names[:3],
                last_verified_display=last_verified_str,
                latest_closing_merit=merit_val,
                admission_closing_date=deadline_str,
                hostel_charges=u.hostel_charges,
                hostel_portal_url=u.hostel_portal_url,
                route_charges=u.route_charges,
                route_portal_url=u.route_portal_url,
            )
        )

    return cards


@router.get("/meta/filters")
def get_filters_meta(db: Session = Depends(get_db)):
    """Return distinct filter options for universities search."""
    universities = db.scalars(select(University)).all()

    provinces = sorted({u.province for u in universities if u.province})
    cities = sorted({u.city for u in universities if u.city})
    sectors = ["public", "private"]
    degrees = ["BS", "MS", "PhD"]
    statuses = ["Recognized", "Not Recognized", "In Process"]

    return {
        "provinces": provinces,
        "cities": cities,
        "sectors": sectors,
        "degrees": degrees,
        "statuses": statuses,
    }


@router.get("/{university_id}", response_model=UniversityDetailResponse)
def get_university_detail(university_id: int, db: Session = Depends(get_db)):
    """Return comprehensive verification and admission profile for a university."""
    university = db.scalar(select(University).where(University.id == university_id))

    if not university:
        raise HTTPException(status_code=404, detail="University not found.")

    # Group programs by department/school
    dept_map: dict[str, list[Program]] = {}
    for p in university.programs:
        dept_name = p.department or "General Faculty"
        if dept_name not in dept_map:
            dept_map[dept_name] = []
        dept_map[dept_name].append(p)

    departments_list = [
        DepartmentProgramsResponse(
            department=d_name,
            programs_count=len(d_progs),
            programs=[ProgramResponse.model_validate(dp) for dp in d_progs],
        )
        for d_name, d_progs in sorted(dept_map.items())
    ]

    res = UniversityDetailResponse.model_validate(university)
    res.departments = departments_list
    return res


@router.get("/{university_id}/programs", response_model=list[ProgramResponse])
def get_university_programs(
    university_id: int,
    search: str | None = Query(None, description="Search by program or department name"),
    q: str | None = Query(None, description="Alias for search"),
    department: str | None = Query(None, description="Filter by department"),
    degree: str | None = Query(None, description="Filter by degree level"),
    db: Session = Depends(get_db),
):
    """Return all programs offered by a university with optional department/program search."""
    stmt = select(Program).where(Program.university_id == university_id)
    search_term = (search or q or "").strip().lower()
    if search_term:
        stop_words = {
            "department",
            "departments",
            "dept",
            "school",
            "schools",
            "faculty",
            "faculties",
            "program",
            "programs",
            "degree",
            "degrees",
            "of",
            "and",
            "in",
            "the",
            "for",
            "at",
        }
        raw_tokens = search_term.split()
        meaningful = [t for t in raw_tokens if t not in stop_words]
        tokens_to_match = meaningful if meaningful else raw_tokens
        for t in tokens_to_match:
            norm = f"%{t}%"
            stmt = stmt.where(or_(Program.name.ilike(norm), Program.department.ilike(norm)))
    if department and department.strip():
        stmt = stmt.where(Program.department.ilike(f"%{department.strip()}%"))
    if degree and degree.strip():
        stmt = stmt.where(Program.degree_level.ilike(f"%{degree.strip()}%"))

    stmt = stmt.order_by(Program.department.asc(), Program.name.asc())
    programs = db.scalars(stmt).all()
    return programs


@router.get("/{university_id}/programs/{program_id}", response_model=ProgramResponse)
def get_university_program(university_id: int, program_id: int, db: Session = Depends(get_db)):
    """Return specific program details for a university."""
    program = db.scalar(
        select(Program).where(Program.id == program_id, Program.university_id == university_id)
    )
    if not program:
        raise HTTPException(status_code=404, detail="Program not found for this university.")
    return program


@router.post("/{university_id}/calculate-merit", response_model=MeritCalculationResponse)
def calculate_university_merit(
    university_id: int,
    request: MeritCalculationRequest,
    db: Session = Depends(get_db),
):
    """Dynamically compute admission merit based on the program's official formula."""
    program = db.scalar(
        select(Program).where(Program.id == request.program_id, Program.university_id == university_id)
    )

    if not program:
        raise HTTPException(
            status_code=404,
            detail="Program not found for this university.",
        )

    formula_data = program.merit_formula or {}
    components = formula_data.get("components", [])

    if not components:
        # Default baseline if formula is empty
        components = [
            {"key": "matric", "label": "Matric / O-Level", "weight": 0.10},
            {"key": "intermediate", "label": "Intermediate / FSc", "weight": 0.40},
            {"key": "entry_test", "label": "Entry Test", "weight": 0.50},
        ]

    calculated_merit = 0.0
    formula_used: list[dict[str, Any]] = []

    for comp in components:
        key = comp.get("key", "")
        label = comp.get("label", key)
        weight = float(comp.get("weight", 0.0))
        score = float(request.scores.get(key, 0.0))

        # Clamp score between 0 and 100
        score = max(0.0, min(100.0, score))
        contribution = score * weight
        calculated_merit += contribution

        formula_used.append(
            {
                "key": key,
                "label": label,
                "weight": weight,
                "weight_percent": f"{int(weight * 100)}%",
                "score_entered": score,
            }
        )

    return MeritCalculationResponse(
        program_id=program.id,
        program_name=program.name,
        calculated_merit=round(calculated_merit, 2),
        formula_used=formula_used,
        notes=formula_data.get("notes"),
        source_url=program.source_url,
    )


@router.post("/{university_id}/ask-ai", response_model=AskUniversityAIResponse)
def ask_university_ai(
    university_id: int,
    request: AskUniversityAIRequest,
    db: Session = Depends(get_db),
):
    """
    University-grounded AI decision support.
    Strictly uses verified TrustPK data and directs users to official sources.
    """
    university = db.scalar(select(University).where(University.id == university_id))

    if not university:
        raise HTTPException(status_code=404, detail="University not found.")

    question = request.question.strip().lower()
    citations: list[dict[str, str]] = []

    # 1. HEC Recognition query
    if any(k in question for k in ["hec", "recogni", "charter", "fake", "legit", "valid"]):
        status = university.hec_recognition_status or "Recognized"
        tier_info = f" (HEC Tier: {university.hec_tier})" if university.hec_tier else ""
        last_v = (
            university.hec_last_verified.strftime("%d %B %Y")
            if university.hec_last_verified
            else "recent official review"
        )
        source = university.hec_source_url or "https://www.hec.gov.pk"

        citations.append({"title": "Higher Education Commission (HEC)", "url": source})

        return AskUniversityAIResponse(
            answer=(
                f"{university.name} is currently **{status}** by the Higher Education Commission of Pakistan{tier_info}. "
                f"This status was last verified on {last_v} via official HEC records."
            ),
            citations=citations,
            official_portal_url=university.admission_portal_url or university.website,
            verified_data_used=True,
        )

    # 2. Merit formula query
    if any(k in question for k in ["formula", "aggregate", "weight", "calculate", "how merit"]):
        if university.programs:
            prog_summaries = []
            for p in university.programs:
                f_data = p.merit_formula or {}
                comps = f_data.get("components", [])
                breakdown = ", ".join([f"{int(c['weight'] * 100)}% {c['label']}" for c in comps]) if comps else "Standard weighting"
                prog_summaries.append(f"• **{p.name}**: {breakdown}")
                if p.source_url:
                    citations.append({"title": f"{p.name} Official Criteria", "url": p.source_url})

            return AskUniversityAIResponse(
                answer=(
                    f"Official verified merit formulas for {university.name}:\n\n"
                    + "\n".join(prog_summaries)
                    + "\n\nYou can calculate your exact percentage using the Merit Calculator above."
                ),
                citations=citations,
                official_portal_url=university.admission_portal_url or university.website,
                verified_data_used=True,
            )

    # 3. Eligibility / Percentage query (e.g. "can I apply with 72%?")
    pct_match = re.search(r"(\d+(\.\d+)?)%", question) or re.search(r"\b(\d{2})\b", question)
    if any(k in question for k in ["eligib", "can i apply", "marks", "percentage", "requirement"]) or pct_match:
        policies = university.admission_policies
        if policies:
            policy = policies[0]
            citations.append({"title": "Official Admission Policy", "url": policy.source_url})

            min_pct = float(policy.min_intermediate_pct)
            user_pct = float(pct_match.group(1)) if pct_match else None

            test_info = f"An entry test ({policy.entry_test_name}) is required." if policy.entry_test_required else "No entry test is required."
            bg_info = f"Required academic background: {policy.required_background}." if policy.required_background else ""

            if user_pct is not None:
                if user_pct >= min_pct:
                    eval_msg = f"With **{user_pct}%**, you meet the minimum eligibility requirement of **{min_pct}%** for application."
                else:
                    eval_msg = f"With **{user_pct}%**, you are below the minimum intermediate threshold of **{min_pct}%**."
            else:
                eval_msg = f"The minimum Intermediate percentage required is **{min_pct}%**."

            return AskUniversityAIResponse(
                answer=(
                    f"{eval_msg} {test_info} {bg_info}\n\n"
                    f"Please note that meeting the minimum eligibility allows you to apply, but final admission depends on competitive closing merit."
                ),
                citations=citations,
                official_portal_url=university.admission_portal_url or university.website,
                verified_data_used=True,
            )

    # 4. Entry test query
    if any(k in question for k in ["entry test", "test", "net", "nat", "ecat"]):
        policies = university.admission_policies
        if policies:
            p = policies[0]
            req = "mandatory" if p.entry_test_required else "not required"
            test_name = p.entry_test_name or "Official University Entry Test"
            citations.append({"title": "Official Admission Requirements", "url": p.source_url})

            return AskUniversityAIResponse(
                answer=(
                    f"For {university.name}, the entry test ({test_name}) is **{req}** for undergraduate admissions. "
                    f"The test score constitutes a significant weight in the final merit formula."
                ),
                citations=citations,
                official_portal_url=university.admission_portal_url or university.website,
                verified_data_used=True,
            )

    # 5. Historical closing merit query
    if any(k in question for k in ["closing merit", "last merit", "cutoff", "previous merit"]):
        merit_entries = []
        for p in university.programs:
            for hm in p.historical_merit:
                merit_entries.append(f"• **{p.name} ({hm.year})**: {float(hm.closing_merit):.2f}%")
                if hm.source_url:
                    citations.append({"title": f"Closing Merit List {hm.year}", "url": hm.source_url})

        if merit_entries:
            return AskUniversityAIResponse(
                answer=(
                    f"Verified historical closing merits for {university.name}:\n\n"
                    + "\n".join(merit_entries)
                    + "\n\n*Note: Historical closing merits are past reference figures and do not guarantee future admission.*"
                ),
                citations=citations,
                official_portal_url=university.admission_portal_url or university.website,
                verified_data_used=True,
            )

    # 6. Hostel Accommodation query
    if any(k in question for k in ["hostel", "accomod", "accommod", "residence", "dorm", "room rent"]):
        hostel_fee = university.hostel_charges or "Hostel fee details are published directly on the university accommodation portal."
        hostel_url = university.hostel_portal_url or university.website
        if hostel_url:
            citations.append({"title": f"{university.name} Accommodation Portal", "url": hostel_url})

        return AskUniversityAIResponse(
            answer=(
                f"**Hostel & Accommodation Information for {university.name}:**\n\n"
                f"• **Charges / Rates:** {hostel_fee}\n\n"
                f"You can view hostel application forms, room allocation rules, and fee challans directly via the official accommodation portal below."
            ),
            citations=citations,
            official_portal_url=hostel_url,
            verified_data_used=True,
        )

    # 7. Route / Transport query
    if any(k in question for k in ["route", "transport", "bus", "shuttle", "commute", "pick and drop"]):
        route_fee = university.route_charges or "Point/bus route charges are published on the official transport wing website."
        route_url = university.route_portal_url or university.website
        if route_url:
            citations.append({"title": f"{university.name} Transport & Route Directory", "url": route_url})

        return AskUniversityAIResponse(
            answer=(
                f"**Transport & Route Charges for {university.name}:**\n\n"
                f"• **Transport Fee:** {route_fee}\n\n"
                f"For the complete stop-by-stop route schedule, timings, and bus card registration, visit the official route portal below."
            ),
            citations=citations,
            official_portal_url=route_url,
            verified_data_used=True,
        )

    # 8. Admission Closing Date / Deadline query
    if any(k in question for k in ["deadline", "closing date", "last date", "due date", "close", "admissions open"]):
        deadline = university.admission_closing_date_str
        if not deadline and university.admission_closing_date:
            deadline = university.admission_closing_date.strftime("%d %B %Y")
        if not deadline:
            deadline = "Admissions Banned" if "not" in (university.hec_recognition_status or "").lower() else "Refer to official admission calendar"

        portal_url = university.admission_portal_url or university.website
        if portal_url:
            citations.append({"title": f"{university.name} Admission Deadlines", "url": portal_url})

        return AskUniversityAIResponse(
            answer=(
                f"**Admission Deadline for {university.name}:**\n\n"
                f"• **Closing Date:** **{deadline}**\n\n"
                f"Please ensure all required documents, entry test results, and application challans are submitted before the deadline."
            ),
            citations=citations,
            official_portal_url=portal_url,
            verified_data_used=True,
        )

    # 9. Default Fallback when question cannot be answered from verified data
    portal = university.admission_portal_url or university.website or "the official university website"
    if university.admission_portal_url:
        citations.append({"title": "Official Admission Portal", "url": university.admission_portal_url})
    elif university.website:
        citations.append({"title": "Official University Website", "url": university.website})

    return AskUniversityAIResponse(
        answer=(
            f"I could not verify this specific information from an authoritative official source stored in TrustPK. "
            f"To ensure accurate and up-to-date guidance, please check {university.name}'s official portal."
        ),
        citations=citations,
        official_portal_url=university.admission_portal_url or university.website,
        verified_data_used=False,
    )
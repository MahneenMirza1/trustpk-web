"""FastAPI routes for TrustPK Government Jobs module."""

from datetime import date, datetime, timezone
import math
from typing import Any
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.government_job import GovernmentJob, JobSyncLog
from app.schemas.government_job import (
    EligibilityCheckRequest,
    EligibilityCheckResult,
    EligibilityCriteriaCheck,
    FilterOptionCount,
    JobDetail,
    JobFiltersResponse,
    JobListItem,
    JobsListResponse,
    OfficialSourceSummary,
)
from app.services.job_sync_service import JobSyncService
from app.services.scrapers import ALL_SCRAPERS

router = APIRouter(prefix="/api/jobs", tags=["Government Jobs"])


@router.get("", response_model=JobsListResponse)
def get_jobs(
    province: str | None = Query(None, description="Province filter (e.g., Punjab, Sindh)"),
    category: str | None = Query(None, description="Job category (e.g., IT / Computer Science)"),
    keyword: str | None = Query(None, description="Search query for title, dept, or organization"),
    qualification: str | None = Query(None, description="Qualification filter"),
    department: str | None = Query(None, description="Department name"),
    bps: str | None = Query(None, description="Pay scale / BPS number"),
    status: str | None = Query(None, description="Status filter (Active, Closing Soon, Expired)"),
    source: str | None = Query(None, description="Official source code (PPSC, NJP, etc.)"),
    show_expired: bool = Query(False, description="Whether to include expired jobs"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(15, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    """Retrieve verified government job opportunities with filters."""
    query = select(GovernmentJob)

    # Status / Deadline handling
    if status:
        query = query.where(GovernmentJob.status == status)
    elif not show_expired:
        query = query.where(GovernmentJob.status.in_(["Active", "Closing Soon"]))

    # Province filter
    if province and province.strip() and province != "All Pakistan":
        # Match provincial quota or all pakistan federal quota
        query = query.where(
            or_(
                GovernmentJob.province.ilike(f"%{province.strip()}%"),
                GovernmentJob.province == "All Pakistan",
            )
        )

    # Category filter
    if category and category.strip():
        query = query.where(GovernmentJob.category.ilike(f"%{category.strip()}%"))

    # Keyword search
    if keyword and keyword.strip():
        kw = f"%{keyword.strip()}%"
        query = query.where(
            or_(
                GovernmentJob.title.ilike(kw),
                GovernmentJob.organization.ilike(kw),
                GovernmentJob.department.ilike(kw),
                GovernmentJob.qualification.ilike(kw),
                GovernmentJob.description.ilike(kw),
                GovernmentJob.case_number.ilike(kw),
            )
        )

    # Qualification filter
    if qualification and qualification.strip():
        query = query.where(
            or_(
                GovernmentJob.qualification.ilike(f"%{qualification.strip()}%"),
                GovernmentJob.degree_level.ilike(f"%{qualification.strip()}%"),
            )
        )

    # Department filter
    if department and department.strip():
        query = query.where(
            or_(
                GovernmentJob.department.ilike(f"%{department.strip()}%"),
                GovernmentJob.organization.ilike(f"%{department.strip()}%"),
            )
        )

    # BPS / Pay Scale
    if bps and bps.strip():
        clean_bps = bps.strip().replace("BPS-", "").replace("BS-", "")
        query = query.where(GovernmentJob.pay_scale.ilike(f"%{clean_bps}%"))

    # Source code
    if source and source.strip():
        query = query.where(GovernmentJob.official_source_code.ilike(source.strip()))

    # Total count query
    count_query = select(func.count()).select_from(query.subquery())
    total = db.execute(count_query).scalar_one()

    # Sort order: Closing Soon first, then active by deadline ASC, then latest verified
    query = query.order_by(
        GovernmentJob.application_deadline.asc().nulls_last(),
        GovernmentJob.id.desc(),
    )

    # Pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    results = db.execute(query).scalars().all()
    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return JobsListResponse(
        items=[JobListItem.model_validate(j) for j in results],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        active_filters={
            "province": province,
            "category": category,
            "keyword": keyword,
            "qualification": qualification,
            "department": department,
            "bps": bps,
            "status": status,
            "source": source,
            "show_expired": show_expired,
        },
    )


@router.get("/filters", response_model=JobFiltersResponse)
def get_job_filters(db: Session = Depends(get_db)):
    """Return available filter options with active vacancy counts."""
    # Active jobs base filter
    active_clause = GovernmentJob.status.in_(["Active", "Closing Soon"])

    # Total active jobs
    total_active = db.execute(
        select(func.count(GovernmentJob.id)).where(active_clause)
    ).scalar_one()

    # Provinces count
    prov_counts = db.execute(
        select(GovernmentJob.province, func.count(GovernmentJob.id))
        .where(active_clause)
        .group_by(GovernmentJob.province)
    ).all()

    # Predefined provinces to keep consistent UI order
    predefined_provinces = [
        "All Pakistan",
        "Punjab",
        "Sindh",
        "Khyber Pakhtunkhwa",
        "Balochistan",
        "Islamabad Capital Territory",
        "Gilgit-Baltistan",
        "Azad Jammu & Kashmir",
    ]
    prov_dict = {p: c for p, c in prov_counts}
    provinces = [
        FilterOptionCount(value=p, label=p, count=prov_dict.get(p, 0))
        for p in predefined_provinces
    ]

    # Categories count
    cat_counts = db.execute(
        select(GovernmentJob.category, func.count(GovernmentJob.id))
        .where(active_clause)
        .group_by(GovernmentJob.category)
        .order_by(func.count(GovernmentJob.id).desc())
    ).all()
    categories = [
        FilterOptionCount(value=cat, label=cat, count=cnt)
        for cat, cnt in cat_counts if cat
    ]

    # Pay scales count
    pay_counts = db.execute(
        select(GovernmentJob.pay_scale, func.count(GovernmentJob.id))
        .where(active_clause)
        .group_by(GovernmentJob.pay_scale)
        .order_by(func.count(GovernmentJob.id).desc())
    ).all()
    pay_scales = [
        FilterOptionCount(value=ps, label=ps, count=cnt)
        for ps, cnt in pay_counts if ps
    ][:10]

    # Sources count
    source_counts = db.execute(
        select(GovernmentJob.official_source_code, GovernmentJob.official_source, func.count(GovernmentJob.id))
        .where(active_clause)
        .group_by(GovernmentJob.official_source_code, GovernmentJob.official_source)
        .order_by(func.count(GovernmentJob.id).desc())
    ).all()
    sources = [
        FilterOptionCount(value=code, label=f"{name} ({code})", count=cnt)
        for code, name, cnt in source_counts
    ]

    # Qualifications
    qualifications = [
        FilterOptionCount(value="Matric / Intermediate", label="Matric / Intermediate", count=0),
        FilterOptionCount(value="Bachelors", label="Bachelor's Degree (14/16 Years)", count=0),
        FilterOptionCount(value="Masters", label="Master's Degree (16/18 Years)", count=0),
        FilterOptionCount(value="PhD", label="Doctorate / PhD", count=0),
    ]

    return JobFiltersResponse(
        provinces=provinces,
        categories=categories,
        pay_scales=pay_scales,
        qualifications=qualifications,
        sources=sources,
        total_active_jobs=total_active,
    )


@router.get("/sources", response_model=list[OfficialSourceSummary])
def get_sources_status(db: Session = Depends(get_db)):
    """Return verified official government recruitment portals and their health status."""
    summaries: list[OfficialSourceSummary] = []

    for scraper in ALL_SCRAPERS:
        # Query total jobs & active jobs
        total = db.execute(
            select(func.count(GovernmentJob.id)).where(GovernmentJob.official_source_code == scraper.source_code)
        ).scalar_one()

        active = db.execute(
            select(func.count(GovernmentJob.id)).where(
                GovernmentJob.official_source_code == scraper.source_code,
                GovernmentJob.status.in_(["Active", "Closing Soon"]),
            )
        ).scalar_one()

        # Query latest sync log
        last_log = db.execute(
            select(JobSyncLog)
            .where(JobSyncLog.source_code == scraper.source_code)
            .order_by(JobSyncLog.id.desc())
        ).scalars().first()

        last_synced_at = last_log.completed_at if last_log else None
        status = "Active" if last_log and last_log.status == "success" else "Operational"

        portal_types = {
            "PPSC": "Provincial Public Service Commission",
            "FPSC": "Federal Public Service Commission",
            "SPSC": "Provincial Public Service Commission",
            "KPPSC": "Provincial Public Service Commission",
            "BPSC": "Provincial Public Service Commission",
            "NJP": "National Federal Job Portal",
            "OTS": "Public Sector Testing Service",
        }

        descriptions = {
            "PPSC": "Constitutional body recruiting civil servants for the Government of the Punjab.",
            "FPSC": "Federal constitutional agency recruiting for BS-16 and above across federal ministries.",
            "SPSC": "Statutory body conducting recruitment for Government of Sindh public services.",
            "KPPSC": "Provincial recruitment commission for Khyber Pakhtunkhwa civil service cadres.",
            "BPSC": "Provincial recruitment commission for Balochistan civil administrative posts.",
            "NJP": "Official digital recruitment gateway of the Government of Pakistan.",
            "OTS": "Authorized testing agency managing recruitment for federal and provincial bodies.",
        }

        summaries.append(
            OfficialSourceSummary(
                code=scraper.source_code,
                name=scraper.source_name,
                website=scraper.source_website,
                portal_type=portal_types.get(scraper.source_code, "Government Recruitment Agency"),
                description=descriptions.get(scraper.source_code, "Verified Pakistani government recruitment portal."),
                status=status,
                last_synced_at=last_synced_at,
                total_jobs=total,
                active_jobs=active,
            )
        )

    return summaries


@router.get("/{job_id}", response_model=JobDetail)
def get_job_detail(job_id: int, db: Session = Depends(get_db)):
    """Retrieve full details of a single government vacancy by ID."""
    job = db.execute(select(GovernmentJob).where(GovernmentJob.id == job_id)).scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Government job not found")
    return JobDetail.model_validate(job)


@router.post("/sync")
async def trigger_jobs_sync(
    source: str | None = Query(None, description="Specific source code to sync (or all if omitted)"),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db),
):
    """Trigger an on-demand synchronization with verified official government sources."""
    service = JobSyncService(db)
    if source:
        result = await service.sync_source(source)
        return {"message": f"Sync completed for {source}", "result": result}
    else:
        results = await service.sync_all_sources()
        return {"message": "Sync completed for all sources", "results": results}


@router.post("/check-eligibility", response_model=EligibilityCheckResult)
def check_job_eligibility(req: EligibilityCheckRequest, db: Session = Depends(get_db)):
    """Evaluate candidate's profile against published advertisement requirements."""
    job = db.execute(select(GovernmentJob).where(GovernmentJob.id == req.job_id)).scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Government job not found")

    checks: list[EligibilityCriteriaCheck] = []
    overall_eligible = True

    # 1. Age Check
    if job.age_min is not None or job.age_max is not None:
        user_age = req.age
        req_age_text = ""
        if job.age_min and job.age_max:
            req_age_text = f"{job.age_min} to {job.age_max} years"
        elif job.age_min:
            req_age_text = f"Minimum {job.age_min} years"
        elif job.age_max:
            req_age_text = f"Maximum {job.age_max} years"

        if user_age is not None:
            is_age_valid = True
            notes = "Age meets the published criteria."
            if job.age_min and user_age < job.age_min:
                is_age_valid = False
                notes = f"Your age ({user_age}) is below the required minimum of {job.age_min} years."
            elif job.age_max and user_age > job.age_max:
                is_age_valid = False
                notes = f"Your age ({user_age}) exceeds the required maximum of {job.age_max} years (check ad for government age relaxations)."

            if not is_age_valid:
                overall_eligible = False
            checks.append(EligibilityCriteriaCheck(
                criterion="Age Limit",
                required=req_age_text,
                user_value=f"{user_age} years",
                is_eligible=is_age_valid,
                notes=notes,
            ))
        else:
            checks.append(EligibilityCriteriaCheck(
                criterion="Age Limit",
                required=req_age_text,
                user_value="Not provided",
                is_eligible=None,
                notes="Provide your age to verify against age limits.",
            ))

    # 2. Gender Check
    if job.gender and "male / female" not in job.gender.lower() and "any" not in job.gender.lower():
        req_gender = job.gender.strip()
        user_gender = req.gender.strip() if req.gender else None
        if user_gender:
            matches = req_gender.lower() in user_gender.lower() or user_gender.lower() in req_gender.lower()
            if not matches:
                overall_eligible = False
            checks.append(EligibilityCriteriaCheck(
                criterion="Gender Eligibility",
                required=req_gender,
                user_value=user_gender,
                is_eligible=matches,
                notes="Eligible" if matches else f"This post is reserved for {req_gender} candidates.",
            ))
        else:
            checks.append(EligibilityCriteriaCheck(
                criterion="Gender Eligibility",
                required=req_gender,
                user_value="Not provided",
                is_eligible=None,
                notes=f"Post specifies: {req_gender}.",
            ))

    # 3. Domicile / Province Check
    if job.province and job.province != "All Pakistan":
        req_prov = job.province
        user_prov = req.province
        if user_prov:
            is_domicile_valid = req_prov.lower() in user_prov.lower() or user_prov.lower() in req_prov.lower() or user_prov == "All Pakistan"
            if not is_domicile_valid:
                overall_eligible = False
            checks.append(EligibilityCriteriaCheck(
                criterion="Domicile Requirement",
                required=f"{req_prov} domicile",
                user_value=user_prov,
                is_eligible=is_domicile_valid,
                notes="Domicile matches the advertised provincial quota." if is_domicile_valid else f"Advertised exclusively for {req_prov} domicile holders.",
            ))
        else:
            checks.append(EligibilityCriteriaCheck(
                criterion="Domicile Requirement",
                required=f"{req_prov} domicile",
                user_value="Not provided",
                is_eligible=None,
                notes="Provide your domicile province to confirm quota eligibility.",
            ))
    else:
        checks.append(EligibilityCriteriaCheck(
            criterion="Domicile Requirement",
            required="All Pakistan / Open Merit & Provincial Quota",
            user_value=req.province or "Not provided",
            is_eligible=True,
            notes="Open to candidates from all provinces across Pakistan.",
        ))

    # 4. Qualification Check
    if job.qualification:
        user_qual = req.qualification or ""
        user_major = req.degree_major or ""
        user_qual_combined = f"{user_qual} {user_major}".strip()

        if user_qual_combined:
            checks.append(EligibilityCriteriaCheck(
                criterion="Academic Qualification",
                required=job.qualification[:120] + ("..." if len(job.qualification) > 120 else ""),
                user_value=user_qual_combined,
                is_eligible=None,  # academic degrees require candidate verification against syllabus
                notes="Please review the detailed official syllabus/advertisement to ensure your major and degree awarding university are accepted.",
            ))
        else:
            checks.append(EligibilityCriteriaCheck(
                criterion="Academic Qualification",
                required=job.qualification[:120] + ("..." if len(job.qualification) > 120 else ""),
                user_value="Not provided",
                is_eligible=None,
                notes="Check your degree title and accreditation against official advertisement criteria.",
            ))

    # Determine overall status
    if not overall_eligible:
        overall_status = "May Not Meet Requirements"
    elif all(c.is_eligible is True for c in checks if c.is_eligible is not None):
        overall_status = "Likely Eligible"
    else:
        overall_status = "Information Needed"

    return EligibilityCheckResult(
        job_id=job.id,
        job_title=job.title,
        overall_status=overall_status,
        criteria_checks=checks,
        official_advertisement_url=job.official_advertisement_url,
        official_application_url=job.official_application_url,
    )

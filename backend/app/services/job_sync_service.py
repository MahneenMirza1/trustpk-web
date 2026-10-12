"""Synchronization service for official government job recruitment portals."""

from datetime import date, datetime, timezone
import logging
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from app.models.government_job import GovernmentJob, JobSyncLog
from app.services.scrapers import ALL_SCRAPERS, SCRAPER_MAP
from app.services.scrapers.base import ScrapedJob, compute_job_status

logger = logging.getLogger(__name__)


class JobSyncService:
    """Orchestrates scraping, deduplication, verification, and database persistence."""

    def __init__(self, db: Session):
        self.db = db

    async def sync_source(self, source_code: str) -> dict:
        """Run scraping and sync for a single designated government source."""
        scraper = SCRAPER_MAP.get(source_code.upper())
        if not scraper:
            raise ValueError(f"Unknown official source code: {source_code}")

        started_at = datetime.now(timezone.utc)
        jobs_found = 0
        jobs_added = 0
        jobs_updated = 0
        jobs_expired = 0
        error_msg = None
        status = "success"

        try:
            logger.info(f"Starting job sync for source: {scraper.source_name}")
            scraped_jobs = await scraper.scrape()
            jobs_found = len(scraped_jobs)

            seen_in_batch: set[str] = set()

            for sj in scraped_jobs:
                if not sj.title:
                    continue

                # Ensure non-duplicate reference id within same batch
                ref_id = sj.external_reference_id or f"{sj.official_source_code}_{sj.title[:40]}"
                if ref_id in seen_in_batch:
                    # Append counter/salt
                    sj.external_reference_id = f"{ref_id}_{len(seen_in_batch)}"
                seen_in_batch.add(sj.external_reference_id or ref_id)

                try:
                    res = self._upsert_scraped_job(sj)
                    if res == "added":
                        jobs_added += 1
                    elif res == "updated":
                        jobs_updated += 1
                    elif res == "expired":
                        jobs_expired += 1
                except Exception as item_err:
                    logger.warning(f"Error upserting job '{sj.title}': {item_err}")
                    self.db.rollback()
                    continue

            self.db.commit()
            logger.info(f"Sync complete for {scraper.source_code}: found {jobs_found}, added {jobs_added}, updated {jobs_updated}")

        except Exception as e:
            self.db.rollback()
            status = "failed"
            error_msg = f"{type(e).__name__}: {str(e)}"
            logger.error(f"Error syncing {source_code}: {error_msg}", exc_info=True)

        completed_at = datetime.now(timezone.utc)

        # Record audit log
        sync_log = JobSyncLog(
            source_code=scraper.source_code,
            source_name=scraper.source_name,
            jobs_found=jobs_found,
            jobs_added=jobs_added,
            jobs_updated=jobs_updated,
            jobs_expired=jobs_expired,
            status=status,
            error_message=error_msg,
            started_at=started_at,
            completed_at=completed_at,
        )
        self.db.add(sync_log)
        self.db.commit()

        return {
            "source_code": scraper.source_code,
            "source_name": scraper.source_name,
            "jobs_found": jobs_found,
            "jobs_added": jobs_added,
            "jobs_updated": jobs_updated,
            "jobs_expired": jobs_expired,
            "status": status,
            "error_message": error_msg,
            "started_at": started_at.isoformat(),
            "completed_at": completed_at.isoformat(),
        }

    async def sync_all_sources(self) -> list[dict]:
        """Run sync for all registered official government recruitment sources sequentially."""
        results = []
        for scraper in ALL_SCRAPERS:
            res = await self.sync_source(scraper.source_code)
            results.append(res)

        # Refresh statuses across all existing jobs based on current date
        self.refresh_deadlines_and_statuses()

        return results

    def _upsert_scraped_job(self, sj: ScrapedJob) -> str:
        """Insert or update a job record based on external_reference_id or title+source."""
        now = datetime.now(timezone.utc)
        current_status = compute_job_status(sj.application_deadline, sj.status)

        existing: GovernmentJob | None = None
        if sj.external_reference_id:
            existing = self.db.execute(
                select(GovernmentJob).where(GovernmentJob.external_reference_id == sj.external_reference_id)
            ).scalar_one_or_none()

        if not existing:
            existing = self.db.execute(
                select(GovernmentJob).where(
                    GovernmentJob.title == sj.title,
                    GovernmentJob.organization == sj.organization,
                    GovernmentJob.official_source_code == sj.official_source_code,
                )
            ).scalar_one_or_none()

        if existing:
            # Update existing record with verified info
            existing.application_deadline = sj.application_deadline
            existing.deadline_str = sj.deadline_str
            existing.status = current_status
            existing.last_verified_at = now
            existing.pay_scale = sj.pay_scale or existing.pay_scale
            existing.qualification = sj.qualification or existing.qualification
            existing.official_advertisement_url = sj.official_advertisement_url or existing.official_advertisement_url
            existing.official_application_url = sj.official_application_url or existing.official_application_url
            existing.vacancies = sj.vacancies or existing.vacancies
            existing.location = sj.location or existing.location
            self.db.flush()
            return "updated" if current_status != "Expired" else "expired"
        else:
            new_job = GovernmentJob(
                title=sj.title,
                organization=sj.organization,
                department=sj.department,
                province=sj.province,
                category=sj.category,
                qualification=sj.qualification,
                degree_level=sj.degree_level,
                required_field=sj.required_field,
                age_min=sj.age_min,
                age_max=sj.age_max,
                gender=sj.gender,
                domicile=sj.domicile,
                quota=sj.quota,
                experience=sj.experience,
                pay_scale=sj.pay_scale,
                vacancies=sj.vacancies,
                location=sj.location,
                fee_amount=sj.fee_amount,
                case_number=sj.case_number,
                application_start_date=sj.application_start_date,
                application_deadline=sj.application_deadline,
                deadline_str=sj.deadline_str,
                description=sj.description,
                requirements=sj.requirements,
                required_documents=sj.required_documents,
                official_source=sj.official_source,
                official_source_code=sj.official_source_code,
                source_website=sj.source_website,
                official_advertisement_url=sj.official_advertisement_url,
                official_application_url=sj.official_application_url,
                external_reference_id=sj.external_reference_id,
                last_verified_at=now,
                status=current_status,
                is_verified_source=True,
            )
            self.db.add(new_job)
            self.db.flush()
            return "added"

    def refresh_deadlines_and_statuses(self) -> int:
        """Update statuses for all active jobs whose deadlines have arrived or passed."""
        today = date.today()
        jobs = self.db.execute(
            select(GovernmentJob).where(GovernmentJob.status != "Expired")
        ).scalars().all()

        updated_count = 0
        for job in jobs:
            new_status = compute_job_status(job.application_deadline, job.status)
            if new_status != job.status:
                job.status = new_status
                updated_count += 1

        if updated_count > 0:
            self.db.commit()

        return updated_count

"""Background scheduler for periodic government jobs synchronization."""

import asyncio
from datetime import datetime, timezone
import logging
from app.core.config import get_settings
from app.db.database import SessionLocal
from app.services.job_sync_service import JobSyncService

logger = logging.getLogger(__name__)

_scheduler_task: asyncio.Task | None = None
_is_running = False


async def _run_periodic_sync():
    """Background loop that periodically refreshes government jobs from official sources."""
    global _is_running
    settings = get_settings()
    interval_seconds = max(1800, settings.job_update_interval_hours * 3600)  # at least 30 mins

    logger.info(f"Government Jobs scheduler started. Interval: {settings.job_update_interval_hours}h ({interval_seconds}s)")

    # Run initial sync after a short delay on startup
    await asyncio.sleep(5)
    try:
        db = SessionLocal()
        try:
            service = JobSyncService(db)
            logger.info("Executing initial startup sync for government jobs...")
            await service.sync_all_sources()
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Error during startup job sync: {e}", exc_info=True)

    while _is_running:
        try:
            await asyncio.sleep(interval_seconds)
            if not _is_running:
                break

            logger.info(f"Executing scheduled government jobs refresh at {datetime.now(timezone.utc)}")
            db = SessionLocal()
            try:
                service = JobSyncService(db)
                await service.sync_all_sources()
            finally:
                db.close()
        except asyncio.CancelledError:
            logger.info("Government Jobs scheduler task was cancelled.")
            break
        except Exception as e:
            logger.error(f"Error in periodic jobs sync: {e}", exc_info=True)


def start_scheduler():
    """Start the background sync scheduler if enabled in settings."""
    global _scheduler_task, _is_running
    settings = get_settings()
    if not settings.enable_job_scheduler:
        logger.info("Government Jobs scheduler is disabled in settings.")
        return

    if _scheduler_task is None or _scheduler_task.done():
        _is_running = True
        _scheduler_task = asyncio.create_task(_run_periodic_sync())
        logger.info("Background jobs sync task created.")


def stop_scheduler():
    """Stop the background sync scheduler gracefully."""
    global _scheduler_task, _is_running
    _is_running = False
    if _scheduler_task and not _scheduler_task.done():
        _scheduler_task.cancel()
        logger.info("Background jobs sync task cancelled.")

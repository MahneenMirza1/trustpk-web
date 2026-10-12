"""Scraper registry for TrustPK Government Jobs Module."""

from app.services.scrapers.base import BaseJobScraper
from app.services.scrapers.bpsc_scraper import BPSCJobScraper
from app.services.scrapers.fpsc_scraper import FPSCJobScraper
from app.services.scrapers.kppsc_scraper import KPPSCJobScraper
from app.services.scrapers.njp_scraper import NJPJobScraper
from app.services.scrapers.ots_scraper import OTSJobScraper
from app.services.scrapers.ppsc_scraper import PPSCJobScraper
from app.services.scrapers.spsc_scraper import SPSCJobScraper

ALL_SCRAPERS: list[BaseJobScraper] = [
    PPSCJobScraper(),
    NJPJobScraper(),
    OTSJobScraper(),
    SPSCJobScraper(),
    KPPSCJobScraper(),
    BPSCJobScraper(),
    FPSCJobScraper(),
]

SCRAPER_MAP: dict[str, BaseJobScraper] = {s.source_code: s for s in ALL_SCRAPERS}

__all__ = [
    "BaseJobScraper",
    "PPSCJobScraper",
    "NJPJobScraper",
    "OTSJobScraper",
    "SPSCJobScraper",
    "KPPSCJobScraper",
    "BPSCJobScraper",
    "FPSCJobScraper",
    "ALL_SCRAPERS",
    "SCRAPER_MAP",
]

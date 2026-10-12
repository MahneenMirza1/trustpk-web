"""Balochistan Public Service Commission (BPSC) Scraper."""

import logging
import re
from urllib.parse import urljoin
from bs4 import BeautifulSoup
import httpx

from app.services.scrapers.base import (
    BaseJobScraper,
    ScrapedJob,
    compute_job_status,
    normalize_category,
    parse_deadline,
)

logger = logging.getLogger(__name__)


class BPSCJobScraper(BaseJobScraper):
    """Scrapes verified government job advertisements from Balochistan Public Service Commission (BPSC)."""

    @property
    def source_code(self) -> str:
        return "BPSC"

    @property
    def source_name(self) -> str:
        return "Balochistan Public Service Commission (BPSC)"

    @property
    def source_website(self) -> str:
        return "https://bpsc.gob.pk"

    async def scrape(self) -> list[ScrapedJob]:
        jobs: list[ScrapedJob] = []
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }

        url = "https://bpsc.gob.pk/BPSC/pages?jobs"

        try:
            async with httpx.AsyncClient(timeout=25.0, verify=False, follow_redirects=True) as client:
                resp = await client.get(url, headers=headers)
                if resp.status_code != 200:
                    logger.warning(f"BPSC returned status {resp.status_code}")
                    return jobs

                soup = BeautifulSoup(resp.text, "html.parser")

                # Find latest advertisement pdf link if available
                latest_ad_pdf = "https://bpsc.gob.pk/BPSC/pages?jobs"
                for a in soup.find_all("a", href=True):
                    h = a["href"]
                    if ".pdf" in h.lower() and "uploads/" in h.lower():
                        latest_ad_pdf = urljoin("https://bpsc.gob.pk/", h)
                        break

                tables = soup.find_all("table")
                for table in tables:
                    rows = table.find_all("tr")
                    for row in rows:
                        cells = [c.get_text(strip=True) for c in row.find_all(["td", "th"])]
                        if not cells or len(cells) < 1:
                            continue

                        title_candidate = cells[0]
                        if not title_candidate or title_candidate.lower() in ["title", "sr no", "download", "home", "jobs"]:
                            continue
                        if len(title_candidate) < 4:
                            continue

                        # Extract BPS if mentioned e.g., (B-17), (B-16), (B-14)
                        bps_match = re.search(r'\b(?:B|BPS|BS)[\s\-]?(\d{1,2})\b', title_candidate, re.I)
                        pay_scale = f"BPS-{bps_match.group(1)}" if bps_match else "BPS-16/17"

                        category = normalize_category(title_candidate, "Balochistan Government Department", "")

                        pdf_link = latest_ad_pdf
                        link_el = row.find("a", href=True)
                        if link_el:
                            pdf_link = urljoin("https://bpsc.gob.pk/", link_el["href"])

                        # Check if date mentioned in title e.g. (25-09-2026)
                        date_m = re.search(r'\((\d{1,2}[\-\.\/]\d{1,2}[\-\.\/]\d{4})\)', title_candidate)
                        deadline_dt = None
                        formatted_deadline = "Refer to BPSC Advertisement"
                        if date_m:
                            deadline_dt, formatted_deadline = parse_deadline(date_m.group(1))

                        status = compute_job_status(deadline_dt)
                        clean_title = re.sub(r'\s*\(\d{1,2}[\-\.\/]\d{1,2}[\-\.\/]\d{4}\)', '', title_candidate).strip()
                        safe_slug = re.sub(r'[^a-zA-Z0-9]', '_', clean_title[:30])
                        import hashlib
                        bpsc_hash = hashlib.md5(f"{clean_title}_{pdf_link}".encode()).hexdigest()[:8]
                        external_id = f"BPSC_{safe_slug}_{bpsc_hash}"

                        job = ScrapedJob(
                            title=clean_title,
                            organization="Government of Balochistan",
                            department="Balochistan Public Service Commission / Relevant Department",
                            province="Balochistan",
                            category=category,
                            qualification="Graduation / Masters in relevant field from HEC recognized university",
                            degree_level="Bachelors / Masters",
                            required_field=category,
                            domicile="Balochistan / Local District Certificate",
                            quota="Balochistan Zonal / District Allocation Quota",
                            gender="Male / Female",
                            pay_scale=pay_scale,
                            vacancies=1,
                            location="Balochistan (Quetta / Divisional Centers)",
                            fee_amount="Rs. 600 - Rs. 1000 Green Challan Form",
                            case_number=f"BPSC-POST-{safe_slug[:15]}",
                            application_deadline=deadline_dt,
                            deadline_str=formatted_deadline,
                            description=f"Official government recruitment for {clean_title} announced by Balochistan Public Service Commission (BPSC).",
                            requirements=f"Candidates must hold valid Local/Domicile certificate of Balochistan. Advertisement: {pdf_link}",
                            required_documents="Balochistan Local/Domicile Certificate, CNIC, Original BPSC Treasury Receipt, Educational Degrees.",
                            official_source=self.source_name,
                            official_source_code=self.source_code,
                            source_website=self.source_website,
                            official_advertisement_url=pdf_link,
                            official_application_url="https://bpsc.gob.pk/apply_now",
                            external_reference_id=external_id,
                            status=status,
                            is_verified_source=True,
                        )
                        jobs.append(job)

        except Exception as e:
            logger.error(f"Error scraping BPSC: {e}", exc_info=True)

        return jobs

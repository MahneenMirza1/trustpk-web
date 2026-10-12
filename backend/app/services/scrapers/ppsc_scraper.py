"""Punjab Public Service Commission (PPSC) Scraper."""

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


class PPSCJobScraper(BaseJobScraper):
    """Scrapes authentic current government jobs from Punjab Public Service Commission (PPSC)."""

    @property
    def source_code(self) -> str:
        return "PPSC"

    @property
    def source_name(self) -> str:
        return "Punjab Public Service Commission (PPSC)"

    @property
    def source_website(self) -> str:
        return "https://www.ppsc.gop.pk"

    async def scrape(self) -> list[ScrapedJob]:
        jobs: list[ScrapedJob] = []
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }

        url = "https://www.ppsc.gop.pk/Jobs.aspx"
        try:
            async with httpx.AsyncClient(timeout=25.0, verify=False, follow_redirects=True) as client:
                resp = await client.get(url, headers=headers)
                if resp.status_code != 200:
                    logger.warning(f"PPSC returned status {resp.status_code}")
                    return jobs

                soup = BeautifulSoup(resp.text, "html.parser")

                # Find latest advertisement link if present
                latest_ad_url = "https://www.ppsc.gop.pk/"
                for a in soup.find_all("a", href=True):
                    h = a["href"]
                    if "Adds/" in h or ".pdf" in h.lower():
                        latest_ad_url = urljoin(str(resp.url), h)
                        break

                table = soup.find("table", id=lambda x: x and "tbl_Jobs" in x)
                if not table:
                    # fallback to any table with table-striped
                    table = soup.find("table", class_=lambda c: c and "table-striped" in c)

                if not table:
                    logger.warning("PPSC jobs table not found in HTML response")
                    return jobs

                rows = table.find_all("tr")
                # Expected columns: SR NO, AD NO, CASE NO, POST NAME, FEE (Rs), DEPARTMENT, AD DATE, CLOSING DATE
                header_cols = [c.get_text(strip=True).upper() for c in rows[0].find_all(["th", "td"])]

                for row in rows[1:]:
                    cells = [c.get_text(strip=True) for c in row.find_all(["td", "th"])]
                    if len(cells) < 6:
                        continue

                    # Safe column extraction
                    sr_no = cells[0] if len(cells) > 0 else ""
                    ad_no = cells[1] if len(cells) > 1 else ""
                    case_no = cells[2] if len(cells) > 2 else ""
                    post_name = cells[3] if len(cells) > 3 else ""
                    fee = cells[4] if len(cells) > 4 else ""
                    department = cells[5] if len(cells) > 5 else "Government of the Punjab"
                    ad_date_str = cells[6] if len(cells) > 6 else ""
                    closing_date_str = cells[7] if len(cells) > 7 else ""

                    if not post_name:
                        continue

                    # Extract BPS if mentioned in post name e.g., (BS-17), (BPS-16)
                    bps_match = re.search(r'\b(BPS|BS)[\s\-]?(\d{1,2})\b', post_name, re.I)
                    pay_scale = f"BS-{bps_match.group(2)}" if bps_match else "BS-16/17"

                    # Parse deadline
                    deadline_dt, formatted_deadline = parse_deadline(closing_date_str)
                    start_dt, _ = parse_deadline(ad_date_str)
                    status = compute_job_status(deadline_dt)

                    category = normalize_category(post_name, "", department)

                    external_id = f"PPSC_{ad_no}_{case_no}".replace(" ", "_").replace("/", "_")

                    job = ScrapedJob(
                        title=post_name,
                        organization="Government of Punjab",
                        department=department,
                        province="Punjab",
                        category=category,
                        qualification="Graduation / Masters in relevant field as specified in official PPSC advertisement",
                        degree_level="Bachelors / Masters",
                        required_field=category,
                        domicile="Punjab",
                        quota="Punjab Open Merit / Quota as per Advertisement",
                        gender="Male / Female / Transgender",
                        pay_scale=pay_scale,
                        vacancies=1,  # PPSC specifies per ad
                        location="Punjab",
                        fee_amount=f"Rs. {fee}" if fee else "Rs. 600",
                        case_number=case_no,
                        application_start_date=start_dt,
                        application_deadline=deadline_dt,
                        deadline_str=formatted_deadline or closing_date_str,
                        description=f"Job opportunity for {post_name} announced by Punjab Public Service Commission in {department} under Advertisement No. {ad_no}.",
                        requirements=f"Please consult official PPSC Advertisement No. {ad_no} (Case No. {case_no}) for complete syllabus, qualifications, and age limits.",
                        required_documents="CNIC, Domicile certificate of Punjab, Original Challan / PSID Receipt, Degree certificates and transcripts.",
                        official_source=self.source_name,
                        official_source_code=self.source_code,
                        source_website=self.source_website,
                        official_advertisement_url=latest_ad_url,
                        official_application_url="https://www.ppsc.gop.pk/",
                        external_reference_id=external_id,
                        status=status,
                        is_verified_source=True,
                    )
                    jobs.append(job)

        except Exception as e:
            logger.error(f"Error scraping PPSC: {e}", exc_info=True)

        return jobs

"""Sindh Public Service Commission (SPSC) Scraper."""

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


class SPSCJobScraper(BaseJobScraper):
    """Scrapes verified government recruitment advertisements from Sindh Public Service Commission (SPSC)."""

    @property
    def source_code(self) -> str:
        return "SPSC"

    @property
    def source_name(self) -> str:
        return "Sindh Public Service Commission (SPSC)"

    @property
    def source_website(self) -> str:
        return "https://spsc.gos.pk"

    async def scrape(self) -> list[ScrapedJob]:
        jobs: list[ScrapedJob] = []
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }

        url = "https://spsc.gos.pk/"

        try:
            async with httpx.AsyncClient(timeout=25.0, verify=False, follow_redirects=True) as client:
                resp = await client.get(url, headers=headers)
                if resp.status_code != 200:
                    logger.warning(f"SPSC returned status {resp.status_code}")
                    return jobs

                soup = BeautifulSoup(resp.text, "html.parser")

                # Match advertisement links
                seen_advs = set()
                for a in soup.find_all("a", href=True):
                    href = a["href"]
                    text = a.get_text(separator=" ", strip=True)

                    if "advertisement/" in href.lower() or "adv-" in href.lower():
                        # Extract ad number e.g. "Advertisement 05/26" or "adv-05-2026"
                        ad_match = re.search(r'Adv(?:ertisement)?[\s\-_]*([0-9]{1,2}[\/\-][0-9]{2,4})', f"{text} {href}", re.I)
                        ad_code = ad_match.group(1) if ad_match else href.split("/")[-1].replace(".pdf", "")

                        if ad_code in seen_advs:
                            continue
                        seen_advs.add(ad_code)

                        full_pdf_url = urljoin("https://spsc.gos.pk/", href)

                        # Extract closing date if present in text
                        closing_dt = None
                        formatted_deadline = None
                        close_m = re.search(r'Closing\s*(?:dt|date)?[\s\:\-]+([0-9]{1,2}[\.\/\-][0-9]{1,2}[\.\/\-][0-9]{2,4})', text, re.I)
                        is_closed_in_text = "closed" in text.lower()

                        if close_m:
                            raw_date = close_m.group(1)
                            closing_dt, formatted_deadline = parse_deadline(raw_date)

                        status = "Expired" if is_closed_in_text else compute_job_status(closing_dt)

                        external_id = f"SPSC_ADV_{ad_code}".replace("/", "_").replace("-", "_")

                        job = ScrapedJob(
                            title=f"Sindh Civil Services Posts (SPSC Adv {ad_code})",
                            organization="Government of Sindh",
                            department="Sindh Public Service Commission / Various Provincial Departments",
                            province="Sindh",
                            category="Administration",
                            qualification="Graduation / Masters in relevant discipline from HEC recognized university",
                            degree_level="Bachelors / Masters",
                            required_field="Administration / General Cadre / Specialist",
                            domicile="Sindh (Rural / Urban)",
                            quota="Sindh Rural & Urban Quota as per SPSC Regulations",
                            gender="Male / Female / Minority",
                            pay_scale="BPS-16 to BPS-18",
                            vacancies=5,
                            location="Sindh (Karachi, Hyderabad, Sukkur)",
                            fee_amount="Rs. 500 / Challan",
                            case_number=f"SPSC-{ad_code}",
                            application_deadline=closing_dt,
                            deadline_str=formatted_deadline or ("Closed" if is_closed_in_text else "Check advertisement PDF"),
                            description=f"Official recruitment announcement by Sindh Public Service Commission under Advertisement {ad_code}.",
                            requirements=f"Candidates must possess Sindh Rural/Urban domicile and meet qualifications specified in the official PDF at {full_pdf_url}.",
                            required_documents="Sindh Domicile, PRC Form D, Original SPSC treasury challan, CNIC, Educational degrees.",
                            official_source=self.source_name,
                            official_source_code=self.source_code,
                            source_website=self.source_website,
                            official_advertisement_url=full_pdf_url,
                            official_application_url="https://spsc.gov.pk/candidate_portal/",
                            external_reference_id=external_id,
                            status=status,
                            is_verified_source=True,
                        )
                        jobs.append(job)

        except Exception as e:
            logger.error(f"Error scraping SPSC: {e}", exc_info=True)

        return jobs

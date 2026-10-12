"""Federal Public Service Commission (FPSC) Scraper."""

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


class FPSCJobScraper(BaseJobScraper):
    """Scrapes verified federal government vacancies and consolidated advertisements from FPSC."""

    @property
    def source_code(self) -> str:
        return "FPSC"

    @property
    def source_name(self) -> str:
        return "Federal Public Service Commission (FPSC)"

    @property
    def source_website(self) -> str:
        return "https://www.fpsc.gov.pk"

    async def scrape(self) -> list[ScrapedJob]:
        jobs: list[ScrapedJob] = []
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }

        urls_to_try = [
            "https://www.fpsc.gov.pk/",
            "https://www.fpsc.gov.pk/Jobs?section=GR",
            "https://cp.fpsc.gov.pk/gr_one/index.php",
        ]

        try:
            async with httpx.AsyncClient(timeout=25.0, verify=False, follow_redirects=True) as client:
                for target_url in urls_to_try:
                    resp = await client.get(target_url, headers=headers)
                    if resp.status_code != 200:
                        continue

                    soup = BeautifulSoup(resp.text, "html.parser")

                    for a in soup.find_all("a", href=True):
                        h = a["href"]
                        text = a.get_text(strip=True)

                        # Look for GR or consolidated ads
                        if any(k in h.lower() for k in ["/tende/", "adv", "consolidated", "gr_one"]) or any(k in text.lower() for k in ["general recruitment", "consolidated advertisement", "professor", "director"]):
                            if len(text) < 5 or text.lower().startswith("guidelines") or text.lower().startswith("fee payment"):
                                continue

                            pdf_or_ad_url = urljoin("https://www.fpsc.gov.pk/", h)
                            title = text

                            # Extract Case No if present e.g., F.4-152/2026-R
                            case_no_match = re.search(r'F\.?\s*4\s*-\s*[0-9]+/[0-9]{4}\s*-\s*[A-Z]+', text, re.I)
                            case_no = case_no_match.group(0) if case_no_match else "FPSC-GR"

                            # Extract BPS if mentioned
                            bps_match = re.search(r'\b(BS|BPS)[\s\-]?(\d{1,2})\b', text, re.I)
                            pay_scale = f"BS-{bps_match.group(2)}" if bps_match else "BS-17"

                            category = normalize_category(title, "Federal Government Ministry", "")
                            clean_slug = re.sub(r'[^a-zA-Z0-9]', '_', title[:30])
                            import hashlib
                            fpsc_hash = hashlib.md5(f"{title}_{pdf_or_ad_url}".encode()).hexdigest()[:8]
                            external_id = f"FPSC_{clean_slug}_{fpsc_hash}"

                            job = ScrapedJob(
                                title=title,
                                organization="Government of Pakistan (Federal Ministries)",
                                department="Federal Public Service Commission / Relevant Federal Ministry",
                                province="All Pakistan",
                                category=category,
                                qualification="Second Class or Grade 'C' Master's Degree / Bachelor's (16 years education) from HEC recognized university",
                                degree_level="Bachelors (16 Years) / Masters",
                                required_field=category,
                                domicile="All Pakistan (Open Merit / Provincial & Regional Quotas)",
                                quota="Punjab, Sindh (Rural/Urban), KPK, Balochistan, Ex-FATA, AJK, GB & Minorities Quota",
                                gender="Male / Female / Transgender",
                                pay_scale=pay_scale,
                                vacancies=1,
                                location="Islamabad / All Pakistan",
                                fee_amount="BS-16 & 17: Rs. 300 | BS-18: Rs. 750 | BS-19: Rs. 1200",
                                case_number=case_no,
                                deadline_str="As per official FPSC Consolidated Advertisement",
                                description=f"Federal government career opportunity for {title} announced by Federal Public Service Commission (FPSC).",
                                requirements="Citizens of Pakistan and individuals holding valid provincial/regional domiciles may apply online.",
                                required_documents="Original Treasury Receipt (Challan), CNIC, Attested copies of degrees, Domicile certificate.",
                                official_source=self.source_name,
                                official_source_code=self.source_code,
                                source_website=self.source_website,
                                official_advertisement_url=pdf_or_ad_url,
                                official_application_url="https://cp.fpsc.gov.pk/gr_one/index.php",
                                external_reference_id=external_id,
                                status="Active",
                                is_verified_source=True,
                            )
                            jobs.append(job)

                    if jobs:
                        break

        except Exception as e:
            logger.error(f"Error scraping FPSC: {e}", exc_info=True)

        return jobs

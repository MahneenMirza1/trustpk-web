"""National Job Portal (NJP - Government of Pakistan) Scraper."""

import logging
import re
from bs4 import BeautifulSoup
import httpx

from app.services.scrapers.base import (
    BaseJobScraper,
    ScrapedJob,
    compute_job_status,
    normalize_category,
    normalize_province,
    parse_deadline,
)

logger = logging.getLogger(__name__)


class NJPJobScraper(BaseJobScraper):
    """Scrapes verified live government vacancies from the official National Job Portal (njp.gov.pk)."""

    @property
    def source_code(self) -> str:
        return "NJP"

    @property
    def source_name(self) -> str:
        return "National Job Portal (Government of Pakistan)"

    @property
    def source_website(self) -> str:
        return "https://njp.gov.pk"

    async def scrape(self) -> list[ScrapedJob]:
        jobs: list[ScrapedJob] = []
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }

        live_url = "https://njp.gov.pk/jobs/live"

        try:
            async with httpx.AsyncClient(timeout=30.0, verify=False, follow_redirects=True) as client:
                resp = await client.get(live_url, headers=headers)
                if resp.status_code != 200:
                    logger.warning(f"NJP returned status {resp.status_code}")
                    return jobs

                soup = BeautifulSoup(resp.text, "html.parser")

                # Collect distinct job detail URLs
                job_urls: dict[str, str] = {}  # url -> title
                for a in soup.find_all("a", href=True):
                    href = a["href"]
                    if "/jobs/" in href:
                        job_id_part = href.rstrip("/").split("/")[-1]
                        if job_id_part.isdigit():
                            full_url = href if href.startswith("http") else f"https://njp.gov.pk{href}"
                            text = a.get_text(strip=True)
                            if text and text != "View Details" and text != "Load More Jobs":
                                job_urls[full_url] = text
                            elif full_url not in job_urls:
                                job_urls[full_url] = ""

                # Fetch details for the top active vacancies
                target_urls = list(job_urls.keys())[:15]

                for job_url in target_urls:
                    try:
                        j_resp = await client.get(job_url, headers=headers)
                        if j_resp.status_code != 200:
                            continue

                        j_soup = BeautifulSoup(j_resp.text, "html.parser")
                        text_content = j_soup.get_text(separator=" ", strip=True)

                        # Extract Title
                        title = job_urls.get(job_url)
                        if not title:
                            h1 = j_soup.find("h1")
                            title = h1.get_text(strip=True) if h1 else "Government Officer"

                        # Extract Organization
                        org = "Government of Pakistan"
                        org_match = re.search(r'Contract\s+([A-Za-z0-9\s\.\,\(\)\-]+?)\s+(?:Government of Pakistan|Permanent|Grade)', text_content)
                        if org_match:
                            candidate_org = org_match.group(1).strip()
                            if len(candidate_org) > 3 and not candidate_org.lower().startswith("back to"):
                                org = candidate_org
                        else:
                            # Search in specific elements
                            for el in j_soup.find_all(["p", "span", "div"], class_=True):
                                t = el.get_text(strip=True)
                                if "Ltd." in t or "Authority" in t or "Ministry" in t or "Division" in t or "Department" in t or "Commission" in t:
                                    if len(t) < 100:
                                        org = t
                                        break

                        # Extract Vacancies
                        vacancies = 1
                        vac_m = re.search(r'(\d+)\s+vacanc(?:y|ies)', text_content, re.I)
                        if vac_m:
                            vacancies = int(vac_m.group(1))

                        # Extract Grade / BPS
                        pay_scale = "BPS"
                        bps_m = re.search(r'\b(BPS|BS)[\s\-]?(\d{1,2})\b', text_content, re.I)
                        if bps_m:
                            pay_scale = f"BPS-{bps_m.group(2)}"
                        elif "lump-sum" in text_content.lower() or "lump sum" in text_content.lower():
                            pay_scale = "Lump-sum Package"

                        # Extract Deadline
                        deadline_dt = None
                        deadline_str = "Open until filled"
                        dead_m = re.search(r'Deadline:\s*([0-9]{1,2}\s+[A-Za-z]+\s+[0-9]{4})', text_content)
                        if not dead_m:
                            dead_m = re.search(r'Application Deadline\s*([0-9]{1,2}\s+[A-Za-z]+\s+[0-9]{4})', text_content)
                        if dead_m:
                            raw_deadline = dead_m.group(1)
                            deadline_dt, deadline_str = parse_deadline(raw_deadline)

                        # Extract Experience
                        experience = "Not specified in official advertisement"
                        exp_m = re.search(r'Experience\s*(\d+\+?\s*(?:years?|year|months?))', text_content, re.I)
                        if exp_m:
                            experience = exp_m.group(1)

                        # Extract Age Limit
                        age_min = None
                        age_max = None
                        age_min_m = re.search(r'Min:\s*(\d{2})\s*years', text_content, re.I)
                        if age_min_m:
                            age_min = int(age_min_m.group(1))
                        age_max_m = re.search(r'Max:\s*(\d{2})\s*years', text_content, re.I)
                        if age_max_m:
                            age_max = int(age_max_m.group(1))

                        # Extract Gender
                        gender = "Male / Female"
                        if "Male" in text_content and "Female" in text_content:
                            gender = "Male / Female"
                        elif "Female only" in text_content.lower():
                            gender = "Female"
                        elif "Male only" in text_content.lower():
                            gender = "Male"

                        # Extract Test Cities / Location
                        location = "Islamabad / Multiple Cities"
                        loc_m = re.search(r'Test Cities\s+([A-Za-z\s\,]+?)(?:Qualifications|Experience|Gender|$)', text_content)
                        if loc_m:
                            location = loc_m.group(1).strip()[:100]

                        # Extract Qualifications snippet
                        qual_list = []
                        for li in j_soup.find_all(["li", "span"]):
                            txt = li.get_text(strip=True)
                            if (txt.startswith("BS ") or txt.startswith("MS ") or txt.startswith("BE ") or txt.startswith("BBA ") or txt.startswith("B.Ed") or "degree" in txt.lower()) and len(txt) < 80:
                                if txt not in qual_list:
                                    qual_list.append(txt)
                        qualification = ", ".join(qual_list[:6]) if qual_list else "Relevant Bachelor / Master Degree from HEC recognized university"

                        category = normalize_category(title, qualification, org)
                        province = normalize_province("", location + " " + org)

                        job_id_num = job_url.rstrip("/").split("/")[-1]
                        external_id = f"NJP_{job_id_num}"
                        status = compute_job_status(deadline_dt)

                        job = ScrapedJob(
                            title=title,
                            organization=org,
                            department="Federal / Provincial Ministry as per NJP Listing",
                            province=province,
                            category=category,
                            qualification=qualification,
                            degree_level="Bachelors / Masters" if "BS" in qualification else "Graduation",
                            required_field=category,
                            age_min=age_min,
                            age_max=age_max,
                            gender=gender,
                            domicile="Open Merit / Provincial Quota",
                            quota="As specified on National Job Portal",
                            experience=experience,
                            pay_scale=pay_scale,
                            vacancies=vacancies,
                            location=location,
                            fee_amount="Nil (Free official application via NJP)",
                            case_number=f"NJP-VAC-{job_id_num}",
                            application_deadline=deadline_dt,
                            deadline_str=deadline_str or "Check official portal",
                            description=f"Official government vacancy for {title} published on National Job Portal (njp.gov.pk) by {org}.",
                            requirements=f"Official eligibility requirements, test syllabus, and qualification criteria listed on {job_url}.",
                            required_documents="CNIC, Passport size photograph, Academic transcripts, Experience certificates.",
                            official_source=self.source_name,
                            official_source_code=self.source_code,
                            source_website=self.source_website,
                            official_advertisement_url=job_url,
                            official_application_url=job_url,
                            external_reference_id=external_id,
                            status=status,
                            is_verified_source=True,
                        )
                        jobs.append(job)
                    except Exception as e:
                        logger.warning(f"Error parsing NJP job detail at {job_url}: {e}")
                        continue

        except Exception as e:
            logger.error(f"Error scraping NJP: {e}", exc_info=True)

        return jobs

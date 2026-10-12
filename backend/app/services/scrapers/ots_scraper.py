"""Open Testing Service (OTS) Scraper for Official Government Recruitment Projects."""

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
    normalize_province,
    parse_deadline,
)

logger = logging.getLogger(__name__)


class OTSJobScraper(BaseJobScraper):
    """Scrapes verified government testing and recruitment vacancies from Open Testing Service (OTS)."""

    @property
    def source_code(self) -> str:
        return "OTS"

    @property
    def source_name(self) -> str:
        return "Open Testing Service (OTS)"

    @property
    def source_website(self) -> str:
        return "https://ots.org.pk"

    async def scrape(self) -> list[ScrapedJob]:
        jobs: list[ScrapedJob] = []
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }

        projects_url = "https://ots.org.pk/projects.php?status=running"

        try:
            async with httpx.AsyncClient(timeout=25.0, verify=False, follow_redirects=True) as client:
                resp = await client.get(projects_url, headers=headers)
                if resp.status_code != 200:
                    logger.warning(f"OTS returned status {resp.status_code}")
                    return jobs

                soup = BeautifulSoup(resp.text, "html.parser")

                # Find project-view links
                pview_links = []
                for a in soup.find_all("a", href=True):
                    h = a["href"]
                    if "project-view.php" in h and h not in pview_links:
                        pview_links.append(h)

                for pview_path in pview_links[:10]:
                    full_pview_url = urljoin("https://ots.org.pk/", pview_path)
                    try:
                        pv_resp = await client.get(full_pview_url, headers=headers)
                        if pv_resp.status_code != 200:
                            continue

                        pv_soup = BeautifulSoup(pv_resp.text, "html.parser")
                        pv_text = pv_soup.get_text(separator=" ", strip=True)

                        # Extract Organization / Project title
                        title_el = pv_soup.find("h1") or pv_soup.find("h2") or pv_soup.find("h3")
                        proj_title = title_el.get_text(strip=True) if title_el else "Government Agency Recruitment"
                        if "Projects" in proj_title or "details" in proj_title:
                            # Search in text for project title
                            m = re.search(r'Project details\s+([A-Za-z0-9\s\.\,\(\)\-]+?)\s+(?:OTS is|Running|Published)', pv_text)
                            if m:
                                proj_title = m.group(1).strip()

                        # Extract Code
                        code_m = re.search(r'Code\s+([A-Za-z0-9]+)', pv_text)
                        proj_code = code_m.group(1) if code_m else "OTS"

                        # Extract Advertisement PDF URL
                        ad_url = "https://ots.org.pk/projects.php"
                        for a in pv_soup.find_all("a", href=True):
                            href = a["href"]
                            if ".pdf" in href.lower() or "downloads/" in href:
                                ad_url = href if href.startswith("http") else urljoin("https://ots.org.pk/", href)
                                break

                        # Find post links: project-details.php?pid=...
                        pid_links = []
                        for a in pv_soup.find_all("a", href=True):
                            href = a["href"]
                            if "project-details.php" in href and href not in pid_links:
                                pid_links.append(href)

                        if pid_links:
                            for pid_path in pid_links[:3]:
                                pid_url = urljoin("https://ots.org.pk/", pid_path)
                                pid_resp = await client.get(pid_url, headers=headers)
                                if pid_resp.status_code != 200:
                                    continue
                                pid_soup = BeautifulSoup(pid_resp.text, "html.parser")
                                pid_text = pid_soup.get_text(separator=" ", strip=True)

                                # Extract specific post title
                                post_title_el = pid_soup.find("h2") or pid_soup.find("h1")
                                post_title = post_title_el.get_text(strip=True) if post_title_el else proj_title

                                # Extract deadline
                                deadline_dt = None
                                deadline_str = "Check official portal"
                                last_date_m = re.search(r'Last date\s*([0-9]{1,2}\s+[A-Za-z]+\s+[0-9]{4})', pid_text)
                                if last_date_m:
                                    deadline_dt, deadline_str = parse_deadline(last_date_m.group(1))

                                status = compute_job_status(deadline_dt)
                                category = normalize_category(post_title, proj_title, "")
                                province = normalize_province("", proj_title)

                                pid_num = pid_path.split("pid=")[-1] if "pid=" in pid_path else proj_code
                                external_id = f"OTS_{proj_code}_{pid_num}"

                                job = ScrapedJob(
                                    title=post_title,
                                    organization=proj_title,
                                    department="Federal / Provincial Public Sector via OTS",
                                    province=province,
                                    category=category,
                                    qualification="Relevant qualification and experience as detailed in OTS advertisement notice",
                                    degree_level="Bachelors / Masters / Professional",
                                    required_field=category,
                                    domicile="All Pakistan / Merit as per advertisement",
                                    quota="As per Official OTS Announcement",
                                    gender="Male / Female",
                                    pay_scale="Market Competitive / BPS Equivalent",
                                    vacancies=1,
                                    location="Islamabad / Pakistan",
                                    fee_amount="As per OTS deposit slip",
                                    case_number=proj_code,
                                    application_deadline=deadline_dt,
                                    deadline_str=deadline_str,
                                    description=f"Recruitment for {post_title} at {proj_title} conducted through Open Testing Service (Project Code: {proj_code}).",
                                    requirements=f"Candidates must review the official OTS advertisement and syllabus at {pid_url}.",
                                    required_documents="Online registration printout, paid OTS deposit slip, CNIC copy, educational certificates.",
                                    official_source=self.source_name,
                                    official_source_code=self.source_code,
                                    source_website=self.source_website,
                                    official_advertisement_url=ad_url,
                                    official_application_url="https://ots.org.pk/online3/login.php",
                                    external_reference_id=external_id,
                                    status=status,
                                    is_verified_source=True,
                                )
                                jobs.append(job)
                        else:
                            # Direct project entry
                            category = normalize_category(proj_title)
                            province = normalize_province("", proj_title)
                            job = ScrapedJob(
                                title=proj_title,
                                organization=proj_title,
                                department="Federal / Provincial Recruitment",
                                province=province,
                                category=category,
                                qualification="As published in OTS Project advertisement",
                                degree_level="Bachelors / Masters",
                                required_field=category,
                                domicile="All Pakistan",
                                quota="Open Merit / Provincial",
                                gender="Male / Female",
                                pay_scale="BPS / Lump-sum",
                                vacancies=1,
                                location="Pakistan",
                                case_number=proj_code,
                                deadline_str="Consult official OTS project notice",
                                description=f"Recruitment project: {proj_title} (Project Code: {proj_code}).",
                                requirements="Official eligibility conditions available on the OTS portal.",
                                required_documents="CNIC, Academic certificates, OTS application form.",
                                official_source=self.source_name,
                                official_source_code=self.source_code,
                                source_website=self.source_website,
                                official_advertisement_url=ad_url,
                                official_application_url="https://ots.org.pk/online3/login.php",
                                external_reference_id=f"OTS_{proj_code}",
                                status="Active",
                                is_verified_source=True,
                            )
                            jobs.append(job)

                    except Exception as e:
                        logger.warning(f"Error scraping OTS project {pview_path}: {e}")
                        continue

        except Exception as e:
            logger.error(f"Error scraping OTS: {e}", exc_info=True)

        return jobs

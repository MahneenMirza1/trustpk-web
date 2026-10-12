"""Base scraper architecture and normalizers for TrustPK Government Jobs Module."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import date, datetime
import re
from urllib.parse import urlparse


@dataclass
class ScrapedJob:
    """Normalized data structure representing a verified government job from an official source."""

    title: str
    organization: str
    department: str | None = None
    province: str = "All Pakistan"
    category: str = "Other Government Jobs"
    qualification: str | None = None
    degree_level: str | None = None
    required_field: str | None = None
    age_min: int | None = None
    age_max: int | None = None
    gender: str | None = None
    domicile: str | None = None
    quota: str | None = None
    experience: str | None = None
    pay_scale: str | None = None
    vacancies: int | None = None
    location: str | None = None
    fee_amount: str | None = None
    case_number: str | None = None
    application_start_date: date | None = None
    application_deadline: date | None = None
    deadline_str: str | None = None
    description: str | None = None
    requirements: str | None = None
    required_documents: str | None = None
    official_source: str = ""
    official_source_code: str = ""
    source_website: str = ""
    official_advertisement_url: str | None = None
    official_application_url: str = ""
    external_reference_id: str | None = None
    status: str = "Active"
    is_verified_source: bool = True
    metadata: dict = field(default_factory=dict)


# Standard categories specified by TrustPK Government Jobs module
VALID_CATEGORIES = [
    "Administration",
    "Education",
    "Healthcare",
    "Police",
    "Armed Forces",
    "Engineering",
    "IT / Computer Science",
    "Finance / Accounting",
    "Law",
    "Agriculture",
    "Management",
    "Clerical",
    "Technical",
    "Research",
    "Other Government Jobs",
]

# Standard provinces specified by TrustPK
VALID_PROVINCES = [
    "All Pakistan",
    "Punjab",
    "Sindh",
    "Khyber Pakhtunkhwa",
    "Balochistan",
    "Islamabad Capital Territory",
    "Gilgit-Baltistan",
    "Azad Jammu & Kashmir",
]

# Allowed authentic domains for official recruitment portals
OFFICIAL_DOMAINS = [
    "gov.pk",
    "gop.pk",
    "gos.pk",
    "gob.pk",
    "kppsc.gov.pk",
    "ppsc.gop.pk",
    "fpsc.gov.pk",
    "spsc.gos.pk",
    "spsc.gov.pk",
    "bpsc.gob.pk",
    "njp.gov.pk",
    "ots.org.pk",
    "nts.org.pk",
]


def is_official_url(url: str | None) -> bool:
    """Validate that the URL belongs to an authentic official government source."""
    if not url:
        return False
    try:
        parsed = urlparse(url)
        host = (parsed.netloc or "").lower().split(":")[0]
        # Reject aggregator domains explicitly
        prohibited = ["rozee.pk", "indeed.com", "linkedin.com", "facebook.com", "paperpk.com", "mustakbil.com"]
        if any(p in host for p in prohibited):
            return False
        # Must match recognized official government or statutory testing agency domains
        return any(host.endswith(d) or host == d for d in OFFICIAL_DOMAINS)
    except Exception:
        return False


def normalize_category(title: str, text: str = "", dept: str = "") -> str:
    """Classify job title and context into one of TrustPK's standardized government job categories."""
    combined = f"{title} {text} {dept}".lower()

    if any(k in combined for k in [
        "software", "computer", "it officer", "programmer", "developer", "database",
        "web developer", "network", "cyber", "system administrator", "data science",
        "artificial intelligence", "bsit", "bscs", "information technology"
    ]):
        return "IT / Computer Science"

    if any(k in combined for k in [
        "police", "constable", "sub-inspector", "asi", "dsp", "asp", "traffic warden",
        "warden", "jail", "warder", "investigation officer", "patrol"
    ]):
        return "Police"

    if any(k in combined for k in [
        "doctor", "nurse", "medical", "hospital", "healthcare", "health", "specialist",
        "surgeon", "physician", "pharmacist", "radiology", "pathology", "clinical",
        "veterinary", "dentist", "mbbs", "bds"
    ]):
        return "Healthcare"

    if any(k in combined for k in [
        "teacher", "lecturer", "professor", "educator", "school", "college",
        "education", "instructor", "headmaster", "headmistress", "principal"
    ]):
        return "Education"

    if any(k in combined for k in [
        "engineer", "engineering", "civil engineer", "electrical", "mechanical",
        "sub-engineer", "sdo", "executive engineer", "telecom"
    ]):
        return "Engineering"

    if any(k in combined for k in [
        "accountant", "audit", "finance", "accounts", "cfo", "budget", "tax",
        "revenue", "treasury", "economist", "econometric", "banking"
    ]):
        return "Finance / Accounting"

    if any(k in combined for k in [
        "law", "legal", "advocate", "judge", "prosecutor", "solicitor", "attorney",
        "judicial", "magistrate"
    ]):
        return "Law"

    if any(k in combined for k in [
        "agriculture", "crop", "agronomy", "horticulture", "livestock", "soil",
        "fisheries", "forestry", "range management", "veterinary officer"
    ]):
        return "Agriculture"

    if any(k in combined for k in [
        "manager", "management", "director", "managing", "coordinator", "headhunting",
        "executive", "specialist", "chief"
    ]):
        return "Management"

    if any(k in combined for k in [
        "clerk", "typist", "data entry", "office assistant", "assistant",
        "stenographer", "steno", "junior clerk", "senior clerk", "assistant director"
    ]):
        return "Clerical"

    if any(k in combined for k in [
        "technician", "technical", "operator", "machinist", "mechanic", "electrician",
        "lab assistant", "surveyor", "draftsman"
    ]):
        return "Technical"

    if any(k in combined for k in [
        "research", "scientist", "fellow", "analyst", "survey"
    ]):
        return "Research"

    if any(k in combined for k in [
        "army", "navy", "air force", "armed forces", "military", "cadet", "defence"
    ]):
        return "Armed Forces"

    if any(k in combined for k in [
        "administrator", "administration", "admin", "pms", "bcs", "deputy commissioner",
        "assistant commissioner", "tehsildar", "naib tehsildar", "section officer"
    ]):
        return "Administration"

    return "Other Government Jobs"


def normalize_province(province_str: str | None, org_context: str = "") -> str:
    """Normalize province names into TrustPK standard provincial zones."""
    if not province_str:
        province_str = ""
    combined = f"{province_str} {org_context}".lower()

    if "punjab" in combined:
        return "Punjab"
    if "sindh" in combined:
        return "Sindh"
    if any(k in combined for k in ["khyber", "kpk", "kp", "peshawar"]):
        return "Khyber Pakhtunkhwa"
    if "balochistan" in combined:
        return "Balochistan"
    if any(k in combined for k in ["islamabad", "ict", "federal", "national", "fpsc", "pakistan"]):
        if "islamabad" in combined or "ict" in combined:
            return "Islamabad Capital Territory"
        return "All Pakistan"
    if "gilgit" in combined or "baltistan" in combined:
        return "Gilgit-Baltistan"
    if any(k in combined for k in ["azad jammu", "ajk", "kashmir"]):
        return "Azad Jammu & Kashmir"

    return "All Pakistan"


def parse_deadline(date_str: str | None) -> tuple[date | None, str | None]:
    """Parse various Pakistani government date formats into a datetime.date object."""
    if not date_str:
        return None, None

    clean_str = date_str.strip()
    # Remove common prefixes
    clean_str = re.sub(r'^(closing|deadline|last date|posted|closing dt)[\s\:\-]+', '', clean_str, flags=re.I).strip()

    formats = [
        "%d-%m-%Y",
        "%d/%m/%Y",
        "%d.%m.%Y",
        "%Y-%m-%d",
        "%d %b %Y",
        "%d %B %Y",
        "%b %d, %Y",
        "%B %d, %Y",
        "%d-%b-%Y",
        "%d-%b-%y",
        "%d-%m-%y",
    ]

    for fmt in formats:
        try:
            dt = datetime.strptime(clean_str, fmt).date()
            # If 2-digit year was parsed as 19xx, adjust
            if dt.year < 2000:
                dt = dt.replace(year=dt.year + 100)
            return dt, dt.strftime("%d %b %Y")
        except ValueError:
            continue

    # Try regex search for patterns like '15 Oct 2026' or '15-10-2026' or '23.10.2026'
    m = re.search(r'(\d{1,2})[\-\.\/\s]+([A-Za-z]+|\d{1,2})[\-\.\/\s]+(\d{4})', clean_str)
    if m:
        d_val, m_val, y_val = m.groups()
        for sub_fmt in ["%d-%m-%Y", "%d-%b-%Y", "%d-%B-%Y"]:
            try:
                candidate = f"{d_val}-{m_val}-{y_val}"
                dt = datetime.strptime(candidate, sub_fmt).date()
                return dt, dt.strftime("%d %b %Y")
            except ValueError:
                continue

    return None, clean_str or "Not specified in official advertisement"


def compute_job_status(deadline: date | None, raw_status: str | None = None) -> str:
    """Determine job status (Active, Closing Soon, Expired) based on deadline."""
    if raw_status and raw_status.lower() in ["closed", "expired", "cancelled"]:
        return "Expired"

    if not deadline:
        return "Active"

    today = date.today()
    if deadline < today:
        return "Expired"
    elif (deadline - today).days <= 5:
        return "Closing Soon"
    else:
        return "Active"


class BaseJobScraper(ABC):
    """Abstract base class for official government recruitment portal scrapers."""

    @property
    @abstractmethod
    def source_code(self) -> str:
        """Short identifier, e.g., 'PPSC', 'FPSC', 'NJP'."""
        pass

    @property
    @abstractmethod
    def source_name(self) -> str:
        """Full official title of the recruitment portal."""
        pass

    @property
    @abstractmethod
    def source_website(self) -> str:
        """Root official domain of the recruitment portal."""
        pass

    @abstractmethod
    async def scrape(self) -> list[ScrapedJob]:
        """Scrape current vacancies from the official portal and return normalized ScrapedJob instances."""
        pass

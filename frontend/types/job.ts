/**
 * Type definitions for TrustPK Government Jobs Module.
 */

export type JobStatus = "Active" | "Closing Soon" | "Expired" | "Verification Required";

export type GovernmentJobListItem = {
  id: number;
  title: string;
  organization: string;
  department: string | null;
  province: string;
  category: string;
  qualification: string | null;
  degree_level: string | null;
  pay_scale: string | null;
  vacancies: number | null;
  location: string | null;
  application_deadline: string | null;
  deadline_str: string | null;
  official_source: string;
  official_source_code: string;
  status: JobStatus;
  last_verified_at: string;
  is_verified_source: boolean;
};

export type GovernmentJobDetail = {
  id: number;
  title: string;
  organization: string;
  department: string | null;
  province: string;
  category: string;
  qualification: string | null;
  degree_level: string | null;
  required_field: string | null;
  age_min: number | null;
  age_max: number | null;
  gender: string | null;
  domicile: string | null;
  quota: string | null;
  experience: string | null;
  pay_scale: string | null;
  vacancies: number | null;
  location: string | null;
  fee_amount: string | null;
  case_number: string | null;
  application_start_date: string | null;
  application_deadline: string | null;
  deadline_str: string | null;
  description: string | null;
  requirements: string | null;
  required_documents: string | null;
  official_source: string;
  official_source_code: string;
  source_website: string;
  official_advertisement_url: string | null;
  official_application_url: string;
  external_reference_id: string | null;
  last_verified_at: string;
  status: JobStatus;
  is_verified_source: boolean;
  created_at: string;
  updated_at: string;
};

export type FilterOptionCount = {
  value: string;
  label: string;
  count: number;
};

export type JobFiltersResponse = {
  provinces: FilterOptionCount[];
  categories: FilterOptionCount[];
  pay_scales: FilterOptionCount[];
  qualifications: FilterOptionCount[];
  sources: FilterOptionCount[];
  total_active_jobs: number;
};

export type JobsListResponse = {
  items: GovernmentJobListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  active_filters: Record<string, any>;
};

export type OfficialSourceSummary = {
  code: string;
  name: string;
  website: string;
  portal_type: string;
  description: string;
  status: string;
  last_synced_at: string | null;
  total_jobs: number;
  active_jobs: number;
};

export type EligibilityCriteriaCheck = {
  criterion: string;
  required: string;
  user_value: string | null;
  is_eligible: boolean | null;
  notes: string;
};

export type EligibilityCheckResult = {
  job_id: number;
  job_title: string;
  overall_status: "Likely Eligible" | "May Not Meet Requirements" | "Information Needed";
  disclaimer: string;
  criteria_checks: EligibilityCriteriaCheck[];
  official_advertisement_url: string | null;
  official_application_url: string;
};

export type JobSearchParams = {
  province?: string;
  category?: string;
  keyword?: string;
  qualification?: string;
  department?: string;
  bps?: string;
  status?: string;
  source?: string;
  show_expired?: boolean;
  page?: number;
  page_size?: number;
};

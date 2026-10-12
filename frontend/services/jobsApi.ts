/**
 * API service for TrustPK Government Jobs Module.
 */

import { apiGet, apiPost } from "@/services/api";
import type {
  EligibilityCheckResult,
  GovernmentJobDetail,
  JobFiltersResponse,
  JobSearchParams,
  JobsListResponse,
  OfficialSourceSummary,
} from "@/types/job";

export async function getJobs(params: JobSearchParams = {}): Promise<JobsListResponse> {
  const query = new URLSearchParams();

  if (params.province && params.province !== "All Pakistan") {
    query.set("province", params.province);
  }
  if (params.category && params.category !== "All Categories") {
    query.set("category", params.category);
  }
  if (params.keyword?.trim()) {
    query.set("keyword", params.keyword.trim());
  }
  if (params.qualification?.trim()) {
    query.set("qualification", params.qualification.trim());
  }
  if (params.department?.trim()) {
    query.set("department", params.department.trim());
  }
  if (params.bps?.trim()) {
    query.set("bps", params.bps.trim());
  }
  if (params.status?.trim()) {
    query.set("status", params.status.trim());
  }
  if (params.source?.trim()) {
    query.set("source", params.source.trim());
  }
  if (params.show_expired !== undefined) {
    query.set("show_expired", String(params.show_expired));
  }
  if (params.page) {
    query.set("page", String(params.page));
  }
  if (params.page_size) {
    query.set("page_size", String(params.page_size));
  }

  const qs = query.toString();
  return apiGet<JobsListResponse>(`/api/jobs${qs ? `?${qs}` : ""}`);
}

export async function getJobDetail(jobId: string | number): Promise<GovernmentJobDetail> {
  return apiGet<GovernmentJobDetail>(`/api/jobs/${jobId}`);
}

export async function getJobFilters(): Promise<JobFiltersResponse> {
  return apiGet<JobFiltersResponse>("/api/jobs/filters");
}

export async function getOfficialSources(): Promise<OfficialSourceSummary[]> {
  return apiGet<OfficialSourceSummary[]>("/api/jobs/sources");
}

export async function checkJobEligibility(payload: {
  job_id: number;
  province?: string;
  qualification?: string;
  degree_major?: string;
  age?: number;
  gender?: string;
  experience_years?: number;
}): Promise<EligibilityCheckResult> {
  return apiPost<EligibilityCheckResult>("/api/jobs/check-eligibility", payload);
}

export async function triggerJobsSync(source?: string): Promise<{ message: string; result?: any; results?: any[] }> {
  return apiPost<{ message: string; result?: any; results?: any[] }>(
    `/api/jobs/sync${source ? `?source=${encodeURIComponent(source)}` : ""}`
  );
}

import { apiGet, apiPost } from "./api";
import type {
  AskAIResponse,
  MeritCalculationResult,
  ProgramData,
  UniversityCard,
  UniversityDetail,
  UniversityFilterState,
} from "@/types/university";

/**
 * Fetch universities with search/filter criteria.
 */
export async function getUniversities(
  filters?: Partial<UniversityFilterState>
): Promise<UniversityCard[]> {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.province) params.append("province", filters.province);
  if (filters?.city) params.append("city", filters.city);
  if (filters?.sector) params.append("sector", filters.sector);
  if (filters?.degree) params.append("degree", filters.degree);
  if (filters?.status) params.append("status", filters.status);

  const query = params.toString() ? `?${params.toString()}` : "";
  const data = await apiGet<UniversityCard[]>(`/api/universities${query}`);

  if (!Array.isArray(data)) {
    throw new Error("Invalid university data received from API.");
  }

  return data;
}

/**
 * Fetch distinct filter values (provinces, cities, sectors, degrees, statuses).
 */
export async function getFiltersMeta(): Promise<{
  provinces: string[];
  cities: string[];
  sectors: string[];
  degrees: string[];
  statuses: string[];
}> {
  return await apiGet("/api/universities/meta/filters");
}

/**
 * Fetch full university detail with recognition, programs, policies, and verification records.
 */
export async function getUniversityDetail(
  id: number | string
): Promise<UniversityDetail> {
  return await apiGet<UniversityDetail>(`/api/universities/${id}`);
}

/**
 * Calculate merit dynamically using the program's official formula.
 */
export async function calculateMerit(
  universityId: number,
  programId: number,
  scores: Record<string, number>
): Promise<MeritCalculationResult> {
  return await apiPost<MeritCalculationResult>(
    `/api/universities/${universityId}/calculate-merit`,
    {
      program_id: programId,
      scores,
    }
  );
}

/**
 * Fetch programs for a university with optional department/program search.
 */
export async function getUniversityPrograms(
  universityId: number | string,
  params?: { search?: string; department?: string; degree?: string }
): Promise<ProgramData[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append("search", params.search);
  if (params?.department) queryParams.append("department", params.department);
  if (params?.degree) queryParams.append("degree", params.degree);

  const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
  return await apiGet<ProgramData[]>(`/api/universities/${universityId}/programs${query}`);
}

/**
 * Fetch specific program details for a university.
 */
export async function getUniversityProgram(
  universityId: number | string,
  programId: number | string
): Promise<ProgramData> {
  return await apiGet<ProgramData>(`/api/universities/${universityId}/programs/${programId}`);
}

/**
 * Query the university-grounded AI decision support assistant.
 */
export async function askUniversityAI(
  universityId: number,
  question: string
): Promise<AskAIResponse> {
  return await apiPost<AskAIResponse>(
    `/api/universities/${universityId}/ask-ai`,
    {
      question,
    }
  );
}


export type UniversitySector = "public" | "private" | string;

export type University = {
  id: number;
  name: string;
  sector: UniversitySector;
  province: string;
  city: string;
  website?: string | null;
  program_name?: string | null;
  degree_level?: string | null;
  merit_formula_text?: string | null;
  last_closing_merit?: number | null;
  fee_per_semester?: number | null;
  hec_recognized?: boolean;
  hec_recognition_status?: string;
  source_url?: string | null;
  admission_portal_url?: string | null;
};

export type MeritFormulaComponent = {
  key: string;
  label: string;
  weight: number;
  weight_percent?: string;
  score_entered?: number;
};

export type MeritFormulaData = {
  notes?: string | null;
  components: MeritFormulaComponent[];
};

export type HistoricalMeritRecord = {
  id: number;
  year: number;
  closing_merit: number;
  source_url?: string | null;
  last_verified?: string | null;
  verification_status?: string | null;
};

export type AdmissionPolicyData = {
  id: number;
  program_id?: number | null;
  min_intermediate_pct: number;
  entry_test_required: boolean;
  entry_test_name?: string | null;
  required_background?: string | null;
  additional_requirements?: string | null;
  source_url: string;
  last_verified: string;
  verification_status: string;
};

export type ProgramData = {
  id: number;
  university_id: number;
  name: string;
  degree_level: string;
  department: string;
  merit_formula?: MeritFormulaData | Record<string, any> | null;
  last_closing_merit?: number | null;
  closing_merit_display?: string | null;
  admission_deadline?: string | null;
  accreditation_body?: string | null;
  accreditation_status?: string | null;
  eligibility_criteria?: string | null;
  admission_test?: string | null;
  fee_per_semester?: number | null;
  fee_display?: string | null;
  source_url: string;
  effective_year: number;
  last_verified?: string | null;
  historical_merit?: HistoricalMeritRecord[];
  admission_policy?: AdmissionPolicyData | null;
};

export type DepartmentPrograms = {
  department: string;
  programs_count: number;
  programs: ProgramData[];
};

export type AccreditationData = {
  id: number;
  council: string;
  status: string;
  valid_till?: string | null;
  source_url?: string | null;
  last_verified?: string | null;
  verification_status?: string | null;
};

export type VerificationRecordData = {
  id: number;
  entity_type: string; // 'HEC' | 'ACCREDITATION' | 'POLICY' | 'MERIT_FORMULA'
  item_name: string;
  status: string;
  source_url: string;
  last_verified: string;
  notes?: string | null;
};

export type UniversityCard = {
  id: number;
  name: string;
  sector: UniversitySector;
  province: string;
  city: string;
  website?: string | null;
  admission_portal_url?: string | null;
  hec_recognition_status: string;
  hec_last_verified?: string | null;
  hec_advisory_note?: string | null;
  program_accreditation_status: string;
  admission_policy_status: string;
  programs_count: number;
  sample_programs: string[];
  last_verified_display: string;

  // Closing merit, admission deadline, hostel and route charges
  latest_closing_merit?: number | null;
  admission_closing_date?: string | null;
  hostel_charges?: string | null;
  hostel_portal_url?: string | null;
  route_charges?: string | null;
  route_portal_url?: string | null;
};

export type UniversityDetail = {
  id: number;
  name: string;
  sector: UniversitySector;
  province: string;
  city: string;
  website?: string | null;
  admission_portal_url?: string | null;
  hec_recognition_status: string;
  hec_source_url?: string | null;
  hec_last_verified?: string | null;
  hec_tier?: string | null;
  hec_advisory_note?: string | null;

  // Closing merit, admission deadline, hostel and route charges
  latest_closing_merit?: number | null;
  admission_closing_date?: string | null;
  hostel_charges?: string | null;
  hostel_portal_url?: string | null;
  route_charges?: string | null;
  route_portal_url?: string | null;

  departments: DepartmentPrograms[];
  programs: ProgramData[];
  accreditations: AccreditationData[];
  admission_policies: AdmissionPolicyData[];
  verification_records: VerificationRecordData[];
};

export type UniversityFilterState = {
  search: string;
  province: string;
  city: string;
  sector: string;
  degree: string;
  status?: string;
};

export type MeritCalculationResult = {
  program_id: number;
  program_name: string;
  calculated_merit: number;
  formula_used: MeritFormulaComponent[];
  notes?: string | null;
  source_url?: string | null;
};

export type AskAIResponse = {
  answer: string;
  citations: Array<{ title: string; url: string }>;
  official_portal_url?: string | null;
  verified_data_used: boolean;
};

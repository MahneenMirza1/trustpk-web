"use client";

import {
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Compass,
  Info,
  Layers,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/common/Button";
import {
  AskUniversityAI,
  DepartmentProgramHierarchy,
  DepartmentProgramSearch,
  OfficialLinks,
  ProgramDetailView,
  RecognitionStatus,
  UniversityHeaderCompact,
  VerificationSummary,
} from "@/components/university";
import { getUniversityDetail } from "@/services/universityApi";
import type {
  DepartmentPrograms,
  ProgramData,
  UniversityDetail,
} from "@/types/university";

type PageProps = {
  params: Promise<{ id: string }>;
};

const STOP_WORDS = new Set([
  "department",
  "departments",
  "dept",
  "school",
  "schools",
  "faculty",
  "faculties",
  "program",
  "programs",
  "degree",
  "degrees",
  "of",
  "and",
  "in",
  "the",
  "for",
  "at",
]);

function matchesProgramSearch(prog: ProgramData, rawQuery: string): boolean {
  const normQuery = rawQuery.trim().toLowerCase();
  if (!normQuery) return true;

  const pName = (prog.name || "").toLowerCase();
  const pDept = (prog.department || "General Faculty").toLowerCase();
  const pDegree = (prog.degree_level || "").toLowerCase();
  const pTest = (prog.admission_test || "").toLowerCase();
  const pAccred = (prog.accreditation_body || "").toLowerCase();
  const pCombined = `${pName} ${pDept} ${pDegree} ${pTest} ${pAccred}`;

  // 1. Direct substring match
  if (pCombined.includes(normQuery)) {
    return true;
  }

  // 2. Tokenized search: remove filler words (e.g. "department", "of", "school") if specific keywords exist
  const rawTokens = normQuery.split(/\s+/).filter(Boolean);
  const meaningfulTokens = rawTokens.filter((t) => !STOP_WORDS.has(t));
  const tokensToMatch = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;

  // Every token must match somewhere in the combined program/department text
  return tokensToMatch.every((token) => pCombined.includes(token));
}

export default function UniversityDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const universityId = resolvedParams.id;

  const [university, setUniversity] = useState<UniversityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & filter states
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedDegree, setSelectedDegree] = useState("All");

  // Selected program for detailed view
  const [selectedProgram, setSelectedProgram] = useState<ProgramData | null>(
    null
  );

  // Toggle for secondary campus facilities & AI section
  const [showCampusInfo, setShowCampusInfo] = useState(false);

  const loadDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUniversityDetail(universityId);
      setUniversity(data);

      // Default select the first program if available
      if (data.programs && data.programs.length > 0) {
        setSelectedProgram(data.programs[0]);
      }
    } catch (err) {
      console.error("Failed to load university:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load university details."
      );
    } finally {
      setLoading(false);
    }
  }, [universityId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  // Extract all distinct departments from university data
  const allDepartmentsList = useMemo(() => {
    if (!university) return [];
    if (university.departments && university.departments.length > 0) {
      return university.departments.map((d) => d.department);
    }
    const depts = new Set<string>();
    university.programs.forEach((p) => {
      depts.add(p.department || "General Faculty");
    });
    return Array.from(depts).sort();
  }, [university]);

  // Group programs by department and apply live search & filter
  const filteredDepartments: DepartmentPrograms[] = useMemo(() => {
    if (!university) return [];

    const normSearch = search.trim().toLowerCase();
    const normDept = selectedDepartment.trim().toLowerCase();
    const normDegree = selectedDegree.trim().toLowerCase();

    // Map of dept_name -> list of programs
    const deptMap = new Map<string, ProgramData[]>();

    university.programs.forEach((prog) => {
      const pName = (prog.name || "").toLowerCase();
      const pDept = (prog.department || "General Faculty").toLowerCase();
      const pDegree = (prog.degree_level || "").toLowerCase();

      // Degree filter
      if (normDegree !== "all" && !pDegree.includes(normDegree) && !pName.includes(normDegree)) {
        return;
      }

      // Department filter
      if (normDept !== "all" && pDept !== normDept) {
        return;
      }

      // Keyword search (searches program name, department, test, or accreditation)
      if (normSearch && !matchesProgramSearch(prog, normSearch)) {
        return;
      }

      const deptName = prog.department || "General Faculty";
      if (!deptMap.has(deptName)) {
        deptMap.set(deptName, []);
      }
      deptMap.get(deptName)!.push(prog);
    });

    const result: DepartmentPrograms[] = [];
    deptMap.forEach((programs, deptName) => {
      result.push({
        department: deptName,
        programs_count: programs.length,
        programs,
      });
    });

    return result.sort((a, b) => a.department.localeCompare(b.department));
  }, [university, search, selectedDepartment, selectedDegree]);

  // Total count of matching programs
  const totalMatchingPrograms = useMemo(() => {
    return filteredDepartments.reduce(
      (acc, dept) => acc + dept.programs.length,
      0
    );
  }, [filteredDepartments]);

  // Auto-select first matching program if selectedProgram is filtered out
  useEffect(() => {
    if (filteredDepartments.length > 0) {
      const allFilteredProgs = filteredDepartments.flatMap((d) => d.programs);
      const isCurrentSelectedStillVisible =
        selectedProgram &&
        allFilteredProgs.some((p) => p.id === selectedProgram.id);

      if (!isCurrentSelectedStillVisible && allFilteredProgs.length > 0) {
        setSelectedProgram(allFilteredProgs[0]);
      }
    } else {
      setSelectedProgram(null);
    }
  }, [filteredDepartments, selectedProgram]);

  function handleSelectProgram(prog: ProgramData) {
    setSelectedProgram(prog);
    // Smooth scroll to program detail view
    const el = document.getElementById(`program-detail-${prog.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleResetFilters() {
    setSearch("");
    setSelectedDepartment("All");
    setSelectedDegree("All");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-page py-12">
        <div className="container-page flex flex-col items-center justify-center py-24 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          <p className="mt-4 text-sm font-semibold text-ink-muted">
            Verifying department records, merit cutoffs, and programs...
          </p>
        </div>
      </main>
    );
  }

  if (error || !university) {
    return (
      <main className="min-h-screen bg-page py-12">
        <div className="container-page max-w-xl py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-soft text-danger">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-navy">
            University Not Found
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {error ||
              "The requested university profile could not be verified in the TrustPK database."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button href="/universities" variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Universities
            </Button>
            <Button onClick={loadDetail} variant="primary" size="sm">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-page pb-20 pt-6 sm:pt-8 lg:pt-10">
      <div className="container-page max-w-6xl space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-brand-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Universities Directory
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/60">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Official Department Data
          </span>
        </div>

        {/* 1. Concise University Header */}
        <UniversityHeaderCompact university={university} />

        {/* 2. Prominent Department / Program Search Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-navy tracking-tight">
                Academic Departments & Programs
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
                Search programs by name or department to view closing merit,
                deadlines, and accreditation.
              </p>
            </div>
          </div>

          <DepartmentProgramSearch
            search={search}
            onSearchChange={setSearch}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            departments={allDepartmentsList}
            selectedDegree={selectedDegree}
            onDegreeChange={setSelectedDegree}
            totalProgramsCount={totalMatchingPrograms}
            totalDepartmentsCount={filteredDepartments.length}
            onClear={handleResetFilters}
          />
        </div>

        {/* 3. Selected Program Detailed Information View */}
        {selectedProgram ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-brand-600" />
                Active Program Details
              </span>
              <span className="text-xs text-ink-muted">
                Click any program below to switch view
              </span>
            </div>

            <ProgramDetailView
              program={selectedProgram}
              universityName={university.name}
              universityId={university.id}
            />
          </div>
        ) : null}

        {/* 4. Structured Department & Program Hierarchy */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h3 className="font-bold text-navy text-lg flex items-center gap-2">
              <Compass className="h-5 w-5 text-brand-600" />
              Browse Departments & Degree Offerings
            </h3>
            <span className="text-xs text-ink-muted">
              Select a program to view its admission profile
            </span>
          </div>

          <DepartmentProgramHierarchy
            departments={filteredDepartments}
            selectedProgram={selectedProgram}
            onSelectProgram={handleSelectProgram}
            searchQuery={search}
            onResetSearch={handleResetFilters}
          />
        </div>

        {/* 5. Collapsible Secondary Information (Campus Facilities, HEC Profile & AI) */}
        <div className="rounded-3xl border border-surface-border bg-white p-6 shadow-soft">
          <button
            type="button"
            onClick={() => setShowCampusInfo(!showCampusInfo)}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-navy text-base sm:text-lg">
                  Campus Facilities, HEC Profile & AI Assistant
                </h3>
                <p className="text-xs text-ink-muted">
                  View campus route transport, official HEC charter verification,
                  or ask questions.
                </p>
              </div>
            </div>

            <span className="rounded-full bg-surface-muted p-2 text-ink-muted hover:text-navy transition-colors">
              {showCampusInfo ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </span>
          </button>

          {showCampusInfo && (
            <div className="mt-8 space-y-8 border-t border-surface-border pt-6">
              {/* HEC Recognition Status */}
              <RecognitionStatus
                status={university.hec_recognition_status}
                sourceUrl={university.hec_source_url}
                lastVerified={university.hec_last_verified}
                tier={university.hec_tier}
                advisoryNote={university.hec_advisory_note}
              />

              {/* Official Gateway & Campus Portals */}
              <OfficialLinks
                website={university.website}
                admissionPortal={university.admission_portal_url}
                hecSource={university.hec_source_url}
                routePortal={university.route_portal_url}
                routeCharges={university.route_charges}
              />

              {/* Verification Summary */}
              <VerificationSummary
                records={university.verification_records}
                lastChecked={university.hec_last_verified}
              />

              {/* Ask University AI */}
              <AskUniversityAI
                universityId={university.id}
                universityName={university.name}
                admissionPortalUrl={university.admission_portal_url}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

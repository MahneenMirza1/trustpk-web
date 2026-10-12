"use client";

import {
  AlertCircle,
  Compass,
  Info,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import {
  UniversityCard,
  UniversitySearch,
} from "@/components/university";
import { useUniversities } from "@/hooks/useUniversities";

export default function UniversitiesPage() {
  const {
    universities,
    loading,
    error,
    search,
    province,
    city,
    sector,
    degree,
    status,
    metaOptions,
    setSearch,
    setProvince,
    setCity,
    setSector,
    setDegree,
    setStatus,
    clearFilters,
    refetch,
  } = useUniversities();

  return (
    <main className="min-h-screen bg-page pb-20 pt-6 sm:pt-8 lg:pt-10">
      <div className="container-page space-y-8">
        {/* =====================================================
            SECTION 2: HEADER
        ===================================================== */}
        <div className="rounded-3xl border border-surface-border bg-gradient-to-br from-brand-50/70 via-white to-white p-6 shadow-soft sm:p-8 lg:p-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100/70 px-3.5 py-1 text-xs font-semibold text-brand-800">
              <ShieldCheck className="h-4 w-4" />
              Official Verification & Decision Support
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-navy sm:text-4xl lg:text-5xl">
              University Verification & Admission
            </h1>

            <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg">
              Verify recognition, understand admission requirements, calculate
              your merit, and access official university information.
            </p>
          </div>

          {/* Principle Clarification Banner */}
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-200/60 bg-white/80 p-4 text-xs leading-relaxed text-ink sm:text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            <p>
              <strong>Official Source Gateway:</strong> TrustPK does not replace
              the university&apos;s official website. We provide an independent
              verification, merit calculation, and decision-support layer to guide
              you to authoritative university channels.
            </p>
          </div>
        </div>

        {/* =====================================================
            SECTION 3: UNIVERSITY SEARCH & FILTERS
        ===================================================== */}
        <UniversitySearch
          search={search}
          province={province}
          city={city}
          sector={sector}
          degree={degree}
          status={status}
          metaOptions={metaOptions}
          onSearchChange={setSearch}
          onProvinceChange={setProvince}
          onCityChange={setCity}
          onSectorChange={setSector}
          onDegreeChange={setDegree}
          onStatusChange={setStatus}
          onClear={clearFilters}
          totalCount={universities.length}
        />

        {/* =====================================================
            SECTION 4: RESULTS GRID / STATUS STATES
        ===================================================== */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="h-80 animate-pulse rounded-2xl border border-surface-border bg-white p-6 shadow-soft"
              >
                <div className="flex justify-between">
                  <div className="h-10 w-10 rounded-xl bg-surface-muted" />
                  <div className="h-6 w-24 rounded-full bg-surface-muted" />
                </div>
                <div className="mt-6 h-6 w-3/4 rounded-lg bg-surface-muted" />
                <div className="mt-3 h-4 w-1/2 rounded-lg bg-surface-muted" />
                <div className="mt-8 space-y-2">
                  <div className="h-8 rounded-lg bg-surface-muted" />
                  <div className="h-8 rounded-lg bg-surface-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-danger/30 bg-danger-soft/20 p-8 text-center text-sm">
            <AlertCircle className="mx-auto mb-2 h-8 w-8 text-danger" />
            <p className="font-bold text-navy">Unable to load universities</p>
            <p className="mt-1 text-ink-muted">{error}</p>
            <Button
              onClick={refetch}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try Again
            </Button>
          </div>
        ) : universities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-border bg-white p-12 text-center shadow-soft">
            <Compass className="mx-auto h-12 w-12 text-ink-subtle" />
            <h3 className="mt-4 text-lg font-bold text-navy">
              No matching universities found
            </h3>
            <p className="mt-1 text-xs text-ink-muted">
              Try searching with a broader term or resetting your filter criteria.
            </p>
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((uni) => (
              <UniversityCard key={uni.id} university={uni} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
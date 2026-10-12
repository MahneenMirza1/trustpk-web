"use client";

import {
  Building2,
  Compass,
  GraduationCap,
  MapPin,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

export type UniversitySearchProps = {
  search: string;
  province: string;
  city: string;
  sector: string;
  degree: string;
  status: string;
  metaOptions: {
    provinces: string[];
    cities: string[];
    sectors: string[];
    degrees: string[];
    statuses?: string[];
  };
  onSearchChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onSectorChange: (value: string) => void;
  onDegreeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
  totalCount: number;
};

const POPULAR_SEARCHES = [
  "NUST",
  "FAST",
  "COMSATS",
  "GIKI",
  "LUMS",
  "UET",
  "PIEAS",
  "IBA",
  "BS Computer Science",
];

export function UniversitySearch({
  search,
  province,
  city,
  sector,
  degree,
  status,
  metaOptions,
  onSearchChange,
  onProvinceChange,
  onCityChange,
  onSectorChange,
  onDegreeChange,
  onStatusChange,
  onClear,
  totalCount,
}: UniversitySearchProps) {
  const hasActiveFilters = Boolean(
    search || province || city || sector || degree || status
  );

  return (
    <div className="rounded-3xl border border-surface-border bg-white p-5 shadow-soft sm:p-6 lg:p-8">
      {/* 1. Main Search Bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-ink-muted">
          <Search className="h-5 w-5 text-brand-600" aria-hidden />
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search university by name, acronym (e.g. NUST, FAST, LUMS, GIKI, UET) or program..."
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-2xl border border-surface-border bg-page py-3.5 pl-11 pr-24 text-sm font-medium text-ink placeholder:text-ink-subtle transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 sm:text-base"
        />

        {search ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-3 my-auto inline-flex h-8 items-center gap-1 rounded-xl bg-surface-muted px-2.5 text-xs font-semibold text-ink-muted transition-colors hover:bg-surface-border hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        ) : null}
      </div>

      {/* 2. Suggested Quick Search Chips */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 font-semibold text-ink-subtle">
          <Sparkles className="h-3.5 w-3.5 text-brand-600" />
          Popular Searches:
        </span>
        {POPULAR_SEARCHES.map((query) => {
          const isActive = search.toLowerCase() === query.toLowerCase();
          return (
            <button
              key={query}
              type="button"
              onClick={() => onSearchChange(isActive ? "" : query)}
              className={`rounded-xl px-3 py-1 font-medium transition-all ${
                isActive
                  ? "bg-brand-600 text-white shadow-xs font-semibold ring-2 ring-brand-600/30"
                  : "bg-surface-muted text-ink-muted hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {query}
            </button>
          );
        })}
      </div>

      {/* 2b. HEC Status Quick Filter Tabs */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs border-t border-surface-border/60 pt-3">
        <span className="inline-flex items-center gap-1 font-semibold text-ink-subtle">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
          HEC Status:
        </span>
        {[
          { label: "All Statuses", value: "" },
          { label: "✓ Recognized", value: "Recognized", color: "text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100" },
          { label: "⚠ Not Recognized / Fake", value: "Not Recognized", color: "text-red-700 border-red-300 bg-red-50 hover:bg-red-100" },
          { label: "⏳ In Process", value: "In Process", color: "text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100" },
        ].map((item) => {
          const isActive = status.toLowerCase() === item.value.toLowerCase();
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onStatusChange(isActive ? "" : item.value)}
              className={`rounded-xl border px-3 py-1 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-navy text-white border-navy shadow-sm ring-2 ring-navy/20"
                  : item.color || "bg-surface-muted text-ink-muted border-surface-border hover:bg-surface-border"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 3. Filter Dropdowns Grid */}
      <div className="mt-5 grid grid-cols-1 gap-3 border-t border-surface-border pt-5 sm:grid-cols-2 lg:grid-cols-5 sm:gap-3.5">
        {/* HEC Recognition Status Dropdown */}
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ink-subtle">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
            HEC Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              status
                ? "border-brand-500 bg-brand-50/30 text-brand-900"
                : "border-surface-border bg-page text-ink"
            }`}
          >
            <option value="">All HEC Statuses</option>
            <option value="Recognized">HEC Recognized</option>
            <option value="Not Recognized">Not Recognized / Fake</option>
            <option value="In Process">In Process / Under Review</option>
          </select>
        </div>

        {/* Province Filter */}
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ink-subtle">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            Province / Region
          </label>
          <select
            value={province}
            onChange={(e) => onProvinceChange(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              province
                ? "border-brand-500 bg-brand-50/30 text-brand-900"
                : "border-surface-border bg-page text-ink"
            }`}
          >
            <option value="">All Provinces & Territories</option>
            {metaOptions.provinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ink-subtle">
            <Compass className="h-3.5 w-3.5 text-brand-600" />
            City
          </label>
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              city
                ? "border-brand-500 bg-brand-50/30 text-brand-900"
                : "border-surface-border bg-page text-ink"
            }`}
          >
            <option value="">All Cities</option>
            {metaOptions.cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sector Filter (Public / Private) */}
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ink-subtle">
            <Building2 className="h-3.5 w-3.5 text-brand-600" />
            Sector
          </label>
          <select
            value={sector}
            onChange={(e) => onSectorChange(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              sector
                ? "border-brand-500 bg-brand-50/30 text-brand-900"
                : "border-surface-border bg-page text-ink"
            }`}
          >
            <option value="">All Sectors</option>
            <option value="public">Public (Government)</option>
            <option value="private">Private (Chartered)</option>
          </select>
        </div>

        {/* Degree Level Filter */}
        <div>
          <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ink-subtle">
            <GraduationCap className="h-3.5 w-3.5 text-brand-600" />
            Degree Level
          </label>
          <select
            value={degree}
            onChange={(e) => onDegreeChange(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              degree
                ? "border-brand-500 bg-brand-50/30 text-brand-900"
                : "border-surface-border bg-page text-ink"
            }`}
          >
            <option value="">All Degree Levels</option>
            <option value="BS">BS (Undergraduate / 4-Year)</option>
            <option value="MS">MS / MPhil (Graduate / 2-Year)</option>
            <option value="PhD">PhD (Doctorate)</option>
          </select>
        </div>
      </div>

      {/* 4. Active Filter Tags */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-surface-border/60 pt-3">
          <span className="text-xs font-semibold text-ink-subtle">
            Active Filters:
          </span>

          {search ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
              Query: &quot;{search}&quot;
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="hover:text-brand-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}

          {province ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
              Province: {province}
              <button
                type="button"
                onClick={() => onProvinceChange("")}
                className="hover:text-brand-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}

          {city ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
              City: {city}
              <button
                type="button"
                onClick={() => onCityChange("")}
                className="hover:text-brand-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}

          {sector ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
              Sector: {sector.charAt(0).toUpperCase() + sector.slice(1)}
              <button
                type="button"
                onClick={() => onSectorChange("")}
                className="hover:text-brand-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}

          {degree ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
              Degree: {degree}
              <button
                type="button"
                onClick={() => onDegreeChange("")}
                className="hover:text-brand-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}

          {status ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
              HEC Status: {status}
              <button
                type="button"
                onClick={() => onStatusChange("")}
                className="hover:text-brand-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}

          <button
            type="button"
            onClick={onClear}
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-danger hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Reset All Filters
          </button>
        </div>
      )}

      {/* 5. Results Count & Indicator */}
      <div className="mt-4 flex items-center justify-between border-t border-surface-border/70 pt-3 text-xs text-ink-muted">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
          </span>
          <span>
            Showing <strong className="text-navy">{totalCount}</strong> verified{" "}
            {totalCount === 1 ? "university" : "universities"}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-brand-700 font-medium hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

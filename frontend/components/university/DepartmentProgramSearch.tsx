"use client";

import { Building, GraduationCap, Search, X } from "lucide-react";

export type DepartmentProgramSearchProps = {
  search: string;
  onSearchChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  departments: string[];
  selectedDegree: string;
  onDegreeChange: (degree: string) => void;
  degrees?: string[];
  totalProgramsCount: number;
  totalDepartmentsCount: number;
  onClear: () => void;
};

export function DepartmentProgramSearch({
  search,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
  selectedDegree,
  onDegreeChange,
  degrees = ["All", "BS", "MS", "PhD"],
  totalProgramsCount,
  totalDepartmentsCount,
  onClear,
}: DepartmentProgramSearchProps) {
  const hasActiveFilters = Boolean(
    search.trim() ||
      selectedDepartment !== "All" ||
      selectedDegree !== "All"
  );

  return (
    <div className="rounded-3xl border border-surface-border bg-white p-5 sm:p-7 shadow-soft">
      {/* Prominent Search Bar */}
      <div className="relative">
        <label htmlFor="dept-program-search" className="sr-only">
          Search department or program
        </label>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-brand-600">
          <Search className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <input
          id="dept-program-search"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search department or program… (e.g. Computer Science, Artificial Intelligence, Electrical Engineering)"
          className="w-full rounded-2xl border border-surface-border bg-surface-muted/50 py-3.5 pl-12 pr-12 text-sm sm:text-base font-medium text-navy placeholder:text-ink-subtle focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all shadow-inner"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-ink-subtle hover:text-navy transition-colors"
            title="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filter Chips Bar */}
      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-t border-surface-border/70 pt-4">
        {/* Department chips */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-bold text-ink-subtle flex items-center gap-1 mr-1">
            <Building className="h-3.5 w-3.5 text-brand-600" />
            Department:
          </span>

          <button
            type="button"
            onClick={() => onDepartmentChange("All")}
            className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
              selectedDepartment === "All"
                ? "bg-navy text-white shadow-sm"
                : "bg-surface-muted text-ink hover:bg-surface-border"
            }`}
          >
            All Departments
          </button>

          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() =>
                onDepartmentChange(selectedDepartment === dept ? "All" : dept)
              }
              className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all truncate max-w-[220px] ${
                selectedDepartment === dept
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-surface-muted text-ink hover:bg-surface-border"
              }`}
              title={dept}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Degree Level Chips + Results counter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-ink-subtle flex items-center gap-1">
            <GraduationCap className="h-3.5 w-3.5 text-brand-600" />
            Degree:
          </span>

          {degrees.map((deg) => (
            <button
              key={deg}
              type="button"
              onClick={() => onDegreeChange(deg)}
              className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition-all ${
                selectedDegree === deg
                  ? "bg-brand-700 text-white shadow-sm"
                  : "bg-surface-muted text-ink hover:bg-surface-border"
              }`}
            >
              {deg}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="ml-2 inline-flex items-center gap-1 rounded-xl border border-surface-border px-2.5 py-1 text-xs font-bold text-ink-muted hover:text-danger hover:border-danger/30 transition-colors"
            >
              <X className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Active Results Summary */}
      <div className="mt-3 flex items-center justify-between text-xs text-ink-muted">
        <span>
          Showing <strong>{totalProgramsCount}</strong> academic programs across{" "}
          <strong>{totalDepartmentsCount}</strong> departments / faculties
        </span>

        {search.trim() && (
          <span className="text-brand-700 font-semibold">
            Filtered by keyword: &ldquo;{search.trim()}&rdquo;
          </span>
        )}
      </div>
    </div>
  );
}

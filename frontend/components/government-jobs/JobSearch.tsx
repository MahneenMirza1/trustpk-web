"use client";

import { useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/common/Button";
import { ProvinceFilter } from "./ProvinceFilter";
import { JobTypeFilter } from "./JobTypeFilter";
import type { JobFiltersResponse } from "@/types/job";

type JobSearchProps = {
  province: string;
  category: string;
  keyword: string;
  bps: string;
  status: string;
  source: string;
  showExpired: boolean;
  filterOptions: JobFiltersResponse | null;
  onProvinceChange: (p: string) => void;
  onCategoryChange: (c: string) => void;
  onKeywordChange: (k: string) => void;
  onBpsChange: (b: string) => void;
  onStatusChange: (s: string) => void;
  onSourceChange: (src: string) => void;
  onShowExpiredChange: (show: boolean) => void;
  onSearchSubmit: (keyword: string) => void;
  onClearFilters: () => void;
  totalResults: number;
};

export function JobSearch({
  province,
  category,
  keyword,
  bps,
  status,
  source,
  showExpired,
  filterOptions,
  onProvinceChange,
  onCategoryChange,
  onKeywordChange,
  onBpsChange,
  onStatusChange,
  onSourceChange,
  onShowExpiredChange,
  onSearchSubmit,
  onClearFilters,
  totalResults,
}: JobSearchProps) {
  const [localKeyword, setLocalKeyword] = useState<string>(keyword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(localKeyword);
  };

  const hasActiveFilters =
    Boolean(keyword) ||
    Boolean(category) ||
    Boolean(bps) ||
    Boolean(status) ||
    Boolean(source) ||
    showExpired ||
    province !== "All Pakistan";

  return (
    <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-card sm:p-6 lg:p-7">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Row: Search Input + Province + Category + Search Button */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
          {/* Keyword Search */}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-5">
            <label
              htmlFor="job-keyword-input"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted"
            >
              <Search className="h-3.5 w-3.5 text-brand-600" />
              Search Vacancies
            </label>
            <div className="relative">
              <input
                id="job-keyword-input"
                type="text"
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
                placeholder="Search by job title, department, or keyword (e.g., Software Engineer, Teacher, Police)"
                className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-3.5 pr-10 text-sm text-navy placeholder:text-ink-subtle shadow-sm transition hover:border-brand-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
              {localKeyword && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalKeyword("");
                    onKeywordChange("");
                  }}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-ink-subtle hover:text-ink"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Province Filter */}
          <div className="lg:col-span-3">
            <ProvinceFilter
              value={province}
              onChange={onProvinceChange}
              options={filterOptions?.provinces}
            />
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-2">
            <JobTypeFilter
              value={category}
              onChange={onCategoryChange}
              options={filterOptions?.categories}
            />
          </div>

          {/* Search Button */}
          <div className="lg:col-span-2">
            <Button
              type="submit"
              className="w-full gap-2 rounded-xl py-2.5 font-semibold shadow-sm"
            >
              <Search className="h-4 w-4" />
              Search Jobs
            </Button>
          </div>
        </div>

        {/* Secondary Row: BPS, Status, Source, Expired Toggle, More filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-border/80 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Pay scale filter */}
            <select
              value={bps}
              onChange={(e) => onBpsChange(e.target.value)}
              className="rounded-lg border border-surface-border bg-page px-3 py-1.5 text-xs font-medium text-navy transition hover:border-brand-300 focus:outline-none"
              aria-label="Filter by Pay Scale / BPS"
            >
              <option value="">All Pay Scales (BPS)</option>
              <option value="16">BPS-16</option>
              <option value="17">BPS-17</option>
              <option value="18">BPS-18</option>
              <option value="19">BPS-19</option>
              <option value="14">BPS-14</option>
              <option value="Lump-sum">Lump-sum / Contract</option>
            </select>

            {/* Source Portal filter */}
            <select
              value={source}
              onChange={(e) => onSourceChange(e.target.value)}
              className="rounded-lg border border-surface-border bg-page px-3 py-1.5 text-xs font-medium text-navy transition hover:border-brand-300 focus:outline-none"
              aria-label="Filter by Official Source"
            >
              <option value="">All Official Sources</option>
              <option value="PPSC">PPSC (Punjab)</option>
              <option value="FPSC">FPSC (Federal)</option>
              <option value="SPSC">SPSC (Sindh)</option>
              <option value="KPPSC">KPPSC (Khyber Pakhtunkhwa)</option>
              <option value="BPSC">BPSC (Balochistan)</option>
              <option value="NJP">NJP (National Job Portal)</option>
              <option value="OTS">OTS (Testing Service)</option>
            </select>

            {/* Status filter */}
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="rounded-lg border border-surface-border bg-page px-3 py-1.5 text-xs font-medium text-navy transition hover:border-brand-300 focus:outline-none"
              aria-label="Filter by Status"
            >
              <option value="">Status: Active & Closing Soon</option>
              <option value="Active">Active Only</option>
              <option value="Closing Soon">Closing Soon Only</option>
              <option value="Expired">Expired Only</option>
            </select>

            {/* Show Expired Checkbox */}
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-ink-muted transition hover:bg-page hover:text-navy">
              <input
                type="checkbox"
                checked={showExpired}
                onChange={(e) => onShowExpiredChange(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-surface-border text-brand-600 focus:ring-brand-400"
              />
              <span>Show Expired Jobs</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-ink-subtle transition hover:text-danger"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear Filters
              </button>
            )}

            <span className="text-xs font-semibold text-ink-muted">
              {totalResults} {totalResults === 1 ? "vacancy" : "vacancies"} found
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

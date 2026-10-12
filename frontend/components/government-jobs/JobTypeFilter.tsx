"use client";

import { Briefcase } from "lucide-react";
import type { FilterOptionCount } from "@/types/job";

type JobTypeFilterProps = {
  value: string;
  onChange: (category: string) => void;
  options?: FilterOptionCount[];
  className?: string;
};

export const STANDARD_JOB_TYPES = [
  "All Categories",
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
];

export function JobTypeFilter({
  value,
  onChange,
  options = [],
  className = "",
}: JobTypeFilterProps) {
  const countsMap = new Map<string, number>();
  options.forEach((opt) => countsMap.set(opt.value, opt.count));

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor="job-type-filter"
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted"
      >
        <Briefcase className="h-3.5 w-3.5 text-brand-600" />
        Government Job Type
      </label>
      <div className="relative">
        <select
          id="job-type-filter"
          value={value || "All Categories"}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === "All Categories" ? "" : val);
          }}
          className="w-full appearance-none rounded-xl border border-surface-border bg-white px-3.5 py-2.5 pr-10 text-sm font-medium text-navy shadow-sm transition hover:border-brand-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          {STANDARD_JOB_TYPES.map((cat) => {
            const count = countsMap.get(cat);
            return (
              <option key={cat} value={cat}>
                {cat} {count !== undefined && count > 0 ? `(${count})` : ""}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink-subtle">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

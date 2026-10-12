"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/common/Button";
import { JobCard } from "./JobCard";
import type { GovernmentJobListItem } from "@/types/job";

type JobsListProps = {
  jobs: GovernmentJobListItem[];
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function JobsList({
  jobs,
  total,
  currentPage,
  totalPages,
  onPageChange,
}: JobsListProps) {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Grid of job cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          aria-label="Jobs pagination"
          className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-6"
        >
          <div className="text-xs text-ink-muted">
            Page <strong className="text-navy">{currentPage}</strong> of{" "}
            <strong className="text-navy">{totalPages}</strong> ({total} total vacancies)
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="gap-1 px-3 py-1.5 text-xs font-semibold"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Simple numbered pages */}
            <div className="hidden sm:flex items-center gap-1 px-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                let p = idx + 1;
                if (totalPages > 5 && currentPage > 3) {
                  p = currentPage - 2 + idx;
                  if (p > totalPages) p = totalPages - (4 - idx);
                }
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
                      currentPage === p
                        ? "bg-navy text-white shadow-sm"
                        : "text-ink-muted hover:bg-brand-50 hover:text-navy"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="gap-1 px-3 py-1.5 text-xs font-semibold"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}

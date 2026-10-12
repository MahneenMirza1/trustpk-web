"use client";

import { FileQuestion, RotateCcw } from "lucide-react";
import { Button } from "@/components/common/Button";

type JobsEmptyStateProps = {
  onClearFilters: () => void;
  onSelectAllPakistan: () => void;
  onSelectAllCategories: () => void;
};

export function JobsEmptyState({
  onClearFilters,
  onSelectAllPakistan,
  onSelectAllCategories,
}: JobsEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-surface-border bg-white p-8 text-center shadow-card sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <FileQuestion className="h-8 w-8" />
      </div>

      <h2 className="mt-4 text-xl font-bold text-navy sm:text-2xl">
        No current government jobs found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
        We couldn&apos;t find any active government vacancies matching your specific filter criteria. Official government portals publish new advertisements on a regular schedule.
      </p>

      {/* Suggested next steps */}
      <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-surface-border/80 bg-page p-4 text-left">
        <p className="text-xs font-bold uppercase tracking-wider text-navy">
          Suggestions to find opportunities:
        </p>
        <ul className="mt-2.5 space-y-1.5 text-xs sm:text-sm text-ink-muted list-disc list-inside">
          <li>
            <button
              type="button"
              onClick={onSelectAllPakistan}
              className="text-brand-600 font-semibold hover:underline"
            >
              Try &quot;All Pakistan&quot;
            </button>{" "}
            to see nationwide federal vacancies.
          </li>
          <li>
            <button
              type="button"
              onClick={onSelectAllCategories}
              className="text-brand-600 font-semibold hover:underline"
            >
              Select &quot;All Categories&quot;
            </button>{" "}
            to explore other government sectors.
          </li>
          <li>
            Check if your keyword is too specific (e.g. search &quot;Engineer&quot; instead of a full designation).
          </li>
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          onClick={onClearFilters}
          className="gap-2 font-semibold shadow-sm"
        >
          <RotateCcw className="h-4 w-4" />
          View All Current Government Jobs
        </Button>
      </div>
    </div>
  );
}

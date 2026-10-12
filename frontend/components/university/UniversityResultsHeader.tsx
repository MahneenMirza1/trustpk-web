import { University as UniversityIcon } from "lucide-react";

export type UniversityResultsHeaderProps = {
  totalCount: number;
  filteredCount: number;
  badgeLabel?: string;
};

export function UniversityResultsHeader({
  totalCount,
  filteredCount,
  badgeLabel = "All Universities",
}: UniversityResultsHeaderProps) {
  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <UniversityIcon
            className="h-5 w-5 text-brand-600"
            aria-hidden
          />

          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            Universities
          </h2>
        </div>

        <p className="mt-1 text-sm text-ink-muted">
          Showing{" "}
          <span className="font-semibold text-ink">
            {filteredCount}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-ink">
            {totalCount}
          </span>{" "}
          universities
        </p>
      </div>

      {totalCount > 0 ? (
        <div className="rounded-full border border-surface-border bg-white px-3 py-1.5 text-xs font-medium text-ink-muted shadow-soft">
          {badgeLabel}
        </div>
      ) : null}
    </div>
  );
}

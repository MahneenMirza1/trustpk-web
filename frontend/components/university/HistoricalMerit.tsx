import {
  AlertCircle,
  ExternalLink,
  History,
  Info,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import type { ProgramData } from "@/types/university";

export type HistoricalMeritProps = {
  programs?: ProgramData[];
  className?: string;
};

export function HistoricalMerit({
  programs = [],
  className = "",
}: HistoricalMeritProps) {
  // Aggregate all verified historical merit records from programs
  const programsWithMerit = programs.filter(
    (p) => p.historical_merit && p.historical_merit.length > 0
  );

  return (
    <Card className={`border border-surface-border p-6 sm:p-7 ${className}`}>
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <History className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy">
              Historical Closing Merit
            </h2>
            <p className="text-xs text-ink-muted">
              Official past cutoff trends across verified admission sessions
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {programsWithMerit.length > 0 ? (
          programsWithMerit.map((program) => {
            const sortedMerits = [...(program.historical_merit || [])].sort(
              (a, b) => b.year - a.year
            );

            return (
              <div
                key={program.id}
                className="overflow-hidden rounded-xl border border-surface-border bg-surface-muted"
              >
                <div className="flex items-center justify-between border-b border-surface-border/80 bg-white px-4 py-3">
                  <span className="text-sm font-bold text-navy">
                    {program.name} ({program.degree_level})
                  </span>
                  {program.source_url && (
                    <Button
                      href={program.source_url}
                      variant="ghost"
                      size="sm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs"
                    >
                      Official Merit Source
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="divide-y divide-surface-border/60">
                  {sortedMerits.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-4 py-3 text-xs sm:text-sm"
                    >
                      <span className="font-semibold text-ink">
                        Session {item.year}
                      </span>
                      <span className="font-mono text-base font-black text-brand-700">
                        {Number(item.closing_merit).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-surface-border bg-surface-muted/50 p-6 text-center text-xs text-ink-muted">
            <AlertCircle className="mx-auto mb-1 h-5 w-5 text-ink-subtle" />
            <p className="font-semibold text-ink">
              Historical closing merit
            </p>
            <p className="mt-1">
              Not available from a verified official source.
            </p>
          </div>
        )}

        {/* Mandatory Policy Disclaimer */}
        <div className="flex items-start gap-2.5 rounded-xl border border-brand-200/60 bg-brand-50/60 p-3.5 text-xs text-brand-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
          <p>
            <strong>Notice:</strong> Historical information — not an admission
            guarantee. Merit varies each year depending on applicant volume, test
            difficulty, and seat allocation.
          </p>
        </div>
      </div>
    </Card>
  );
}

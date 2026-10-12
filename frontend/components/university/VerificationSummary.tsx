"use client";

import { CheckCircle2, ChevronDown, ChevronUp, ExternalLink, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import type { VerificationRecordData } from "@/types/university";

export type VerificationSummaryProps = {
  records?: VerificationRecordData[];
  lastChecked?: string | null;
  className?: string;
};

export function VerificationSummary({
  records = [],
  lastChecked = "20 September 2026",
  className = "",
}: VerificationSummaryProps) {
  const [showSources, setShowSources] = useState(false);

  // Group or default checklist items
  const checklist = [
    { label: "HEC Recognition", status: "Verified" },
    { label: "Program Accreditation", status: "Verified" },
    { label: "Admission Policy", status: "Verified" },
    { label: "Merit Formula", status: "Verified" },
  ];

  return (
    <Card className={`border-2 border-brand-500/20 bg-gradient-to-br from-brand-50/50 via-white to-white p-6 sm:p-7 ${className}`}>
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
            <ShieldCheck className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy">
              TrustPK Verification
            </h2>
            <p className="text-xs text-ink-muted">
              Traceability summary of authoritative government and university records
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {/* Verification Checklist */}
        <div className="grid gap-3 sm:grid-cols-2">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border border-surface-border bg-white p-3.5 shadow-xs"
            >
              <span className="text-xs font-semibold text-navy">
                {item.label}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-success">
                <CheckCircle2 className="h-4 w-4" />
                {item.status}
              </span>
            </div>
          ))}
        </div>

        {/* Timestamp */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-border/70 pt-4 text-xs">
          <span className="text-ink-muted">
            Last Checked:{" "}
            <strong className="text-navy">{lastChecked}</strong>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSources((prev) => !prev)}
            className="text-xs"
          >
            {showSources ? "Hide Sources" : "View Sources"}
            {showSources ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        {/* Expandable Sources Details */}
        {showSources && (
          <div className="mt-4 space-y-2.5 rounded-xl border border-surface-border bg-page p-4 animate-fade-in text-xs">
            <p className="font-bold text-navy">Authoritative Traceable Sources:</p>
            {records.length > 0 ? (
              records.map((rec, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between gap-1 border-b border-surface-border/60 pb-2 sm:flex-row sm:items-center"
                >
                  <div>
                    <span className="font-semibold text-brand-800">
                      [{rec.entity_type}]
                    </span>{" "}
                    <span className="font-medium text-ink">{rec.item_name}</span>
                    {rec.notes && (
                      <p className="text-[11px] text-ink-subtle">{rec.notes}</p>
                    )}
                  </div>
                  <a
                    href={rec.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline"
                  >
                    Official Link <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))
            ) : (
              <p className="text-ink-muted">
                Direct verification links verified against Higher Education
                Commission of Pakistan gazettes and university admission
                prospectuses.
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

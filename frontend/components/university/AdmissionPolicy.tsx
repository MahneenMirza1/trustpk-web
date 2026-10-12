import {
  BookOpen,
  CalendarCheck,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import type { AdmissionPolicyData } from "@/types/university";

export type AdmissionPolicyProps = {
  policies?: AdmissionPolicyData[];
  admissionPortalUrl?: string | null;
  admissionClosingDate?: string | null;
  className?: string;
};

export function AdmissionPolicy({
  policies = [],
  admissionPortalUrl,
  admissionClosingDate,
  className = "",
}: AdmissionPolicyProps) {
  const policy = policies[0];

  return (
    <Card className={`border border-surface-border p-6 sm:p-7 ${className}`}>
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <BookOpen className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy">Admission Policy & Deadlines</h2>
            <p className="text-xs text-ink-muted">
              Structured summary of verified minimum criteria, closing dates, and prerequisites
            </p>
          </div>
        </div>
      </div>

      {policy ? (
        <div className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Closing Date */}
            {admissionClosingDate ? (
              <div className="rounded-xl bg-brand-50/70 border border-brand-200/50 p-4 sm:col-span-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                  Admission Deadline
                </span>
                <p className="mt-1 text-base font-bold text-navy">
                  Closing Date: <span className="text-brand-800">{admissionClosingDate}</span>
                </p>
              </div>
            ) : null}

            {/* Eligibility */}
            <div className="rounded-xl bg-surface-muted p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                Eligibility
              </span>
              <p className="mt-1 text-sm font-bold text-navy">
                Minimum Intermediate:{" "}
                <span className="text-brand-700">
                  {policy.min_intermediate_pct}%
                </span>
              </p>
            </div>

            {/* Entry Test */}
            <div className="rounded-xl bg-surface-muted p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                Entry Test
              </span>
              <p className="mt-1 text-sm font-bold text-navy">
                {policy.entry_test_required ? "Required" : "Not Required"}
                {policy.entry_test_name && (
                  <span className="ml-1 text-xs font-normal text-ink-muted">
                    ({policy.entry_test_name})
                  </span>
                )}
              </p>
            </div>

            {/* Required Background */}
            <div className="rounded-xl bg-surface-muted p-4 sm:col-span-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                Required Academic Background
              </span>
              <p className="mt-1 text-sm font-semibold text-ink">
                {policy.required_background || "Not specified"}
              </p>
            </div>

            {/* Additional Requirements */}
            {policy.additional_requirements ? (
              <div className="rounded-xl bg-surface-muted p-4 sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                  Additional Requirements
                </span>
                <p className="mt-1 text-sm leading-relaxed text-ink">
                  {policy.additional_requirements}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5 pt-2 text-xs text-ink-subtle">
            <CalendarCheck className="h-3.5 w-3.5 text-brand-600" />
            <span>
              Last Verified: {policy.last_verified || "20 September 2026"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 border-t border-surface-border/70 pt-4">
            <Button
              href={policy.source_url || admissionPortalUrl || "#"}
              variant="outline"
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Official Admission Policy
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl bg-surface-muted p-5 text-center text-xs text-ink-muted">
            <HelpCircle className="mx-auto mb-1 h-5 w-5 text-ink-subtle" />
            Specific policy text is currently pending verification. Refer to the
            official university portal for up-to-date eligibility rules.
          </div>

          {admissionPortalUrl && (
            <div className="pt-2">
              <Button
                href={admissionPortalUrl}
                variant="primary"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Official Admission Portal
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

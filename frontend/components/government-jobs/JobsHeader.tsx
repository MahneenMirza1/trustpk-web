"use client";

import { CheckCircle2, Info, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/common/Button";

type JobsHeaderProps = {
  totalJobs: number;
  onOpenSourcesModal?: () => void;
  onOpenPersonalization?: () => void;
};

export function JobsHeader({
  totalJobs,
  onOpenSourcesModal,
  onOpenPersonalization,
}: JobsHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-gradient-to-br from-brand-50/80 via-white to-white p-6 shadow-soft sm:p-8 lg:p-10">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl" />

      <div className="relative max-w-3xl">
        {/* Verification badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-white/90 px-3.5 py-1 text-xs font-semibold text-brand-800 shadow-sm backdrop-blur-sm">
          <ShieldCheck className="h-4 w-4 text-brand-600" />
          Authentic Government Verification Gateway
        </div>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-navy sm:text-4xl lg:text-5xl">
          Find Government Jobs
        </h1>

        <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg">
          Find current government job opportunities from verified official sources across Pakistan.{" "}
          {totalJobs > 0 && (
            <span className="font-semibold text-brand-700">
              ({totalJobs} verified active vacancies available today)
            </span>
          )}
        </p>

        {/* Action quick links */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {onOpenPersonalization && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenPersonalization}
              className="gap-2 border-brand-200 bg-white text-brand-800 hover:bg-brand-50"
            >
              <Sparkles className="h-4 w-4 text-brand-600" />
              Check My Eligibility
            </Button>
          )}

          {onOpenSourcesModal && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onOpenSourcesModal}
              className="gap-1.5 text-xs text-ink-muted hover:text-navy"
            >
              <CheckCircle2 className="h-4 w-4 text-success" />
              View 7 Verified Portals Status
            </Button>
          )}
        </div>
      </div>

      {/* Trust Principle Notice */}
      <div className="relative mt-6 flex items-start gap-3 rounded-2xl border border-brand-200/60 bg-white/90 p-4 text-xs leading-relaxed text-ink shadow-sm sm:text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        <div className="space-y-1">
          <p className="font-semibold text-navy">
            100% Authentic Government Recruitment Source Guarantee
          </p>
          <p className="text-ink-muted">
            TrustPK extracts current vacancies strictly from constitutional commissions and statutory bodies (FPSC, PPSC, SPSC, KPPSC, BPSC, NJP, and OTS). We do not list unofficial blogs, aggregators, or third-party forms. Every listing directs you straight to the authentic official application portal.
          </p>
        </div>
      </div>
    </div>
  );
}

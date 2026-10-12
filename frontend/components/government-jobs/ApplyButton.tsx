"use client";

import { ExternalLink, FileText, ShieldCheck } from "lucide-react";

type ApplyButtonProps = {
  applicationUrl: string;
  advertisementUrl?: string | null;
  officialSource: string;
  isExpired?: boolean;
};

export function ApplyButton({
  applicationUrl,
  advertisementUrl,
  officialSource,
  isExpired = false,
}: ApplyButtonProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-brand-200/90 bg-gradient-to-br from-brand-50/50 via-white to-white p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-2 text-xs font-semibold text-brand-800">
        <ShieldCheck className="h-4 w-4 text-brand-600" />
        Official Application Portal Gateway
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-navy sm:text-lg">
          Ready to Apply?
        </h3>
        <p className="text-xs sm:text-sm text-ink-muted">
          TrustPK ensures your application is submitted directly to{" "}
          <strong className="text-navy">{officialSource}</strong>. You will never be redirected to commercial job boards or unverified intermediaries.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        {/* Main Official Apply Button */}
        <a
          href={applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-card transition-all",
            isExpired
              ? "bg-slate-400 hover:bg-slate-500 cursor-not-allowed"
              : "bg-brand-600 hover:bg-brand-700 active:scale-[0.99]",
          ].join(" ")}
        >
          <span>Apply on Official Website</span>
          <ExternalLink className="h-4 w-4" />
        </a>

        {/* View Official Advertisement Button */}
        {advertisementUrl && (
          <a
            href={advertisementUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy/20 bg-white px-5 py-3.5 text-sm sm:text-base font-semibold text-navy shadow-sm transition hover:bg-brand-50 hover:text-brand-700"
          >
            <FileText className="h-4 w-4 text-brand-600" />
            <span>View Official Advertisement</span>
            <ExternalLink className="h-3.5 w-3.5 text-ink-subtle" />
          </a>
        )}
      </div>

      <p className="text-center sm:text-left text-[11px] text-ink-subtle">
        🔒 Safe & Verified Link: Points to official government server at{" "}
        <span className="font-mono text-ink-muted">
          {new URL(applicationUrl).hostname}
        </span>
      </p>
    </div>
  );
}

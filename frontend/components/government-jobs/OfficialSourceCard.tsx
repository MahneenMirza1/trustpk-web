"use client";

import { CheckCircle2, ExternalLink, Globe, ShieldCheck } from "lucide-react";

type OfficialSourceCardProps = {
  officialSource: string;
  officialSourceCode: string;
  sourceWebsite: string;
  lastVerifiedAt: string;
  isVerified?: boolean;
};

export function OfficialSourceCard({
  officialSource,
  officialSourceCode,
  sourceWebsite,
  lastVerifiedAt,
  isVerified = true,
}: OfficialSourceCardProps) {
  const formattedDate = (() => {
    try {
      const d = new Date(lastVerifiedAt);
      return d.toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return lastVerifiedAt;
    }
  })();

  return (
    <div className="rounded-2xl border border-brand-200/80 bg-gradient-to-br from-brand-50/70 via-white to-white p-5 shadow-soft sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                Official Government Source
              </span>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <h3 className="text-base font-bold text-navy sm:text-lg">
              {officialSource}
            </h3>
          </div>
        </div>

        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold border ${
          isVerified
            ? "bg-success-soft text-success border-success/20"
            : "bg-amber-50 text-amber-800 border-amber-200"
        }`}>
          {isVerified ? "Verified" : "Verification Required"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs sm:text-sm border-t border-brand-100 pt-3 text-ink-muted">
        <div>
          <span className="font-semibold text-navy">Last Verified:</span>{" "}
          <span className="text-ink">{formattedDate}</span>
        </div>
        <div>
          <span className="font-semibold text-navy">Official Source:</span>{" "}
          <span className="font-bold text-brand-700">[{officialSourceCode}]</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/80 p-3 border border-surface-border text-xs">
        <div className="flex items-center gap-2 text-ink-muted">
          <Globe className="h-4 w-4 text-brand-500" />
          <span className="truncate max-w-xs">{sourceWebsite}</span>
        </div>

        <a
          href={sourceWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-800 hover:underline"
        >
          Visit Source Portal
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink, RefreshCw, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { triggerJobsSync } from "@/services/jobsApi";
import type { OfficialSourceSummary } from "@/types/job";

type OfficialSourcesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sources: OfficialSourceSummary[];
  onRefreshCompleted?: () => void;
};

export function OfficialSourcesModal({
  isOpen,
  onClose,
  sources,
  onRefreshCompleted,
}: OfficialSourcesModalProps) {
  const [syncingSource, setSyncingSource] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSync = async (code?: string) => {
    setSyncingSource(code || "all");
    setSyncMessage(null);
    try {
      await triggerJobsSync(code);
      setSyncMessage(
        code
          ? `Successfully refreshed data from ${code}!`
          : "Successfully checked all official government portals!"
      );
      if (onRefreshCompleted) onRefreshCompleted();
    } catch {
      setSyncMessage("Temporary connection issue while checking portal. Please try again.");
    } finally {
      setSyncingSource(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-surface-border bg-white p-6 shadow-2xl sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-ink-subtle transition hover:bg-page hover:text-navy"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy sm:text-2xl">
              Verified Government Sources
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted">
              Authoritative Pakistani recruitment portals monitored in real-time by TrustPK.
            </p>
          </div>
        </div>

        {/* Sync notification message */}
        {syncMessage && (
          <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-3 text-xs font-semibold text-brand-800">
            {syncMessage}
          </div>
        )}

        {/* Sources List */}
        <div className="mt-6 space-y-3">
          {sources.map((src) => {
            const isSyncingThis = syncingSource === src.code || syncingSource === "all";

            return (
              <div
                key={src.code}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-surface-border bg-page p-4 transition hover:border-brand-200"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy">{src.name}</span>
                    <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-800">
                      {src.code}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success">
                      <CheckCircle2 className="h-3 w-3" />
                      {src.status}
                    </span>
                  </div>

                  <p className="text-xs text-ink-muted line-clamp-1">{src.description}</p>

                  <div className="flex items-center gap-3 text-[11px] text-ink-subtle">
                    <a
                      href={src.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-brand-600 hover:underline"
                    >
                      {src.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <span>•</span>
                    <span>
                      {src.active_jobs} active / {src.total_jobs} total jobs
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSyncingThis}
                  onClick={() => handleSync(src.code)}
                  className="gap-1.5 text-xs shrink-0 self-end sm:self-center"
                >
                  <RefreshCw className={`h-3 w-3 ${isSyncingThis ? "animate-spin" : ""}`} />
                  Refresh Source
                </Button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={Boolean(syncingSource)}
            onClick={() => handleSync()}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${syncingSource === "all" ? "animate-spin" : ""}`} />
            Sync All Portals Now
          </Button>

          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

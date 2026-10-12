"use client";

import { RefreshCw } from "lucide-react";

export function JobsLoadingState() {
  return (
    <div className="space-y-6">
      {/* Loading banner */}
      <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-brand-200/80 bg-brand-50/60 p-4 text-sm font-semibold text-brand-800 shadow-sm animate-pulse">
        <RefreshCw className="h-4 w-4 animate-spin text-brand-600" />
        Checking verified government sources...
      </div>

      {/* Grid skeletons */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-surface-border bg-white p-5 shadow-soft animate-pulse"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 rounded-md bg-slate-200" />
                <div className="h-5 w-28 rounded-full bg-slate-200" />
              </div>
              <div className="h-6 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-1/2 rounded bg-slate-100" />

              <div className="grid grid-cols-2 gap-2 border-y border-surface-border/60 py-3">
                <div className="h-4 w-20 rounded bg-slate-100" />
                <div className="h-4 w-16 rounded bg-slate-100" />
                <div className="col-span-2 h-4 w-full rounded bg-slate-100" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-2">
              <div className="h-4 w-24 rounded bg-slate-100" />
              <div className="h-8 w-24 rounded-lg bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

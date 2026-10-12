"use client";

import { use, useEffect, useState } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/common/Button";
import { JobDetails } from "@/components/government-jobs";
import { getJobDetail } from "@/services/jobsApi";
import type { GovernmentJobDetail } from "@/types/job";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;

  const [job, setJob] = useState<GovernmentJobDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadJob() {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobDetail(jobId);
        if (mounted) setJob(data);
      } catch (err: unknown) {
        if (mounted) {
          const status = typeof err === "object" && err !== null && "status" in err ? (err as { status: number }).status : 500;
          setError(
            status === 404
              ? "Government vacancy not found or has been withdrawn by the department."
              : "Unable to retrieve vacancy details from verified government sources."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadJob();
    return () => {
      mounted = false;
    };
  }, [jobId]);

  return (
    <main className="min-h-screen bg-page pb-20 pt-6 sm:pt-8 lg:pt-10">
      <div className="container-page">
        {loading ? (
          <div className="space-y-6">
            <div className="h-6 w-36 rounded bg-slate-200 animate-pulse" />
            <div className="h-48 w-full rounded-3xl bg-white border border-surface-border p-8 shadow-card animate-pulse">
              <div className="h-6 w-1/3 rounded bg-slate-200" />
              <div className="mt-4 h-10 w-2/3 rounded bg-slate-200" />
              <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="h-96 rounded-3xl bg-white border border-surface-border p-8 lg:col-span-8 animate-pulse" />
              <div className="h-64 rounded-2xl bg-white border border-surface-border p-6 lg:col-span-4 animate-pulse" />
            </div>
          </div>
        ) : error || !job ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-surface-border bg-white p-8 text-center shadow-card sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h1 className="mt-4 text-xl font-bold text-navy sm:text-2xl">
              Notice: Opportunity Information
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              {error || "The requested government job could not be retrieved."}
            </p>
            <div className="mt-6">
              <Button href="/jobs" className="gap-2 font-semibold">
                <ArrowLeft className="h-4 w-4" />
                Browse Current Government Vacancies
              </Button>
            </div>
          </div>
        ) : (
          <JobDetails job={job} />
        )}
      </div>
    </main>
  );
}

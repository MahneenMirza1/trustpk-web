"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { DeadlineBadge } from "./DeadlineBadge";
import type { GovernmentJobListItem } from "@/types/job";

type JobCardProps = {
  job: GovernmentJobListItem;
};

export function JobCard({ job }: JobCardProps) {
  const isClosingSoon = job.status === "Closing Soon";
  const isExpired = job.status === "Expired";

  return (
    <article
      className={[
        "group relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card sm:p-6",
        isClosingSoon
          ? "border-amber-300/80 bg-gradient-to-b from-amber-50/20 via-white to-white"
          : isExpired
          ? "border-surface-border bg-slate-50/50 opacity-80"
          : "border-surface-border hover:border-brand-300",
      ].join(" ")}
    >
      <div className="space-y-3.5">
        {/* Top Badges: Category & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            <Briefcase className="h-3 w-3" />
            {job.category}
          </span>

          <DeadlineBadge
            deadlineStr={job.deadline_str}
            status={job.status}
            size="sm"
          />
        </div>

        {/* Job Title & Organization */}
        <div>
          <h2 className="text-lg font-bold leading-snug text-navy group-hover:text-brand-600 transition-colors sm:text-xl">
            <Link href={`/jobs/${job.id}`} className="focus:outline-none focus:underline">
              {job.title}
            </Link>
          </h2>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs sm:text-sm text-ink-muted">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-ink-subtle" />
            <span className="line-clamp-1">
              {job.department || job.organization}
            </span>
          </div>
        </div>

        {/* Key Job Attributes: Province, BPS, Qualification */}
        <div className="grid grid-cols-2 gap-2 border-y border-surface-border/70 py-3 text-xs sm:text-sm">
          {/* Province */}
          <div className="flex items-center gap-1.5 text-ink">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-500" />
            <span className="truncate font-medium">{job.province}</span>
          </div>

          {/* Pay Scale / BPS */}
          <div className="flex items-center gap-1.5 text-ink">
            <span className="font-semibold text-navy">Pay Scale:</span>
            <span className="rounded bg-navy-50 px-1.5 py-0.5 text-xs font-bold text-navy">
              {job.pay_scale || "BPS As per Ad"}
            </span>
          </div>

          {/* Qualification snippet */}
          <div className="col-span-2 flex items-start gap-1.5 pt-0.5 text-xs text-ink-muted">
            <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-subtle" />
            <span className="line-clamp-1">
              <strong>Qual:</strong> {job.qualification || "Graduation / Relevant Degree"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Official Source Badge + View Details Button */}
      <div className="mt-4 flex items-center justify-between gap-3 pt-2">
        {/* Source verification tag */}
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          <span className="truncate">
            Source: <strong className="text-navy">{job.official_source_code}</strong>
          </span>
        </div>

        {/* View Details Link */}
        <Button
          href={`/jobs/${job.id}`}
          variant={isClosingSoon ? "primary" : "outline"}
          size="sm"
          className="gap-1.5 text-xs font-semibold"
        >
          View Details
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </article>
  );
}

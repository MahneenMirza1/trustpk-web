"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Building,
  Building2,
  FileCheck,
  FileText,
  MapPin,
} from "lucide-react";
import { ApplyButton } from "./ApplyButton";
import { DeadlineBadge } from "./DeadlineBadge";
import { EligibilitySection } from "./EligibilitySection";
import { OfficialSourceCard } from "./OfficialSourceCard";
import type { GovernmentJobDetail } from "@/types/job";

type JobDetailsProps = {
  job: GovernmentJobDetail;
};

export function JobDetails({ job }: JobDetailsProps) {
  const isExpired = job.status === "Expired";

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink-muted hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Government Jobs
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-white p-6 shadow-card sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
              {job.category}
            </span>
            <span className="rounded-lg bg-navy-50 px-3 py-1 text-xs font-bold text-navy">
              {job.pay_scale || "Pay Scale As Per Ad"}
            </span>
          </div>

          <DeadlineBadge deadlineStr={job.deadline_str} status={job.status} />
        </div>

        <h1 className="mt-4 text-2xl font-black tracking-tight text-navy sm:text-3xl lg:text-4xl">
          {job.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-ink-muted">
          <div className="flex items-center gap-1.5 font-medium text-navy">
            <Building2 className="h-4 w-4 text-brand-600" />
            <span>{job.organization}</span>
          </div>

          {job.department && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Building className="h-4 w-4 text-ink-subtle" />
                <span>{job.department}</span>
              </div>
            </>
          )}

          <span>•</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brand-500" />
            <span>{job.province}</span>
          </div>
        </div>

        {/* Quick Job Overview Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-surface-border/80 pt-6 sm:grid-cols-4">
          <div className="rounded-2xl border border-surface-border bg-page p-3.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Vacancies
            </span>
            <p className="mt-1 text-base font-bold text-navy">
              {job.vacancies && job.vacancies > 0 ? `${job.vacancies} ${job.vacancies === 1 ? 'post' : 'posts'}` : "As per Ad"}
            </p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-page p-3.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Posting Location
            </span>
            <p className="mt-1 text-base font-bold text-navy truncate">
              {job.location || job.province}
            </p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-page p-3.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Application Fee
            </span>
            <p className="mt-1 text-base font-bold text-navy truncate">
              {job.fee_amount || "Check Advertisement"}
            </p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-page p-3.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Case / Reference
            </span>
            <p className="mt-1 text-base font-bold text-navy truncate">
              {job.case_number || "Official Ref"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Details & Sidebar */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Eligibility, Description, Requirements */}
        <div className="space-y-8 lg:col-span-8">
          {/* Eligibility Section with self-check */}
          <EligibilitySection job={job} />

          {/* Job Description & Requirements */}
          <section className="space-y-4 rounded-3xl border border-surface-border bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600">
              <FileText className="h-4 w-4" />
              Job Overview & Description
            </div>
            <h2 className="text-xl font-bold text-navy">
              Official Job Details
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-ink-muted">
              {job.description ||
                `Official government opportunity for ${job.title} announced by ${job.organization} in ${job.province}.`}
            </p>

            {job.requirements && (
              <div className="mt-4 space-y-2 border-t border-surface-border/70 pt-4">
                <h3 className="text-sm font-bold text-navy">
                  Special Instructions & Requirements
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-ink-muted">
                  {job.requirements}
                </p>
              </div>
            )}
          </section>

          {/* Required Documents Section */}
          <section className="space-y-4 rounded-3xl border border-surface-border bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600">
              <FileCheck className="h-4 w-4" />
              Application Documentation
            </div>
            <h2 className="text-xl font-bold text-navy">
              Required Documents
            </h2>

            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {job.required_documents ||
                "Original CNIC, attested copies of educational transcripts and degrees, domicile certificate, and official fee payment receipt (challan or online PSID receipt)."}
            </p>
          </section>

          {/* Bottom Apply Action Card */}
          <ApplyButton
            applicationUrl={job.official_application_url}
            advertisementUrl={job.official_advertisement_url}
            officialSource={job.official_source}
            isExpired={isExpired}
          />
        </div>

        {/* Right Column: Source Verification & Quick Actions */}
        <div className="space-y-6 lg:col-span-4">
          {/* Official Verification Card */}
          <OfficialSourceCard
            officialSource={job.official_source}
            officialSourceCode={job.official_source_code}
            sourceWebsite={job.source_website}
            lastVerifiedAt={job.last_verified_at}
            isVerified={job.is_verified_source}
          />

          {/* Quick Apply Sticky Card */}
          <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-navy">
              Application Summary
            </h3>

            <div className="space-y-2 text-xs text-ink-muted">
              <div className="flex justify-between border-b border-surface-border/50 pb-2">
                <span>Closing Date:</span>
                <strong className="text-navy">{job.deadline_str || "See Advertisement"}</strong>
              </div>
              <div className="flex justify-between border-b border-surface-border/50 pb-2">
                <span>Status:</span>
                <span className="font-bold text-brand-700">{job.status}</span>
              </div>
              <div className="flex justify-between border-b border-surface-border/50 pb-2">
                <span>Application Fee:</span>
                <span className="font-semibold text-navy">{job.fee_amount || "Check Ad"}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Official Portal:</span>
                <span className="font-bold text-navy">{job.official_source_code}</span>
              </div>
            </div>

            <a
              href={job.official_application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
            >
              Apply on Official Website
            </a>

            {job.official_advertisement_url && (
              <a
                href={job.official_advertisement_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-2.5 text-xs font-semibold text-navy transition hover:bg-page"
              >
                View Official Advertisement
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

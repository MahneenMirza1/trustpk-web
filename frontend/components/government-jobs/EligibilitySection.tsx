"use client";

import { useState } from "react";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCheck,
  GraduationCap,
  Info,
  MapPin,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { checkJobEligibility } from "@/services/jobsApi";
import type { EligibilityCheckResult, GovernmentJobDetail } from "@/types/job";

type EligibilitySectionProps = {
  job: GovernmentJobDetail;
};

export function EligibilitySection({ job }: EligibilitySectionProps) {
  // Interactive checker state
  const [showChecker, setShowChecker] = useState<boolean>(false);
  const [userProvince, setUserProvince] = useState<string>("Punjab");
  const [userAge, setUserAge] = useState<string>("25");
  const [userGender, setUserGender] = useState<string>("Male");
  const [userQual, setUserQual] = useState<string>("");
  const [checking, setChecking] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<EligibilityCheckResult | null>(null);

  const handleRunCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await checkJobEligibility({
        job_id: job.id,
        province: userProvince,
        age: userAge ? parseInt(userAge, 10) : undefined,
        gender: userGender,
        qualification: userQual,
      });
      setCheckResult(res);
    } catch (err) {
      console.error("Error evaluating eligibility:", err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <section className="space-y-6 rounded-3xl border border-surface-border bg-white p-6 shadow-card sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
            <UserCheck className="h-4 w-4" />
            Eligibility Criteria
          </div>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            Candidate Requirements & Criteria
          </h2>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowChecker((v) => !v)}
          className="gap-2 border-brand-200 text-brand-800 hover:bg-brand-50"
        >
          <Sparkles className="h-4 w-4 text-brand-600" />
          {showChecker ? "Hide Self-Check" : "Check My Eligibility"}
          {showChecker ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Structured Criteria Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Minimum Qualification */}
        <div className="rounded-2xl border border-surface-border bg-page p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            <GraduationCap className="h-4 w-4 text-brand-600" />
            Minimum Qualification
          </div>
          <p className="mt-2 text-sm font-bold text-navy">
            {job.qualification || "Graduation / Relevant Degree (See Advertisement)"}
          </p>
          {job.degree_level && (
            <p className="mt-1 text-xs text-ink-muted">Level: {job.degree_level}</p>
          )}
        </div>

        {/* Required Field / Major */}
        <div className="rounded-2xl border border-surface-border bg-page p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            <Award className="h-4 w-4 text-brand-600" />
            Field / Major
          </div>
          <p className="mt-2 text-sm font-bold text-navy">
            {job.required_field || job.category}
          </p>
          <p className="mt-1 text-xs text-ink-muted">HEC recognized qualification</p>
        </div>

        {/* Minimum Experience */}
        <div className="rounded-2xl border border-surface-border bg-page p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            <FileCheck className="h-4 w-4 text-brand-600" />
            Experience
          </div>
          <p className="mt-2 text-sm font-bold text-navy">
            {job.experience || "Fresh graduates / Not specified in official advertisement"}
          </p>
        </div>

        {/* Age Limit */}
        <div className="rounded-2xl border border-surface-border bg-page p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            <UserCheck className="h-4 w-4 text-brand-600" />
            Age Limit
          </div>
          <p className="mt-2 text-sm font-bold text-navy">
            {job.age_min && job.age_max
              ? `${job.age_min} to ${job.age_max} Years`
              : job.age_max
              ? `Up to ${job.age_max} Years`
              : "As per Government Rules"}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            General age relaxation applies as per government notification.
          </p>
        </div>

        {/* Gender Eligibility */}
        <div className="rounded-2xl border border-surface-border bg-page p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            <Users className="h-4 w-4 text-brand-600" />
            Gender Eligibility
          </div>
          <p className="mt-2 text-sm font-bold text-navy">
            {job.gender || "Male / Female / Transgender"}
          </p>
        </div>

        {/* Domicile & Provincial Quota */}
        <div className="rounded-2xl border border-surface-border bg-page p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            <MapPin className="h-4 w-4 text-brand-600" />
            Domicile & Quota
          </div>
          <p className="mt-2 text-sm font-bold text-navy">
            {job.domicile || job.province}
          </p>
          {job.quota && (
            <p className="mt-1 text-xs text-ink-muted">Quota: {job.quota}</p>
          )}
        </div>
      </div>

      {/* Interactive Self-Check Tool */}
      {showChecker && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-5 shadow-sm transition-all sm:p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-600" />
            <h3 className="text-base font-bold text-navy">
              Interactive Eligibility Self-Check
            </h3>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            Enter your details below to check whether you appear to meet the minimum criteria published for this post.
          </p>

          <form onSubmit={handleRunCheck} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="text-xs font-semibold text-ink-muted">Your Domicile</label>
              <select
                value={userProvince}
                onChange={(e) => setUserProvince(e.target.value)}
                className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm text-navy shadow-sm focus:outline-none"
              >
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                <option value="Balochistan">Balochistan</option>
                <option value="Islamabad Capital Territory">Islamabad (ICT)</option>
                <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                <option value="Azad Jammu & Kashmir">AJK</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-muted">Your Age</label>
              <input
                type="number"
                min="18"
                max="65"
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
                className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm text-navy shadow-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-muted">Your Gender</label>
              <select
                value={userGender}
                onChange={(e) => setUserGender(e.target.value)}
                className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm text-navy shadow-sm focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-muted">Degree / Major</label>
              <input
                type="text"
                value={userQual}
                onChange={(e) => setUserQual(e.target.value)}
                placeholder="e.g. BS Computer Science"
                className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm text-navy shadow-sm focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                disabled={checking}
                className="w-full gap-2 rounded-xl py-2 font-semibold shadow-sm"
              >
                {checking ? "Checking..." : "Evaluate Criteria"}
              </Button>
            </div>
          </form>

          {/* Results Display */}
          {checkResult && (
            <div className="mt-5 rounded-2xl border border-white bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Self-Check Result
                </span>
                <span
                  className={`inline-flex rounded-full px-3 py-0.5 text-xs font-bold ${
                    checkResult.overall_status === "Likely Eligible"
                      ? "bg-success-soft text-success border border-success/30"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {checkResult.overall_status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {checkResult.criteria_checks.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 border-b border-surface-border/50 pb-2"
                  >
                    <div>
                      <span className="font-semibold text-navy">{item.criterion}:</span>{" "}
                      <span className="text-ink-muted">{item.required}</span>
                      <p className="text-[11px] text-ink-subtle">{item.notes}</p>
                    </div>
                    {item.is_eligible === true ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                    ) : item.is_eligible === false ? (
                      <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
                    ) : (
                      <Info className="h-4 w-4 shrink-0 text-brand-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <div className="flex items-start gap-3 rounded-2xl border border-brand-200/70 bg-brand-50/50 p-4 text-xs leading-relaxed text-navy sm:text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        <p>
          <strong>Notice:</strong> Eligibility is based on the information published in the official advertisement. Please verify all requirements on the official source before applying.
        </p>
      </div>
    </section>
  );
}

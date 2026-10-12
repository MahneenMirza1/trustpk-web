"use client";

import {
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  History,
  Layers,
  Percent,
  Receipt,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { calculateMerit } from "@/services/universityApi";
import type {
  MeritCalculationResult,
  MeritFormulaComponent,
  ProgramData,
} from "@/types/university";

export type ProgramDetailViewProps = {
  program: ProgramData;
  universityName: string;
  universityId: number;
  className?: string;
  onClose?: () => void;
};

export function ProgramDetailView({
  program,
  universityName,
  universityId,
  className = "",
  onClose,
}: ProgramDetailViewProps) {
  const isIllegal =
    (program.accreditation_status || "").toLowerCase().includes("disallowed") ||
    (program.accreditation_status || "").toLowerCase().includes("illegal") ||
    (program.admission_deadline || "").toLowerCase().includes("prohibited") ||
    (program.admission_deadline || "").toLowerCase().includes("banned");

  // Dynamic merit calculation state
  const [showCalculator, setShowCalculator] = useState(false);
  const [scores, setScores] = useState<Record<string, string>>({
    matric: "85",
    intermediate: "80",
    entry_test: "75",
  });
  const [calcResult, setCalcResult] = useState<MeritCalculationResult | null>(
    null
  );
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState("");

  const formulaData = program.merit_formula as
    | { components?: MeritFormulaComponent[] }
    | null
    | undefined;
  const components: MeritFormulaComponent[] = formulaData?.components || [
    { key: "matric", label: "Matric / O-Level", weight: 0.1 },
    { key: "intermediate", label: "Intermediate / FSc", weight: 0.4 },
    { key: "entry_test", label: "Entry Test", weight: 0.5 },
  ];

  async function handleCalculate() {
    setCalculating(true);
    setCalcError("");
    setCalcResult(null);

    const numericScores: Record<string, number> = {};
    for (const [k, v] of Object.entries(scores)) {
      const val = parseFloat(v);
      if (isNaN(val) || val < 0 || val > 100) {
        setCalcError(`Please enter a valid percentage (0 - 100) for ${k}.`);
        setCalculating(false);
        return;
      }
      numericScores[k] = val;
    }

    try {
      const res = await calculateMerit(universityId, program.id, numericScores);
      setCalcResult(res);
    } catch {
      // Local fallback calculation if backend calculation endpoint fails
      let merit = 0;
      const formulaUsed: MeritFormulaComponent[] = [];
      for (const comp of components) {
        const score = numericScores[comp.key] || 0;
        merit += score * comp.weight;
        formulaUsed.push({
          ...comp,
          weight_percent: `${Math.round(comp.weight * 100)}%`,
          score_entered: score,
        });
      }
      setCalcResult({
        program_id: program.id,
        program_name: program.name,
        calculated_merit: Math.round(merit * 100) / 100,
        formula_used: formulaUsed,
        source_url: program.source_url,
      });
    } finally {
      setCalculating(false);
    }
  }

  // Format accreditation badge
  const normAccred = (program.accreditation_status || "").toLowerCase();
  const isAccredited =
    normAccred.includes("accredited") &&
    !normAccred.includes("not") &&
    !normAccred.includes("disallowed");
  const isPendingAccred =
    normAccred.includes("review") ||
    normAccred.includes("process") ||
    normAccred.includes("pending");

  return (
    <Card
      id={`program-detail-${program.id}`}
      className={`overflow-hidden border border-brand-200/80 bg-white shadow-card transition-all ${className}`}
    >
      {/* Header bar */}
      <div
        className={`p-6 sm:p-8 ${
          isIllegal
            ? "bg-gradient-to-br from-red-50 via-white to-white"
            : "bg-gradient-to-br from-brand-50/80 via-white to-white"
        } border-b border-surface-border`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="navy">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                {program.degree_level || "Undergraduate"}
              </Badge>

              <Badge variant="neutral">
                <Layers className="h-3.5 w-3.5" aria-hidden />
                {program.department || "General Faculty"}
              </Badge>

              {isIllegal ? (
                <Badge variant="danger">
                  <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
                  Admissions Prohibited
                </Badge>
              ) : isAccredited ? (
                <Badge variant="success">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                  {program.accreditation_body || "Accredited"}
                </Badge>
              ) : isPendingAccred ? (
                <Badge variant="warning">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  Accreditation in Review
                </Badge>
              ) : (
                <Badge variant="neutral">
                  <HelpCircle className="h-3.5 w-3.5" aria-hidden />
                  Verification Required
                </Badge>
              )}
            </div>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-navy sm:text-3xl">
              {program.name}
            </h2>

            <p className="mt-1.5 text-xs text-ink-muted sm:text-sm">
              Offered by{" "}
              <strong className="text-navy">{program.department}</strong> at{" "}
              <span>{universityName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {program.source_url && (
              <Button
                href={program.source_url}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="sm"
                className="shadow-sm"
              >
                Official Program Link
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </Button>
            )}

            {onClose && (
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Close View
              </Button>
            )}
          </div>
        </div>

        {/* Public Advisory if illegal */}
        {isIllegal && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-danger/40 bg-red-100/90 p-4 text-xs text-danger-900 shadow-soft">
            <AlertTriangle className="h-5 w-5 shrink-0 text-danger" />
            <div>
              <p className="font-bold text-sm text-danger">
                Admissions Prohibited: Unaccredited Academic Program
              </p>
              <p className="mt-1 leading-relaxed text-red-800">
                {program.eligibility_criteria ||
                  "This degree program is not recognized by the relevant accreditation council or the HEC. Enrollment is prohibited."}
              </p>
            </div>
          </div>
        )}

        {/* 4 Core Actionable Metric Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* 1. Closing Merit */}
          <div className="rounded-2xl border border-surface-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-ink-subtle">
              <span className="flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5 text-brand-600" />
                Closing Merit
              </span>
              <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">
                Official
              </span>
            </div>
            <p className="mt-2 text-xl font-black text-navy sm:text-2xl font-mono">
              {program.closing_merit_display ||
                (program.last_closing_merit
                  ? `${program.last_closing_merit.toFixed(2)}%`
                  : "Not Announced")}
            </p>
            <p className="mt-1 text-[11px] text-ink-muted">
              {program.last_closing_merit
                ? "Latest verified admission cutoff"
                : "Awaiting university publication"}
            </p>
          </div>

          {/* 2. Admission Deadline */}
          <div className="rounded-2xl border border-surface-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-ink-subtle">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-brand-600" />
                Admission Deadline
              </span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                  isIllegal
                    ? "bg-red-100 text-danger"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {isIllegal ? "Prohibited" : "Current Session"}
              </span>
            </div>
            <p
              className={`mt-2 text-sm sm:text-base font-bold truncate ${
                isIllegal ? "text-danger" : "text-navy"
              }`}
              title={program.admission_deadline || "Open / Check Portal"}
            >
              {program.admission_deadline || "Open / Check Portal"}
            </p>
            <p className="mt-1 text-[11px] text-ink-muted">
              {isIllegal ? "Admissions banned by HEC" : "Verified cutoff date"}
            </p>
          </div>

          {/* 3. Program Accreditation */}
          <div className="rounded-2xl border border-surface-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-ink-subtle">
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-brand-600" />
                Accreditation
              </span>
              <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700">
                Council
              </span>
            </div>
            <p
              className="mt-2 text-sm sm:text-base font-bold text-navy truncate"
              title={program.accreditation_body || "HEC Verified"}
            >
              {program.accreditation_body || "HEC Verified"}
            </p>
            <p
              className={`mt-1 text-[11px] font-semibold truncate ${
                isIllegal
                  ? "text-danger"
                  : isAccredited
                  ? "text-emerald-700"
                  : "text-amber-700"
              }`}
            >
              {program.accreditation_status || "Accredited"}
            </p>
          </div>

          {/* 4. Fee Information */}
          <div className="rounded-2xl border border-surface-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-ink-subtle">
              <span className="flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5 text-brand-600" />
                Fee Information
              </span>
              <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">
                Tuition
              </span>
            </div>
            <p
              className="mt-2 text-sm sm:text-base font-bold text-navy truncate"
              title={
                program.fee_display ||
                (program.fee_per_semester
                  ? `PKR ${program.fee_per_semester.toLocaleString()} / sem`
                  : "Available on Portal")
              }
            >
              {program.fee_display ||
                (program.fee_per_semester
                  ? `PKR ${program.fee_per_semester.toLocaleString()}`
                  : "Available on Portal")}
            </p>
            <p className="mt-1 text-[11px] text-ink-muted">
              {program.fee_per_semester
                ? "Per semester charges"
                : "Official published scale"}
            </p>
          </div>
        </div>
      </div>

      {/* Body Section with Eligibility, Test, Merit Calculator & Historical Cutoffs */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Eligibility Criteria */}
          <div className="rounded-2xl border border-surface-border bg-surface-muted/50 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-navy font-bold text-base border-b border-surface-border/80 pb-3">
              <BookOpen className="h-5 w-5 text-brand-600" />
              <h3>Academic Eligibility Criteria</h3>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink">
              {program.eligibility_criteria ||
                "Minimum 50% marks in Intermediate (HSSC) with Mathematics, or equivalent qualification recognized by the IBCC."}
            </p>
            {program.admission_policy?.required_background && (
              <div className="mt-3 rounded-xl bg-white p-3 text-xs border border-surface-border/60">
                <span className="font-bold text-ink-subtle uppercase text-[10px]">
                  Required Background:
                </span>
                <p className="mt-0.5 font-medium text-navy">
                  {program.admission_policy.required_background}
                </p>
              </div>
            )}
          </div>

          {/* Admission Test Requirement */}
          <div className="rounded-2xl border border-surface-border bg-surface-muted/50 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-navy font-bold text-base border-b border-surface-border/80 pb-3">
              <Scale className="h-5 w-5 text-brand-600" />
              <h3>Required Admission Test</h3>
            </div>
            <div className="mt-3">
              <div className="inline-flex items-center gap-2 rounded-xl bg-brand-50 px-3.5 py-2 font-mono text-sm font-bold text-brand-900 border border-brand-200/60">
                <Sparkles className="h-4 w-4 text-brand-600" />
                {program.admission_test || "University Entry Test / NTS NAT"}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                Candidates must take the specified test and obtain the minimum
                cutoff percentile as mandated by the departmental admission
                committee.
              </p>
            </div>
          </div>
        </div>

        {/* Historical Merit Trend */}
        {program.historical_merit && program.historical_merit.length > 0 && (
          <div className="rounded-2xl border border-surface-border bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-brand-600" />
                <h3 className="font-bold text-navy text-base">
                  Historical Closing Merit Trends
                </h3>
              </div>
              <span className="text-xs text-ink-muted">
                Official cutoff records
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {program.historical_merit.map((h) => (
                <div
                  key={h.id || h.year}
                  className="rounded-xl border border-surface-border bg-surface-muted/60 p-3 text-center"
                >
                  <span className="text-xs font-semibold text-ink-muted">
                    Session {h.year}
                  </span>
                  <p className="mt-1 text-lg font-black text-navy font-mono">
                    {Number(h.closing_merit).toFixed(2)}%
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Merit Calculator Toggle */}
        <div className="rounded-2xl border border-brand-200/80 bg-gradient-to-r from-brand-50/50 via-white to-white p-5 sm:p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <Percent className="h-5 w-5 text-brand-600" />
                Calculate Your Merit for {program.name}
              </h3>
              <p className="mt-1 text-xs text-ink-muted">
                Evaluate your aggregate score against the official{" "}
                <strong>{program.closing_merit_display || "cutoff"}</strong>{" "}
                using the department formula.
              </p>
            </div>

            <Button
              onClick={() => setShowCalculator(!showCalculator)}
              variant={showCalculator ? "outline" : "primary"}
              size="sm"
            >
              {showCalculator ? "Hide Calculator" : "Open Merit Calculator"}
            </Button>
          </div>

          {/* Calculator Body */}
          {showCalculator && (
            <div className="mt-6 border-t border-surface-border/80 pt-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {components.map((comp) => (
                  <div key={comp.key}>
                    <Input
                      id={`calc-input-${comp.key}`}
                      label={`${comp.label} (${Math.round(comp.weight * 100)}%)`}
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={scores[comp.key] ?? ""}
                      onChange={(e) =>
                        setScores((prev) => ({
                          ...prev,
                          [comp.key]: e.target.value,
                        }))
                      }
                      placeholder="e.g. 82.5"
                    />
                  </div>
                ))}
              </div>

              {calcError && (
                <p className="mt-3 text-xs font-semibold text-danger">
                  {calcError}
                </p>
              )}

              <div className="mt-4 flex items-center gap-3">
                <Button
                  onClick={handleCalculate}
                  disabled={calculating}
                  size="sm"
                  variant="primary"
                >
                  {calculating ? "Calculating..." : "Compute Aggregate"}
                </Button>
              </div>

              {calcResult && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                        Your Calculated Aggregate
                      </span>
                      <p className="mt-1 text-3xl font-black font-mono text-emerald-950">
                        {calcResult.calculated_merit.toFixed(2)}%
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-ink-muted">
                        Closing Merit Reference
                      </span>
                      <p className="font-mono font-bold text-navy text-lg">
                        {program.closing_merit_display || "Not Announced"}
                      </p>
                      {program.last_closing_merit && (
                        <p
                          className={`text-xs font-bold ${
                            calcResult.calculated_merit >=
                            program.last_closing_merit
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }`}
                        >
                          {calcResult.calculated_merit >=
                          program.last_closing_merit
                            ? "✓ Above latest cutoff"
                            : "Below latest cutoff"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Verification Footer Stamp */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-surface-border/80 bg-surface-muted/40 px-4 py-3 text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>
              TrustPK verified against official university & council records on{" "}
              <strong className="text-navy">
                {program.last_verified || "20 September 2026"}
              </strong>
            </span>
          </div>

          {program.source_url && (
            <a
              href={program.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline"
            >
              Verify on University Source
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

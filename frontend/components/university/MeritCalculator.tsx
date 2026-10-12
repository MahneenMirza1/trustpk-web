"use client";

import { Calculator, CheckCircle2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { calculateMerit } from "@/services/universityApi";
import type {
  MeritCalculationResult,
  MeritFormulaComponent,
  ProgramData,
} from "@/types/university";

export type MeritCalculatorProps = {
  universityId: number;
  programs?: ProgramData[];
  className?: string;
};

export function MeritCalculator({
  universityId,
  programs = [],
  className = "",
}: MeritCalculatorProps) {
  // Select first program with formula, or first program
  const [selectedProgramId, setSelectedProgramId] = useState<number>(
    programs[0]?.id || 0
  );

  const selectedProgram =
    programs.find((p) => p.id === Number(selectedProgramId)) || programs[0];

  // Extract components from selected program's formula
  const formulaData = selectedProgram?.merit_formula as
    | { components?: MeritFormulaComponent[] }
    | null
    | undefined;
  const components: MeritFormulaComponent[] =
    formulaData?.components || [
      { key: "matric", label: "Matric / O-Level", weight: 0.1 },
      { key: "intermediate", label: "Intermediate / FSc", weight: 0.4 },
      { key: "entry_test", label: "Entry Test", weight: 0.5 },
    ];

  // State for dynamic scores entered
  const [scores, setScores] = useState<Record<string, string>>({
    matric: "85",
    intermediate: "80",
    entry_test: "75",
  });

  const [result, setResult] = useState<MeritCalculationResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState("");

  function handleScoreChange(key: string, value: string) {
    setScores((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleCalculate() {
    setCalcError("");

    // Validate inputs
    const numericScores: Record<string, number> = {};
    for (const comp of components) {
      const val = parseFloat(scores[comp.key] || "0");
      if (isNaN(val) || val < 0 || val > 100) {
        setCalcError(`Please enter a valid percentage (0–100) for ${comp.label}`);
        return;
      }
      numericScores[comp.key] = val;
    }

    try {
      setCalculating(true);
      if (selectedProgram?.id) {
        const data = await calculateMerit(
          universityId,
          selectedProgram.id,
          numericScores
        );
        setResult(data);
      } else {
        // Fallback local calculation
        let total = 0;
        const used: MeritFormulaComponent[] = [];
        components.forEach((c) => {
          const val = numericScores[c.key] || 0;
          total += val * c.weight;
          used.push({
            ...c,
            score_entered: val,
            weight_percent: `${Math.round(c.weight * 100)}%`,
          });
        });
        setResult({
          program_id: 0,
          program_name: selectedProgram?.name || "General Program",
          calculated_merit: Math.round(total * 100) / 100,
          formula_used: used,
          source_url: selectedProgram?.source_url,
        });
      }
    } catch (err) {
      console.error("Merit calculation error:", err);
      setCalcError("Failed to calculate merit. Please check inputs.");
    } finally {
      setCalculating(false);
    }
  }

  return (
    <Card className={`border border-surface-border p-6 sm:p-7 ${className}`}>
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Calculator className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy">Merit Calculator</h2>
            <p className="text-xs text-ink-muted">
              Dynamic aggregate computation based on official program weighting
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {/* Program Selection Dropdown if multiple programs available */}
        {programs.length > 1 && (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Select Program / Discipline
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => {
                setSelectedProgramId(Number(e.target.value));
                setResult(null);
              }}
              className="w-full rounded-xl border border-surface-border bg-page px-3.5 py-2.5 text-sm font-semibold text-navy focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.degree_level})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dynamic Formula Overview Banner */}
        <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-brand-900">
              Verified Formula: {selectedProgram?.name || "Undergraduate"}
            </span>
            {selectedProgram?.source_url && (
              <a
                href={selectedProgram.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
              >
                View Official Formula
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {components.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-navy shadow-sm ring-1 ring-black/5"
              >
                {c.label}:{" "}
                <span className="ml-1 text-brand-700">
                  {Math.round(c.weight * 100)}%
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Input Fields */}
        <div className="grid gap-3 sm:grid-cols-3">
          {components.map((comp) => (
            <div key={comp.key}>
              <Input
                label={`${comp.label} % (${Math.round(comp.weight * 100)}%)`}
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 85"
                value={scores[comp.key] || ""}
                onChange={(e) => handleScoreChange(comp.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        {calcError && (
          <p className="text-xs font-semibold text-danger">{calcError}</p>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <Button
            size="md"
            onClick={handleCalculate}
            disabled={calculating}
            className="w-full sm:w-auto"
          >
            {calculating ? "Calculating..." : "Calculate Merit"}
          </Button>
        </div>

        {/* Calculation Result Breakdown */}
        {result && (
          <div className="mt-5 rounded-2xl border-2 border-brand-500/30 bg-gradient-to-br from-brand-50/70 via-white to-white p-5 sm:p-6 shadow-soft animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-800">
                  Your Calculated Merit
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-brand-700 sm:text-4xl">
                    {result.calculated_merit.toFixed(2)}%
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                    <CheckCircle2 className="h-4 w-4" /> Computed
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-surface-border bg-white p-3.5 text-xs">
                <span className="font-bold text-navy">Formula Breakdown</span>
                <ul className="mt-1.5 space-y-1">
                  {result.formula_used.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between gap-4 text-ink-muted"
                    >
                      <span>{item.label}</span>
                      <span className="font-mono font-semibold text-ink">
                        {item.weight_percent}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {result.source_url && (
              <div className="mt-4 border-t border-brand-100 pt-3 text-right">
                <Button
                  href={result.source_url}
                  variant="ghost"
                  size="sm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-700"
                >
                  View Official Formula Source
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

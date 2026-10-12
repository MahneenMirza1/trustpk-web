"use client";

import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FolderTree,
  GraduationCap,
  Percent,
  Search,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import type { DepartmentPrograms, ProgramData } from "@/types/university";

export type DepartmentProgramHierarchyProps = {
  departments: DepartmentPrograms[];
  selectedProgram: ProgramData | null;
  onSelectProgram: (program: ProgramData) => void;
  searchQuery?: string;
  onResetSearch?: () => void;
  className?: string;
};

export function DepartmentProgramHierarchy({
  departments,
  selectedProgram,
  onSelectProgram,
  searchQuery = "",
  onResetSearch,
  className = "",
}: DepartmentProgramHierarchyProps) {
  if (departments.length === 0) {
    return (
      <div className={`rounded-3xl border border-dashed border-surface-border bg-white p-10 text-center shadow-soft ${className}`}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-ink-subtle">
          <Search className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-navy">
          No matching departments or programs found
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-ink-muted max-w-md mx-auto">
          We couldn&apos;t find any programs matching &ldquo;{searchQuery}&rdquo;. Try
          searching for a broader discipline like &ldquo;Computing&rdquo;, &ldquo;Engineering&rdquo;, or &ldquo;Business&rdquo;.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {onResetSearch && (
            <Button
              onClick={onResetSearch}
              variant="outline"
              size="sm"
            >
              Reset Search & Show All
            </Button>
          )}

          {searchQuery && (
            <Button
              href={`/universities?search=${encodeURIComponent(searchQuery)}`}
              variant="primary"
              size="sm"
            >
              Search All Universities for &ldquo;{searchQuery}&rdquo;
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {departments.map((deptGroup) => (
        <div
          key={deptGroup.department}
          className="rounded-3xl border border-surface-border bg-white shadow-soft overflow-hidden transition-all hover:border-brand-200"
        >
          {/* Department Header */}
          <div className="flex items-center justify-between border-b border-surface-border/80 bg-surface-muted/40 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100/70 text-brand-800">
                <FolderTree className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-navy text-base sm:text-lg">
                  {deptGroup.department}
                </h3>
                <span className="text-[11px] font-semibold text-ink-muted">
                  Faculty / Academic School
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800 border border-brand-200/50">
              <BookOpen className="h-3.5 w-3.5" />
              {deptGroup.programs.length}{" "}
              {deptGroup.programs.length === 1 ? "Program" : "Programs"}
            </span>
          </div>

          {/* Program list under this department */}
          <div className="divide-y divide-surface-border/60 p-2 sm:p-3">
            {deptGroup.programs.map((prog) => {
              const isSelected = selectedProgram?.id === prog.id;

              return (
                <div
                  key={prog.id}
                  onClick={() => onSelectProgram(prog)}
                  className={`group relative flex flex-col gap-3 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand-50/70 border-2 border-brand-500 shadow-md ring-2 ring-brand-500/20"
                      : "hover:bg-surface-muted/70 hover:shadow-sm border border-transparent"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Program title & degree level */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={isSelected ? "navy" : "neutral"}
                          className="text-[10px]"
                        >
                          <GraduationCap className="h-3 w-3" />
                          {prog.degree_level || "BS"}
                        </Badge>

                        {prog.accreditation_body && (
                          <Badge
                            variant="success"
                            className="text-[10px]"
                          >
                            <Award className="h-3 w-3" />
                            {prog.accreditation_body}
                          </Badge>
                        )}

                        {isSelected && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                            <Sparkles className="h-2.5 w-2.5" /> Selected
                          </span>
                        )}
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-navy group-hover:text-brand-700 transition-colors">
                        {prog.name}
                      </h4>
                    </div>

                    {/* Key admission summary pills */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {/* Closing merit pill */}
                      <div className="rounded-xl border border-surface-border/80 bg-white px-3 py-1.5 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle flex items-center gap-1">
                          <Percent className="h-3 w-3 text-brand-600" />
                          Closing Merit
                        </span>
                        <p className="font-mono text-xs sm:text-sm font-black text-navy mt-0.5">
                          {prog.closing_merit_display ||
                            (prog.last_closing_merit
                              ? `${prog.last_closing_merit.toFixed(2)}%`
                              : "Not Announced")}
                        </p>
                      </div>

                      {/* Admission deadline pill */}
                      <div className="rounded-xl border border-surface-border/80 bg-white px-3 py-1.5 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-brand-600" />
                          Deadline
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-navy mt-0.5 truncate max-w-[130px]">
                          {prog.admission_deadline || "Check Portal"}
                        </p>
                      </div>

                      {/* Select CTA Button */}
                      <div className="hidden sm:flex items-center pl-2">
                        <Button
                          size="sm"
                          variant={isSelected ? "primary" : "outline"}
                          className="pointer-events-none"
                        >
                          {isSelected ? "Viewing Details" : "View Program"}
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Micro overview */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted border-t border-surface-border/50 pt-2.5">
                    <span>
                      Test:{" "}
                      <strong className="text-navy">
                        {prog.admission_test || "Entry Test / NAT"}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Fee:{" "}
                      <strong className="text-navy">
                        {prog.fee_display ||
                          (prog.fee_per_semester
                            ? `PKR ${prog.fee_per_semester.toLocaleString()} / sem`
                            : "Published Scale")}
                      </strong>
                    </span>
                    {prog.last_verified && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

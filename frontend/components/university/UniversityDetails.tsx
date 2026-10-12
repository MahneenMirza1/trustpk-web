import {
    Building2,
    ExternalLink,
    Globe,
    GraduationCap,
    MapPin,
    ShieldCheck,
  } from "lucide-react";
  
  import { Badge } from "@/components/common/Badge";
  import { Button } from "@/components/common/Button";
  import { Card } from "@/components/common/Card";
  import type { University } from "@/types/university";
  
  type UniversityDetailsProps = {
    university: University;
  };
  
  function formatSector(sector: string | null | undefined) {
    if (!sector) return "Not specified";
  
    return sector.charAt(0).toUpperCase() + sector.slice(1);
  }
  
  function formatValue(value: string | null | undefined) {
    if (!value || !value.trim()) {
      return "To Verify";
    }
  
    return value;
  }
  
  function formatMerit(merit: number | null | undefined) {
    if (merit === null || merit === undefined) {
      return "To Verify";
    }
  
    return `${merit.toFixed(2)}%`;
  }
  
  function formatFee(fee: number | null | undefined) {
    if (fee === null || fee === undefined) {
      return "To Verify";
    }
  
    return `PKR ${fee.toLocaleString("en-PK")}`;
  }
  
  export function UniversityDetails({
    university,
  }: UniversityDetailsProps) {
    return (
      <div className="space-y-6">
        {/* University Header */}
        <Card className="overflow-hidden p-0">
          <div className="bg-gradient-to-br from-brand-50 via-white to-white p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-4 sm:gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-soft sm:h-16 sm:w-16">
                  <Building2 className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
                </div>
  
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {university.hec_recognized ? (
                      <Badge variant="success">
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                        HEC Recognized
                      </Badge>
                    ) : (
                      <Badge variant="warning">
                        Verification Required
                      </Badge>
                    )}
  
                    {university.sector ? (
                      <Badge variant="navy">
                        {formatSector(university.sector)}
                      </Badge>
                    ) : null}
                  </div>
  
                  <h1 className="mt-3 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                    {university.name}
                  </h1>
  
                  <div className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
                    <MapPin
                      className="h-4 w-4 shrink-0 text-brand-600"
                      aria-hidden
                    />
  
                    <span>
                      {university.city || "City not specified"}
                      {university.province
                        ? `, ${university.province}`
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
  
              {university.website ? (
                <Button
                  href={university.website}
                  variant="primary"
                  size="sm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                >
                  <Globe className="h-4 w-4 shrink-0" aria-hidden />
                  <span>Official Website</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                </Button>
              ) : null}
            </div>
          </div>
        </Card>
  
        {/* Quick Information */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Program
            </p>
  
            <p className="mt-2 text-sm font-semibold text-navy">
              {formatValue(university.program_name)}
            </p>
          </Card>
  
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Degree Level
            </p>
  
            <p className="mt-2 text-sm font-semibold text-navy">
              {formatValue(university.degree_level)}
            </p>
          </Card>
  
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Closing Merit
            </p>
  
            <p className="mt-2 text-sm font-semibold text-navy">
              {formatMerit(university.last_closing_merit)}
            </p>
          </Card>
  
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              Fee / Semester
            </p>
  
            <p className="mt-2 text-sm font-semibold text-navy">
              {formatFee(university.fee_per_semester)}
            </p>
          </Card>
        </div>
  
        {/* Academic Information */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </div>
  
            <div>
              <h2 className="text-lg font-bold text-navy">
                Academic Information
              </h2>
              <p className="text-sm text-ink-muted">
                Program and admission information available in TrustPK.
              </p>
            </div>
          </div>
  
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                Merit Formula
              </p>
  
              <p className="mt-2 rounded-xl border border-surface-border bg-surface-muted p-4 text-sm leading-6 text-ink">
                {formatValue(university.merit_formula_text)}
              </p>
            </div>
  
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                Last Closing Merit
              </p>
  
              <p className="mt-2 text-sm text-ink">
                {university.last_closing_merit != null
                  ? `${university.last_closing_merit.toFixed(2)}%`
                  : "To Verify from official source"}
              </p>
            </div>
          </div>
        </Card>
  
        {/* Location & Verification */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-lg font-bold text-navy">
              University Location
            </h2>
  
            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                  aria-hidden
                />
  
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                    City
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {formatValue(university.city)}
                  </p>
                </div>
              </div>
  
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                  aria-hidden
                />
  
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                    Province / Region
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {formatValue(university.province)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
  
          <Card>
            <h2 className="text-lg font-bold text-navy">
              Verification & Sources
            </h2>
  
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-xl bg-success-soft p-4">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    HEC Recognition
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    Recognition status stored in TrustPK.
                  </p>
                </div>
  
                {university.hec_recognized ? (
                  <Badge variant="success">Recognized</Badge>
                ) : (
                  <Badge variant="warning">To Verify</Badge>
                )}
              </div>
  
              {university.source_url ? (
                <Button
                  href={university.source_url}
                  variant="outline"
                  size="sm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  View Source
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </Button>
              ) : null}
            </div>
          </Card>
        </div>
  
        {/* Disclaimer */}
        <div className="rounded-xl border border-warning/20 bg-warning-soft p-4">
          <p className="text-sm leading-6 text-ink">
            <strong>Information notice:</strong> University information shown
            here is based on the sources stored in TrustPK. Admission criteria,
            fees, and closing merits may change. Always verify important
            admission details through the university&apos;s official source.
          </p>
        </div>
      </div>
    );
  }
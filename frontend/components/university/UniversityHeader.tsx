import {
  AlertTriangle,
  Award,
  Building2,
  Bus,
  Calendar,
  CalendarCheck,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import type { UniversityDetail } from "@/types/university";

export type UniversityHeaderProps = {
  university: UniversityDetail;
};

function formatSector(sector: string | null) {
  if (!sector) return "Not specified";
  return sector.charAt(0).toUpperCase() + sector.slice(1);
}

export function UniversityHeader({ university }: UniversityHeaderProps) {
  const normStatus = (university.hec_recognition_status || "").toLowerCase();
  const isRecognized = normStatus === "recognized";
  const isNotRecognized =
    normStatus.includes("not") ||
    normStatus.includes("fake") ||
    normStatus.includes("illegal") ||
    normStatus.includes("unrecognized");
  const isInProcess =
    normStatus.includes("process") ||
    normStatus.includes("review") ||
    normStatus.includes("provisional");

  return (
    <Card className="overflow-hidden border border-surface-border p-0 shadow-soft">
      <div
        className={`p-6 sm:p-8 lg:p-10 ${
          isNotRecognized
            ? "bg-gradient-to-br from-red-50/90 via-white to-white"
            : isInProcess
            ? "bg-gradient-to-br from-amber-50/80 via-white to-white"
            : "bg-gradient-to-br from-brand-50/70 via-white to-white"
        }`}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4 sm:gap-6">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white shadow-soft sm:h-20 sm:w-20 ${
                isNotRecognized
                  ? "bg-danger"
                  : isInProcess
                  ? "bg-amber-600"
                  : "bg-brand-600"
              }`}
            >
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                {isRecognized ? (
                  <Badge variant="success">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                    HEC Recognized
                  </Badge>
                ) : isNotRecognized ? (
                  <Badge variant="danger">
                    <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
                    HEC Not Recognized / Illegal
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    HEC In Process / Under Review
                  </Badge>
                )}

                <Badge variant="navy">{formatSector(university.sector)}</Badge>

                {university.hec_tier ? (
                  <Badge variant="neutral">Tier: {university.hec_tier}</Badge>
                ) : null}
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-navy sm:text-3xl lg:text-4xl">
                {university.name}
              </h1>

              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-ink-muted">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                  <span>
                    {university.city || "City not specified"}
                    {university.province ? `, ${university.province}` : ""}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-brand-800">
                  <CalendarCheck className="h-4 w-4 text-brand-600" />
                  <span>
                    Last Verified:{" "}
                    {university.hec_last_verified || "20 September 2026"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
            {university.admission_portal_url ? (
              <Button
                href={university.admission_portal_url}
                variant="primary"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 whitespace-nowrap shadow-sm"
              >
                <span>Admission Portal</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
              </Button>
            ) : null}

            {university.route_portal_url ? (
              <Button
                href={university.route_portal_url}
                variant="outline"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
                title="Direct to Transport and Route Directory"
                className="inline-flex items-center gap-1.5 whitespace-nowrap shadow-sm"
              >
                <Bus className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden />
                <span>Route Portal</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
              </Button>
            ) : null}

            {university.website ? (
              <Button
                href={university.website}
                variant="outline"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 whitespace-nowrap shadow-sm"
              >
                <Globe className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden />
                <span>Official Website</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
              </Button>
            ) : null}
          </div>
        </div>

        {/* Advisory alert for unrecognized institutions */}
        {isNotRecognized && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger/40 bg-red-100/90 p-4 text-xs text-danger-900 shadow-soft">
            <AlertTriangle className="h-5 w-5 shrink-0 text-danger" />
            <div>
              <p className="font-bold text-sm text-danger">
                Public Alert: Unrecognized / Fake Educational Entity
              </p>
              <p className="mt-1 leading-relaxed text-red-800">
                {university.hec_advisory_note ||
                  "The Higher Education Commission (HEC) of Pakistan has declared this institution illegal and unauthorized to grant academic degrees. Students and parents are warned that degrees earned here will NOT be attested or recognized."}
              </p>
            </div>
          </div>
        )}

        {/* Quick Highlights Bar */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-surface-border/80 pt-5">
          <div className="rounded-xl bg-surface-muted/90 p-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-brand-600" />
              Closing Merit
            </span>
            <p className="mt-1 font-mono text-base font-bold text-navy">
              {university.latest_closing_merit
                ? `${Number(university.latest_closing_merit).toFixed(2)}%`
                : isRecognized
                ? "Program Specific"
                : "N/A (Prohibited)"}
            </p>
          </div>

          <div className="rounded-xl bg-surface-muted/90 p-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-brand-600" />
              Admission Deadline
            </span>
            <p
              className={`mt-1 text-sm font-semibold ${
                isNotRecognized ? "text-danger" : "text-brand-800"
              }`}
            >
              {university.admission_closing_date || "Open / Check Portal"}
            </p>
          </div>

          <div className="rounded-xl bg-surface-muted/90 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle flex items-center gap-1">
                <Bus className="h-3.5 w-3.5 text-brand-600" />
                Route Fee
              </span>
              {university.route_portal_url && (
                <a
                  href={university.route_portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-brand-700 hover:underline flex items-center gap-0.5"
                >
                  Portal <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>
            <p className="mt-1 text-xs font-semibold text-navy truncate" title={university.route_charges || "Available on request"}>
              {university.route_charges || "Available on request"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

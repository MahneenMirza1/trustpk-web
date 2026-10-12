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
  GraduationCap,
  MapPin,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import type { UniversityCard as UniversityCardType } from "@/types/university";

export type UniversityCardProps = {
  university: UniversityCardType;
};

function formatSector(sector: string | null) {
  if (!sector) return "Not specified";
  return sector.charAt(0).toUpperCase() + sector.slice(1);
}

export function UniversityCard({ university }: UniversityCardProps) {
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
    <Card
      as="article"
      interactive
      className="flex h-full flex-col overflow-hidden border border-surface-border bg-white p-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-elevated"
    >
      {/* =====================================================
          CARD HEADER
      ===================================================== */}
      <div
        className={`border-b border-surface-border p-5 sm:p-6 ${
          isNotRecognized
            ? "bg-gradient-to-br from-red-50/80 via-white to-white"
            : isInProcess
            ? "bg-gradient-to-br from-amber-50/80 via-white to-white"
            : "bg-gradient-to-br from-brand-50/60 via-white to-white"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-soft ${
              isNotRecognized
                ? "bg-danger"
                : isInProcess
                ? "bg-amber-600"
                : "bg-brand-600"
            }`}
          >
            <Building2 className="h-6 w-6" aria-hidden />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {isRecognized ? (
              <Badge variant="success">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                HEC Recognized
              </Badge>
            ) : isNotRecognized ? (
              <Badge variant="danger">
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
                Not Recognized
              </Badge>
            ) : (
              <Badge variant="warning">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                In Process
              </Badge>
            )}
            <Badge variant="navy">{formatSector(university.sector)}</Badge>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href={`/universities/${university.id}`}
            className="group block focus:outline-none"
          >
            <h2 className="line-clamp-2 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-brand-700 sm:text-xl">
              {university.name}
            </h2>
          </Link>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden />
            <span>
              {university.city || "City not specified"}
              {university.province ? `, ${university.province}` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          CARD BODY: METRICS & DETAILS
      ===================================================== */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Warning banner for fake / unrecognized */}
        {isNotRecognized && (
          <div className="mb-4 rounded-xl border border-danger/30 bg-red-50 p-3 text-xs text-danger">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="h-4 w-4 shrink-0 text-danger" />
              HEC Fraud / Illegal Advisory
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-red-900">
              {university.hec_advisory_note ||
                "HEC has officially prohibited admissions. Degrees will NOT be attested."}
            </p>
          </div>
        )}

        {/* Advisory banner for in process */}
        {isInProcess && (
          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-bold">
              <Clock className="h-4 w-4 shrink-0 text-amber-700" />
              HEC Charter In Process
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800">
              {university.hec_advisory_note ||
                "Accreditation & physical inspection are currently underway with HEC."}
            </p>
          </div>
        )}

        <div className="space-y-2.5 text-xs">
          {/* Latest Closing Merit */}
          <div className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2">
            <span className="font-medium text-ink-muted flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-brand-600" />
              Latest Closing Merit
            </span>
            <span className="font-mono text-sm font-bold text-navy">
              {university.latest_closing_merit
                ? `${Number(university.latest_closing_merit).toFixed(2)}%`
                : isRecognized
                ? "Available on Portal"
                : "N/A (Prohibited)"}
            </span>
          </div>

          {/* Admission Closing Date */}
          <div className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2">
            <span className="font-medium text-ink-muted flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-brand-600" />
              Admission Deadline
            </span>
            <span
              className={`font-semibold ${
                isNotRecognized ? "text-danger" : "text-brand-800"
              }`}
            >
              {university.admission_closing_date || "Open / Check Portal"}
            </span>
          </div>

          {/* Route / Transport Charges & Direct Link */}
          <div className="rounded-lg border border-surface-border bg-slate-50/70 p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-ink-muted flex items-center gap-1.5">
                <Bus className="h-3.5 w-3.5 text-brand-600" />
                Transport & Route Charges
              </span>
              {university.route_portal_url && (
                <a
                  href={university.route_portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:text-brand-900 hover:underline"
                  title="Direct to Route Website"
                >
                  Route Portal
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <p className="mt-1 text-xs font-medium text-navy line-clamp-1">
              {university.route_charges || "Details available on portal"}
            </p>
          </div>

          {/* Key Programs */}
          {university.sample_programs && university.sample_programs.length > 0 ? (
            <div className="pt-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
                Key Programs:
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {university.sample_programs.map((prog, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700"
                  >
                    <GraduationCap className="h-3 w-3" />
                    {prog}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Verification Timestamp */}
        <div className="mt-4 flex items-center gap-1.5 border-t border-surface-border pt-3 text-[11px] text-ink-subtle">
          <CalendarCheck className="h-3.5 w-3.5 text-brand-600" />
          <span>Last Verified: {university.last_verified_display}</span>
        </div>

        {/* =====================================================
            CARD ACTION BUTTONS
        ===================================================== */}
        <div className="mt-4 flex items-center gap-2 pt-2">
          <Button
            href={`/universities/${university.id}`}
            variant="primary"
            size="sm"
            className="flex-1"
          >
            View Details
          </Button>

          {university.website ? (
            <Button
              href={university.website}
              variant="outline"
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 whitespace-nowrap px-3 text-xs"
              title="Visit Official University Website"
            >
              <Globe className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden />
              <span>Official Website</span>
              <ExternalLink className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
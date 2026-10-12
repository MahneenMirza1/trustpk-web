"use client";

import {
  AlertTriangle,
  Building2,
  CalendarCheck,
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

export type UniversityHeaderCompactProps = {
  university: UniversityDetail;
  className?: string;
};

function formatSector(sector: string | null) {
  if (!sector) return "Not specified";
  return sector.charAt(0).toUpperCase() + sector.slice(1);
}

export function UniversityHeaderCompact({
  university,
  className = "",
}: UniversityHeaderCompactProps) {
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
      className={`overflow-hidden border border-surface-border p-0 shadow-soft ${className}`}
    >
      <div
        className={`p-6 sm:p-8 ${
          isNotRecognized
            ? "bg-gradient-to-br from-red-50/90 via-white to-white"
            : isInProcess
            ? "bg-gradient-to-br from-amber-50/80 via-white to-white"
            : "bg-gradient-to-br from-brand-50/70 via-white to-white"
        }`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4 sm:gap-5">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-soft sm:h-16 sm:w-16 ${
                isNotRecognized
                  ? "bg-danger"
                  : isInProcess
                  ? "bg-amber-600"
                  : "bg-brand-600"
              }`}
            >
              <Building2 className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
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
                    HEC In Process / Under Review
                  </Badge>
                )}

                <Badge variant="navy">{formatSector(university.sector)}</Badge>

                {university.hec_tier ? (
                  <Badge variant="neutral">Tier: {university.hec_tier}</Badge>
                ) : null}
              </div>

              <h1 className="mt-2.5 text-2xl font-black tracking-tight text-navy sm:text-3xl lg:text-4xl">
                {university.name}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-ink-muted">
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
                    Verified:{" "}
                    {university.hec_last_verified || "20 September 2026"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-0 shrink-0">
            {university.admission_portal_url && (
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
            )}

            {university.website && (
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
            )}
          </div>
        </div>

        {/* Public Advisory if Not Recognized */}
        {isNotRecognized && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-danger/40 bg-red-100/90 p-4 text-xs text-danger-900 shadow-soft">
            <AlertTriangle className="h-5 w-5 shrink-0 text-danger" />
            <div>
              <p className="font-bold text-sm text-danger">
                Public Advisory: Unrecognized / Fake Educational Entity
              </p>
              <p className="mt-1 leading-relaxed text-red-800">
                {university.hec_advisory_note ||
                  "The Higher Education Commission (HEC) of Pakistan has declared this institution illegal and unauthorized to grant academic degrees. Students and parents are warned that degrees earned here will NOT be attested or recognized."}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

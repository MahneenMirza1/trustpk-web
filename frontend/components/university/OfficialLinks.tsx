import { Bus, ExternalLink, Globe, GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export type OfficialLinksProps = {
  website?: string | null;
  admissionPortal?: string | null;
  hecSource?: string | null;
  routePortal?: string | null;
  routeCharges?: string | null;
  className?: string;
};

export function OfficialLinks({
  website,
  admissionPortal,
  hecSource = "https://www.hec.gov.pk/english/universities/pages/recognised.aspx",
  routePortal,
  routeCharges,
  className = "",
}: OfficialLinksProps) {
  return (
    <Card className={`border border-surface-border p-6 sm:p-7 ${className}`}>
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Globe className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy">
              Official Gateway Links
            </h2>
            <p className="text-xs text-ink-muted">
              Authoritative channels for admissions, registration, and announcements
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {/* Official Website */}
        <div className="flex flex-col justify-between rounded-xl border border-surface-border bg-surface-muted p-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
              General Information
            </span>
            <p className="mt-1 font-bold text-navy">Official Website</p>
            <p className="mt-1 text-xs text-ink-muted">
              Main university domain and official faculty listings
            </p>
          </div>

          <div className="mt-4">
            <Button
              href={website || "#"}
              variant="outline"
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
              disabled={!website}
              className="w-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Globe className="h-3.5 w-3.5 shrink-0 text-brand-600" />
              <span>Visit Official Website</span>
              <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
            </Button>
          </div>
        </div>

        {/* Official Admission Portal */}
        <div className="flex flex-col justify-between rounded-xl border-2 border-brand-500/30 bg-gradient-to-br from-brand-50/70 via-white to-white p-4 shadow-xs">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
              Primary Gateway
            </span>
            <p className="mt-1 font-bold text-navy">Admission Portal</p>
            <p className="mt-1 text-xs text-ink-muted">
              Direct official portal for online applications and deadlines
            </p>
          </div>

          <div className="mt-4">
            <Button
              href={admissionPortal || website || "#"}
              variant="primary"
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
              disabled={!admissionPortal && !website}
              className="w-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
              <span>Open Admission Portal</span>
              <ExternalLink className="h-3 w-3 shrink-0 opacity-80" />
            </Button>
          </div>
        </div>

        {/* HEC Recognition Source */}
        <div className="flex flex-col justify-between rounded-xl border border-surface-border bg-surface-muted p-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
              Verification Authority
            </span>
            <p className="mt-1 font-bold text-navy">HEC Official Register</p>
            <p className="mt-1 text-xs text-ink-muted">
              National Higher Education Commission recognized list
            </p>
          </div>

          <div className="mt-4">
            <Button
              href={hecSource || "https://www.hec.gov.pk"}
              variant="outline"
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand-600" />
              <span>View Source</span>
              <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
            </Button>
          </div>
        </div>

        {/* Official Route / Transport Portal */}
        {routePortal ? (
          <div className="flex flex-col justify-between rounded-xl border border-surface-border bg-surface-muted p-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                University Transport
              </span>
              <p className="mt-1 font-bold text-navy">Transport & Route Portal</p>
              <p className="mt-1 text-xs text-ink-muted">
                {routeCharges || "Official bus routes, schedule, stops and transport fees"}
              </p>
            </div>

            <div className="mt-4">
              <Button
                href={routePortal}
                variant="outline"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Bus className="h-3.5 w-3.5" />
                Route Directory
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

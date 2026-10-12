import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export type RecognitionStatusProps = {
  status?: string | null;
  sourceUrl?: string | null;
  lastVerified?: string | null;
  tier?: string | null;
  advisoryNote?: string | null;
  className?: string;
};

type StatusConfig = {
  label: string;
  badgeVariant: "success" | "warning" | "neutral" | "danger";
  icon: typeof CheckCircle2;
  description: string;
  defaultSource: string;
};

function getStatusConfig(status?: string | null): StatusConfig {
  const norm = (status || "").trim().toLowerCase();

  if (
    norm.includes("not") ||
    norm.includes("fake") ||
    norm.includes("illegal") ||
    norm.includes("unrecognized")
  ) {
    return {
      label: "Not Recognized / Illegal",
      badgeVariant: "danger",
      icon: XCircle,
      description:
        "CRITICAL HEC ALERT: This institution is listed on the official HEC directory of Fake, Illegal, and Non-Chartered Institutions. It is not legally authorized to award degrees, and any qualifications granted will NOT be attested by HEC.",
      defaultSource:
        "https://www.hec.gov.pk/english/universities/pages/illegal-dais.aspx",
    };
  }

  if (
    norm.includes("process") ||
    norm.includes("review") ||
    norm.includes("provisional")
  ) {
    return {
      label: "In Process / Under Review",
      badgeVariant: "warning",
      icon: AlertTriangle,
      description:
        "HEC REVIEW ADVISORY: Institutional charter, academic infrastructure, or program accreditation is currently undergoing inspection and evaluation by the Higher Education Commission.",
      defaultSource:
        "https://www.hec.gov.pk/english/universities/pages/recognised.aspx",
    };
  }

  if (norm.includes("recognized")) {
    return {
      label: "Recognized",
      badgeVariant: "success",
      icon: CheckCircle2,
      description:
        "Confirmed chartered degree-awarding higher education institution officially registered in the Higher Education Commission of Pakistan directory.",
      defaultSource:
        "https://www.hec.gov.pk/english/universities/pages/recognised.aspx",
    };
  }

  return {
    label: "Under Verification",
    badgeVariant: "warning",
    icon: HelpCircle,
    description:
      "Record is currently being cross-referenced with the latest HEC official gazettes.",
    defaultSource:
      "https://www.hec.gov.pk/english/universities/pages/recognised.aspx",
  };
}

export function RecognitionStatus({
  status,
  sourceUrl,
  lastVerified = "20 September 2026",
  tier,
  advisoryNote,
  className = "",
}: RecognitionStatusProps) {
  const config = getStatusConfig(status);
  const StatusIcon = config.icon;
  const activeSourceUrl = sourceUrl || config.defaultSource;

  return (
    <Card className={`border border-surface-border p-6 sm:p-7 ${className}`}>
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy">HEC Recognition</h2>
            <p className="text-xs text-ink-muted">
              Higher Education Commission of Pakistan Institutional Status
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {tier && (
            <Badge variant="neutral" className="px-2.5 py-1 text-xs">
              Tier: {tier}
            </Badge>
          )}
          <Badge variant={config.badgeVariant} className="px-3 py-1 text-xs">
            <StatusIcon className="h-4 w-4" aria-hidden />
            {config.label}
          </Badge>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-surface-muted p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
            Recognition State
          </span>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-navy">
            <StatusIcon className="h-4 w-4 text-brand-600" />
            {config.label}
          </p>
        </div>

        <div className="rounded-xl bg-surface-muted p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
            Authoritative Source
          </span>
          <p className="mt-1 text-sm font-semibold text-ink">
            Higher Education Commission (HEC)
          </p>
        </div>

        <div className="rounded-xl bg-surface-muted p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
            Last Verified
          </span>
          <p className="mt-1 text-sm font-semibold text-ink">
            {lastVerified || "20 September 2026"}
          </p>
        </div>
      </div>

      {advisoryNote && (
        <div className="mt-3 rounded-lg border border-surface-border bg-slate-50 p-3 text-xs text-ink">
          <span className="font-bold text-navy">Official HEC Note: </span>
          {advisoryNote}
        </div>
      )}

      {activeSourceUrl && (
        <div className="mt-5 border-t border-surface-border/70 pt-4">
          <Button
            href={activeSourceUrl}
            variant="outline"
            size="sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            View HEC Source
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Button>
        </div>
      )}
    </Card>
  );
}

import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import type { AccreditationData, ProgramData } from "@/types/university";

export type AccreditationStatusProps = {
  accreditations: AccreditationData[];
  programs: ProgramData[];
  className?: string;
};

type CouncilConfig = {
  label: string;
  badgeVariant: "success" | "warning" | "neutral" | "danger";
  icon: typeof CheckCircle2;
};

function getAccreditationConfig(status?: string | null): CouncilConfig {
  const norm = (status || "").trim().toLowerCase();

  switch (norm) {
    case "accredited":
    case "verified":
      return {
        label: "Accredited",
        badgeVariant: "success",
        icon: CheckCircle2,
      };
    case "not accredited":
      return {
        label: "Not Accredited",
        badgeVariant: "danger",
        icon: XCircle,
      };
    case "pending verification":
      return {
        label: "Pending Verification",
        badgeVariant: "warning",
        icon: AlertTriangle,
      };
    case "outdated":
      return {
        label: "Outdated",
        badgeVariant: "warning",
        icon: AlertTriangle,
      };
    default:
      return {
        label: "Not Found",
        badgeVariant: "neutral",
        icon: HelpCircle,
      };
  }
}

export function AccreditationStatus({
  accreditations = [],
  className = "",
}: AccreditationStatusProps) {
  return (
    <Card className={`border border-surface-border p-6 sm:p-7 ${className}`}>
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Award className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy">
              Program Accreditation
            </h2>
            <p className="text-xs text-ink-muted">
              Professional council accreditation evaluated separately from
              institutional recognition
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/50 p-3.5 text-xs text-brand-900">
        <strong>Important:</strong> Institutional recognition by HEC does not
        guarantee accreditation of every technical program. Engineering,
        Computing, and Medical degrees require individual council registration.
      </div>

      {/* Accreditations List */}
      <div className="mt-5 space-y-4">
        {accreditations.length > 0 ? (
          accreditations.map((item, idx) => {
            const config = getAccreditationConfig(item.status);
            const StatusIcon = config.icon;

            return (
              <div
                key={idx}
                className="flex flex-col justify-between gap-3 rounded-xl border border-surface-border bg-surface-muted p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy">{item.council}</span>
                    <Badge variant={config.badgeVariant} className="text-[11px]">
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                    <span>
                      Accreditation Body:{" "}
                      <strong className="text-ink">{item.council}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Last Verified:{" "}
                      <strong className="text-ink">
                        {item.last_verified || "20 September 2026"}
                      </strong>
                    </span>
                  </div>
                </div>

                {item.source_url && (
                  <Button
                    href={item.source_url}
                    variant="ghost"
                    size="sm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start text-xs sm:self-center"
                  >
                    View Source
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-surface-border p-6 text-center text-xs text-ink-muted">
            <HelpCircle className="mx-auto mb-1 h-5 w-5 text-ink-subtle" />
            No individual program accreditations recorded yet for this university.
          </div>
        )}
      </div>
    </Card>
  );
}

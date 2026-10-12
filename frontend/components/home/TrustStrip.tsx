import {
  Briefcase,
  GraduationCap,
  Landmark,
  ShieldCheck,
  University,
} from "lucide-react";

const items = [
  {
    label: "Trusted Information",
    description: "Reliable guidance",
    icon: ShieldCheck,
  },
  {
    label: "Universities",
    description: "Admissions & programs",
    icon: University,
  },
  {
    label: "Government Jobs",
    description: "Public opportunities",
    icon: Briefcase,
  },
  {
    label: "Scholarships",
    description: "Funding pathways",
    icon: GraduationCap,
  },
  {
    label: "Public Schemes",
    description: "Citizen programs",
    icon: Landmark,
  },
  {
    label: "Digital Verification",
    description: "Safer browsing",
    icon: ShieldCheck,
  },
] as const;

export function TrustStrip() {
  return (
    <section
      className="border-b border-surface-border bg-white"
      aria-label="Trust categories"
    >
      <div className="container-page py-6 sm:py-8">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <div className="flex h-full flex-col items-start gap-3 rounded-2xl border border-surface-border bg-page/80 p-4 transition duration-200 hover:border-brand-200 hover:bg-white hover:shadow-soft">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-snug text-navy">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

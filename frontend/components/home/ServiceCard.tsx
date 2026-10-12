import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Briefcase,
  GraduationCap,
  Landmark,
  Shield,
  University,
} from "lucide-react";

export const serviceIconMap = {
  university: University,
  jobs: Briefcase,
  scholarship: GraduationCap,
  schemes: Landmark,
  verify: Shield,
  ai: Bot,
} as const;

export type ServiceIconKey = keyof typeof serviceIconMap;

export type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: ServiceIconKey;
  featured?: boolean;
};

export function ServiceCard({
  title,
  description,
  href,
  cta,
  icon,
  featured = false,
}: ServiceCardProps) {
  const Icon = serviceIconMap[icon];

  return (
    <article
      className={[
        "group flex h-full flex-col rounded-2xl border p-6 shadow-soft transition-all duration-300 sm:p-7",
        "hover:-translate-y-1.5 hover:shadow-elevated",
        featured
          ? "border-brand-200 bg-gradient-to-br from-brand-600 to-brand-700 text-white hover:border-brand-300"
          : "border-surface-border bg-white hover:border-brand-200",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5",
          featured
            ? "bg-white/15 text-white ring-1 ring-white/20"
            : "bg-brand-50 text-brand-700",
        ].join(" ")}
      >
        <Icon className="h-5 w-5" />
      </span>

      <h3
        className={[
          "mt-5 text-lg font-semibold",
          featured ? "text-white" : "text-ink",
        ].join(" ")}
      >
        {title}
      </h3>

      <p
        className={[
          "mt-2 flex-1 text-[15px] leading-relaxed",
          featured ? "text-white/80" : "text-ink-muted",
        ].join(" ")}
      >
        {description}
      </p>

      <Link
        href={href}
        className={[
          "mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition",
          featured
            ? "text-white hover:text-brand-50"
            : "text-brand-700 hover:text-brand-800",
        ].join(" ")}
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}

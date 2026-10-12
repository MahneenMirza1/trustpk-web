import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/common/Badge";

export type OpportunityCardProps = {
  category: string;
  title: string;
  description: string;
  meta: string;
  href: string;
};

export function OpportunityCard({
  category,
  title,
  description,
  meta,
  href,
}: OpportunityCardProps) {
  return (
    <article className="rounded-2xl border border-surface-border bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-elevated sm:p-7">
      <Badge variant="brand">{category}</Badge>
      <h3 className="mt-4 text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {description}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-ink-subtle">{meta}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

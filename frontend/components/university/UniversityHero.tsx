import { GraduationCap } from "lucide-react";

export type UniversityHeroProps = {
  badge?: string;
  title?: string;
  description?: string;
};

export function UniversityHero({
  badge = "Pakistan University Guide",
  title = "Find the Right University for Your Future",
  description = "Explore universities, programs, HEC recognition, admission information, merit details, and fees in one trusted place.",
}: UniversityHeroProps) {
  return (
    <section className="border-b border-surface-border bg-white">
      <div className="container-page py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
            <GraduationCap className="h-4 w-4" aria-hidden />
            {badge}
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

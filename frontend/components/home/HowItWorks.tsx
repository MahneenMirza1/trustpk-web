import {
  Compass,
  Eye,
  MousePointerClick,
  Search,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Section";
import { homeCopy } from "@/lib/copy/home";

const icons = [MousePointerClick, Search, Eye, Compass] as const;

export function HowItWorks() {
  return (
    <Section id="how-it-works" tone="white">
      <SectionHeading
        align="center"
        title={homeCopy.how.heading}
        description={homeCopy.how.subheading}
      />

      <ol className="relative mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div
          className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-brand-100 via-brand-300 to-brand-100 xl:block"
          aria-hidden
        />
        {homeCopy.how.steps.map((step, index) => {
          const Icon = icons[index];
          return (
            <li
              key={step.step}
              className="relative rounded-2xl border border-surface-border bg-page/70 p-6 text-center shadow-soft"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-soft ring-4 ring-brand-50">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
                {step.step}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

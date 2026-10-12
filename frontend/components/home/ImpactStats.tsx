import { Section, SectionHeading } from "@/components/common/Section";
import { homeCopy } from "@/lib/copy/home";

export function ImpactStats() {
  return (
    <Section id="impact" tone="muted">
      <SectionHeading
        align="center"
        title={homeCopy.impact.heading}
        description="Concept pillars for TrustPK — real metrics will replace these when module data is available."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {homeCopy.impact.items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-surface-border bg-white p-6 shadow-soft"
          >
            <p className="text-lg font-semibold tracking-tight text-navy">
              {item.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

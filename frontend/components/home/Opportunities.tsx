"use client";

import { useState } from "react";
import { Section, SectionHeading } from "@/components/common/Section";
import { homeCopy, opportunityCards } from "@/lib/copy/home";
import { OpportunityCard } from "./OpportunityCard";

export function Opportunities() {
  const [active, setActive] = useState("All");
  const categories = homeCopy.opportunities.categories;

  const filtered =
    active === "All"
      ? opportunityCards
      : opportunityCards.filter((card) => card.category === active);

  return (
    <Section id="opportunities" tone="muted">
      <SectionHeading
        title={homeCopy.opportunities.heading}
        description={homeCopy.opportunities.subheading}
      />

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Opportunity categories">
        {categories.map((category) => {
          const selected = active === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selected}
              className={[
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                selected
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-surface-border bg-white text-ink-muted hover:border-brand-200 hover:text-brand-700",
              ].join(" ")}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {filtered.map((card) => (
          <OpportunityCard
            key={card.title}
            category={card.category}
            title={card.title}
            description={card.description}
            meta={card.meta}
            href={card.href}
          />
        ))}
      </div>
    </Section>
  );
}

export { Opportunities as OpportunitiesSection };

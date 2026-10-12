import { Section, SectionHeading } from "@/components/common/Section";
import { homeCopy, serviceCards } from "@/lib/copy/home";
import { ServiceCard } from "./ServiceCard";

export function Services() {
  return (
    <Section id="services" tone="white">
      <SectionHeading
        title={homeCopy.services.heading}
        description={homeCopy.services.subheading}
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {serviceCards.map((item) => (
          <ServiceCard
            key={item.title}
            title={item.title}
            description={item.description}
            href={item.href}
            cta={item.cta}
            icon={item.icon}
            featured={item.featured}
          />
        ))}
      </div>
    </Section>
  );
}

export { Services as ServicesSection };

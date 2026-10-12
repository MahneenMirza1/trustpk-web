import {
  Brain,
  Layers,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Section } from "@/components/common/Section";
import { homeCopy } from "@/lib/copy/home";

const icons = [ShieldCheck, Layers, Brain, Users] as const;

export function WhyTrustPK() {
  return (
    <Section id="why-trustpk" tone="muted">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-brand-200/30 blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-[1.5rem] border border-brand-100 bg-gradient-to-br from-navy via-navy-800 to-brand-700 p-8 text-white shadow-elevated sm:p-10">
            <div className="absolute inset-0 opacity-20 grid-bg" aria-hidden />
            <div className="relative">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <ShieldCheck className="h-8 w-8 text-brand-200" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
                Trust meets technology
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
                A blue-first citizen platform designed to make public information
                clearer, safer, and easier to explore.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {["Secure", "Clear", "Guided", "Accessible"].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-600">
            Why TrustPK?
          </p>
          <h2 className="heading-section mt-3">{homeCopy.why.heading}</h2>
          <p className="mt-4 text-body">{homeCopy.why.subheading}</p>
          <ul className="mt-8 space-y-5">
            {homeCopy.why.points.map((point, index) => {
              const Icon = icons[index];
              return (
                <li key={point.title} className="flex gap-4">
                  <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-soft ring-1 ring-surface-border">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">{point.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                      {point.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}

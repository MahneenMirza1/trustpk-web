import { type ReactNode } from "react";

export type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted" | "white" | "navy";
};

const tones = {
  default: "bg-transparent",
  muted: "bg-page",
  white: "bg-white",
  navy: "bg-navy text-white",
};

export function Section({
  id,
  children,
  className = "",
  tone = "default",
}: SectionProps) {
  return (
    <section id={id} className={`section-pad ${tones[tone]} ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p
          className={`text-sm font-semibold uppercase tracking-[0.14em] ${
            light ? "text-brand-200" : "text-brand-600"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`heading-section mt-3 ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-body ${light ? "text-white/75" : ""}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

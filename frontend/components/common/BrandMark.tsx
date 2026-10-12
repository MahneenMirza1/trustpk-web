import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export type BrandMarkProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
  showTagline?: boolean;
  className?: string;
};

const sizes = {
  sm: { mark: "h-8 w-8", icon: "h-4 w-4", text: "text-lg", tag: "text-[10px]" },
  md: { mark: "h-10 w-10", icon: "h-5 w-5", text: "text-xl", tag: "text-[11px]" },
  lg: { mark: "h-12 w-12", icon: "h-6 w-6", text: "text-2xl", tag: "text-xs" },
};

export function BrandMark({
  href = "/",
  size = "md",
  tone = "dark",
  showTagline = false,
  className = "",
}: BrandMarkProps) {
  const s = sizes[size];
  const textClass = tone === "light" ? "text-white" : "text-navy";
  const tagClass = tone === "light" ? "text-white/70" : "text-ink-muted";

  const content = (
    <>
      <span
        className={`inline-flex ${s.mark} items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-soft`}
        aria-hidden
      >
        <ShieldCheck className={s.icon} strokeWidth={2.25} />
      </span>
      <span className="leading-none">
        <span className={`block font-bold tracking-tight ${s.text} ${textClass}`}>
          TrustPK
        </span>
        {showTagline ? (
          <span className={`mt-1 block font-medium ${s.tag} ${tagClass}`}>
            Trusted Digital Assistant
          </span>
        ) : null}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-2.5 ${className}`}
        aria-label="TrustPK home"
      >
        {content}
      </Link>
    );
  }

  return <div className={`inline-flex items-center gap-2.5 ${className}`}>{content}</div>;
}

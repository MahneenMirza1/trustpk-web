import Link from "next/link";
import { BrandMark } from "@/components/common/BrandMark";
import { footerGroups, siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-600/25 to-transparent"
        aria-hidden
      />
      <div className="container-page relative py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
          <div className="max-w-sm">
            <BrandMark href="/" tone="light" showTagline />
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              {siteConfig.tagline}
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/55">
            © {year} TrustPK. All rights reserved.
          </p>
          <p className="text-sm text-white/45">Built for citizens of Pakistan</p>
        </div>
      </div>
    </footer>
  );
}

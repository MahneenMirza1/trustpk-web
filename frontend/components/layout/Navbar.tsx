"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { BrandMark } from "@/components/common/BrandMark";
import { Button } from "@/components/common/Button";
import { aiNav, primaryNav } from "@/lib/site";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        openButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const solid = scrolled || !isHome || open;

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-surface-border/80 bg-white/95 shadow-nav backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3 sm:h-[4.25rem]">
        <BrandMark size="sm" className="sm:hidden" />
        <BrandMark className="hidden sm:inline-flex" />

        {/* Desktop navigation — large screens only */}
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          {primaryNav.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-muted hover:bg-brand-50 hover:text-navy",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href={aiNav.href}
            className={[
              "ml-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
              isActivePath(pathname, aiNav.href)
                ? "bg-navy text-white"
                : "bg-brand-50 text-brand-700 hover:bg-brand-100",
            ].join(" ")}
            aria-current={isActivePath(pathname, aiNav.href) ? "page" : undefined}
          >
            {aiNav.label}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Auth buttons on tablet+; mobile gets them inside hamburger */}
          <div className="hidden items-center gap-2 md:flex xl:flex">
            <Button href="/login" variant="ghost" size="sm">
              Login
            </Button>
            <Button href="/signup" size="sm">
              Sign Up
            </Button>
          </div>

          {/* Hamburger for mobile + tablet */}
          <button
            ref={openButtonRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-white text-navy shadow-soft transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 xl:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id={menuId}
          className="border-t border-surface-border bg-white xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav
            className="container-page flex max-h-[calc(100dvh-4.25rem)] flex-col gap-1 overflow-y-auto py-4"
            aria-label="Mobile"
          >
            {[...primaryNav, aiNav].map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-muted hover:bg-brand-50 hover:text-navy",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-3 grid grid-cols-1 gap-2 border-t border-surface-border pt-4 md:hidden">
              <Button href="/login" variant="outline" className="w-full">
                Login
              </Button>
              <Button href="/signup" className="w-full">
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

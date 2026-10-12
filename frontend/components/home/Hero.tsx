import { ApiStatusBadge } from "@/components/home/ApiStatusBadge";
import { Button } from "@/components/common/Button";
import { homeCopy } from "@/lib/copy/home";

export function Hero() {
  const { hero } = homeCopy;

  return (
    <section className="relative overflow-hidden border-b border-surface-border/70 bg-gradient-to-b from-brand-50 via-page to-white">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl"
        aria-hidden
      />

      <div className="container-page relative py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <ApiStatusBadge />
          </div>
          <h1 className="heading-hero">{hero.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-body">{hero.subtitle}</p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button href="/#services" size="lg" showArrow className="w-full sm:w-auto">
              {hero.primaryCta}
            </Button>
            <Button
              href="/#how-it-works"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              {hero.secondaryCta}
            </Button>
          </div>
          <p className="mt-6 text-sm font-medium text-ink-muted">{hero.trustLine}</p>
        </div>
      </div>
    </section>
  );
}

export { Hero as HeroSection };

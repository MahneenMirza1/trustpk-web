import { Button } from "@/components/common/Button";
import { homeCopy } from "@/lib/copy/home";

export function FinalCTA() {
  const { cta } = homeCopy;

  return (
    <section className="section-pad pt-8">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-navy-800 to-brand-700 px-6 py-14 text-center shadow-elevated sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute inset-0 opacity-25 grid-bg" aria-hidden />
          <div
            className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-brand-400/30 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {cta.heading}
            </h2>
            <p className="mt-4 text-base text-white/75 sm:text-lg">{cta.subheading}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/#services" variant="white" size="lg" showArrow className="w-full sm:w-auto">
                {cta.primary}
              </Button>
              <Button
                href="/signup"
                variant="outline"
                size="lg"
                className="w-full border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10 sm:w-auto"
              >
                {cta.secondary}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

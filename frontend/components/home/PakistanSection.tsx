import { MapPin } from "lucide-react";
import { Section } from "@/components/common/Section";
import { homeCopy } from "@/lib/copy/home";

export function PakistanSection() {
  return (
    <Section id="built-for-pakistan" tone="white">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-600">
            Pakistan
          </p>
          <h2 className="heading-section mt-3">{homeCopy.pakistan.heading}</h2>
          <p className="mt-4 text-body">{homeCopy.pakistan.body}</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3.5 py-2 text-sm font-medium text-brand-700">
            <MapPin className="h-4 w-4" />
            Designed for Pakistani citizens
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.75rem] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-brand-100 p-8 shadow-card sm:p-10">
          <div className="absolute inset-0 opacity-40 grid-bg" aria-hidden />
          <div className="relative mx-auto flex aspect-[4/5] max-w-xs items-center justify-center">
            {/* Abstract Pakistan outline using SVG paths - simplified stylized map */}
            <svg
              viewBox="0 0 200 260"
              className="h-full w-full drop-shadow-sm"
              role="img"
              aria-label="Stylized outline of Pakistan"
            >
              <defs>
                <linearGradient id="pkFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1769E0" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#0B1F3A" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              <path
                d="M78 18c18-4 38 2 52 14 10 8 18 22 16 36-2 12 4 20 12 28 10 10 18 24 14 38-4 16-2 28 8 40 8 10 10 24 2 34-8 10-8 22-2 34 4 8 2 18-8 24-14 8-30 8-44 2-12-4-24 0-36-6-10-6-24-4-32-14-8-10-4-24 2-34 6-10 2-22-4-32-6-10-4-24 4-34 8-10 6-24-2-34-6-8-2-20 6-30 8-10 20-18 32-26z"
                fill="url(#pkFill)"
                stroke="#1769E0"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {[
                [96, 70],
                [118, 110],
                [88, 140],
                [110, 175],
                [78, 200],
              ].map(([x, y], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="4.5" fill="#1769E0" />
                  <circle cx={x} cy={y} r="10" fill="#1769E0" opacity="0.15" />
                </g>
              ))}
              <path
                d="M96 70 L118 110 L88 140 L110 175 L78 200"
                fill="none"
                stroke="#2F80ED"
                strokeWidth="1.5"
                strokeDasharray="3 4"
                opacity="0.7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Section>
  );
}

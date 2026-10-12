export const homeCopy = {
  hero: {
    title: "Your Trusted Digital Assistant for Pakistan",
    subtitle:
      "Discover verified universities, government opportunities, scholarships, public schemes, and trusted digital information — all in one place.",
    primaryCta: "Explore TrustPK",
    secondaryCta: "How It Works",
    trustLine: "Built to help citizens find reliable information",
  },
  services: {
    heading: "Everything You Need in One Place",
    subheading:
      "One platform for discovering opportunities, making informed decisions, and verifying digital information.",
  },
  why: {
    heading: "Why TrustPK?",
    subheading:
      "A modern digital assistant designed to make important public information clearer and easier to navigate.",
    points: [
      {
        title: "Verified",
        description:
          "Find information designed around reliable and official sources.",
      },
      {
        title: "Simple",
        description:
          "Complex information presented in a clear and understandable way.",
      },
      {
        title: "Smart",
        description:
          "AI-powered assistance helps users find and understand information.",
      },
      {
        title: "Citizen-centric",
        description: "Designed around the needs of Pakistani citizens.",
      },
    ],
  },
  how: {
    heading: "Information. Simplified.",
    subheading: "Find what you need in just a few steps.",
    steps: [
      {
        step: "01",
        title: "Choose",
        description:
          "Choose a service such as universities, jobs, scholarships, or verification.",
      },
      {
        step: "02",
        title: "Explore",
        description: "Search and filter information relevant to you.",
      },
      {
        step: "03",
        title: "Understand",
        description: "TrustPK presents important details clearly.",
      },
      {
        step: "04",
        title: "Act",
        description: "Use the official source or next step to proceed.",
      },
    ],
  },
  opportunities: {
    heading: "Opportunities Worth Exploring",
    subheading:
      "A preview of the kinds of information citizens will explore across TrustPK.",
    categories: ["All", "Universities", "Jobs", "Scholarships", "Schemes"],
  },
  ai: {
    heading: "Meet Your TrustPK AI Assistant",
    subheading: "Not sure where to start? Just ask.",
    cta: "Ask TrustPK",
  },
  impact: {
    heading: "Built for meaningful access",
    items: [
      {
        label: "Multiple Information Categories",
        detail: "Universities, jobs, scholarships, schemes, and verification.",
      },
      {
        label: "Verified Sources Focus",
        detail: "Designed to prioritize reliable and official information.",
      },
      {
        label: "Citizen-Focused Design",
        detail: "Clear language and guidance for everyday users.",
      },
      {
        label: "AI-Assisted Discovery",
        detail: "Ask questions and get guided through TrustPK modules.",
      },
    ],
  },
  pakistan: {
    heading: "Built for Pakistan",
    body: "TrustPK brings important information into one accessible digital experience for Pakistani citizens.",
  },
  cta: {
    heading: "Start Exploring TrustPK",
    subheading:
      "Find trusted information, discover opportunities, and make informed decisions.",
    primary: "Explore TrustPK",
    secondary: "Create Account",
  },
} as const;

export const serviceCards = [
  {
    title: "Universities & Admissions",
    description:
      "Explore universities, degree programs, admissions, accreditation, and merit information.",
    href: "/universities",
    cta: "Explore Universities",
    icon: "university" as const,
    featured: false,
  },
  {
    title: "Government Jobs",
    description:
      "Discover government employment opportunities, organizations, requirements, and deadlines.",
    href: "/jobs",
    cta: "Explore Jobs",
    icon: "jobs" as const,
    featured: false,
  },
  {
    title: "Scholarships",
    description:
      "Find scholarships and understand eligibility, deadlines, and application requirements.",
    href: "/scholarships",
    cta: "Find Scholarships",
    icon: "scholarship" as const,
    featured: false,
  },
  {
    title: "Government Schemes",
    description:
      "Discover public programs and identify opportunities that may match your profile.",
    href: "/schemes",
    cta: "Explore Schemes",
    icon: "schemes" as const,
    featured: false,
  },
  {
    title: "Verify Information",
    description:
      "Check suspicious websites and verify potentially misleading digital information.",
    href: "/verify",
    cta: "Verify Now",
    icon: "verify" as const,
    featured: false,
  },
  {
    title: "TrustPK AI Assistant",
    description:
      "Ask questions about universities, jobs, scholarships, schemes, and trusted information.",
    href: "/ai",
    cta: "Ask TrustPK",
    icon: "ai" as const,
    featured: true,
  },
];

export const opportunityCards = [
  {
    category: "Universities",
    title: "University Admission Guidance",
    description:
      "Explore program options, admissions pathways, and accreditation information in one place.",
    meta: "Module coming soon",
    href: "/universities",
  },
  {
    category: "Jobs",
    title: "Government Job Opportunities",
    description:
      "Browse public-sector openings and prepare with clear requirement summaries.",
    meta: "Module coming soon",
    href: "/jobs",
  },
  {
    category: "Scholarships",
    title: "Scholarship Discovery",
    description:
      "Review scholarship categories and understand what to check before applying.",
    meta: "Module coming soon",
    href: "/scholarships",
  },
  {
    category: "Schemes",
    title: "Public Scheme Explorer",
    description:
      "Learn about citizen programs and identify next steps for further research.",
    meta: "Module coming soon",
    href: "/schemes",
  },
];

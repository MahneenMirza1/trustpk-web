export const siteConfig = {
  name: "TrustPK",
  tagline: "Your Trusted Digital Assistant for Pakistan",
  description:
    "Discover trusted information about Pakistani universities, government jobs, scholarships, schemes, and digital verification with TrustPK.",
};

export type NavLink = {
  href: string;
  label: string;
};

export const primaryNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/universities", label: "Universities" },
  { href: "/jobs", label: "Jobs" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/schemes", label: "Schemes" },
  { href: "/verify", label: "Verify" },
];

export const aiNav: NavLink = { href: "/ai", label: "AI Assistant" };

export const footerGroups = [
  {
    title: "Platform",
    links: [
      { href: "/universities", label: "Universities" },
      { href: "/jobs", label: "Jobs" },
      { href: "/scholarships", label: "Scholarships" },
      { href: "/schemes", label: "Government Schemes" },
    ],
  },
  {
    title: "Verification",
    links: [
      { href: "/verify", label: "Website Verification" },
      { href: "/verify", label: "Information Verification" },
    ],
  },
  {
    title: "TrustPK",
    links: [
      { href: "/about", label: "About" },
      { href: "/#how-it-works", label: "How It Works" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Help Center" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

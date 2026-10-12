export type PlaceholderMeta = {
  title: string;
  description: string;
};

export type NavItem = {
  href: string;
  label: string;
};

export type ServiceCardItem = {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: "university" | "jobs" | "scholarship" | "schemes" | "verify" | "ai";
  featured?: boolean;
};

export type OpportunityCardItem = {
  category: string;
  title: string;
  description: string;
  meta: string;
  href: string;
};

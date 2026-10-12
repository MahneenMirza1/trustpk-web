import {
  AISection,
  FinalCTA,
  HeroSection,
  HowItWorks,
  ImpactStats,
  OpportunitiesSection,
  PakistanSection,
  ServicesSection,
  TrustStrip,
  WhyTrustPK,
} from "@/components/home";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <ServicesSection />
      <WhyTrustPK />
      <HowItWorks />
      <OpportunitiesSection />
      <AISection />
      <ImpactStats />
      <PakistanSection />
      <FinalCTA />
    </>
  );
}

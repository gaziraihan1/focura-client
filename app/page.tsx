import FAQSection from "@/components/public/home/FAQSection";
import FeatureSection from "@/components/public/home/FeatureSection";
import FeatureShowcase from "@/components/public/home/FeatureShowcase";
import FinalCTA from "@/components/public/home/FinalCTA";
import Hero from "@/components/public/home/Hero";
import IntegrationsSection from "@/components/public/home/IntegrationsSection";
import PricingSection from "@/components/public/home/PricingSection";
import SecuritySection from "@/components/public/home/SecuritySection";
import Testimonials from "@/components/public/home/Testimonials";
import WorkflowSteps from "@/components/public/home/WorkflowSteps";

export default function Home() {
  return (
    <div>
      <Hero />
      {/* Social proof — right after the hero */}
      <IntegrationsSection />
      {/* Product tour */}
      <FeatureShowcase />
      {/* Value props */}
      <FeatureSection />
      {/* How it works */}
      <WorkflowSteps />
      {/* More social proof */}
      <Testimonials />
      <PricingSection />
      <SecuritySection />
      <FinalCTA />
      <FAQSection />
    </div>
  );
}

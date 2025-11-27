import FAQSection from "@/components/Home/FAQSection";
import FeatureSection from "@/components/Home/FeatureSection";
import FeatureShowcase from "@/components/Home/FeatureShowcase";
import FinalCTA from "@/components/Home/FinalCTA";
import Hero from "@/components/Home/Hero";
import IntegrationsSection from "@/components/Home/IntegrationsSection";
import PricingSection from "@/components/Home/PricingSection";
import SecuritySection from "@/components/Home/SecuritySection";
import Testimonials from "@/components/Home/Testimonials";
import WorkflowSteps from "@/components/Home/WorkflowSteps";
// import ProductShowcase from "@/components/Home/ProductShowcase";

export default function Home() {
  return (
    <div >
    <Hero />
    <FeatureSection />
    {/* <ProductShowcase /> */}
    <FeatureShowcase />
    <WorkflowSteps />
    <Testimonials />
    <PricingSection />
    <IntegrationsSection/>
    <SecuritySection />
    <FinalCTA />
    <FAQSection />
    </div>
  );
}

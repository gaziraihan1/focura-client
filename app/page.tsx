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
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Focura – Focus Smarter. Manage Workspaces, Projects & Teams",
  description:
    "Focura helps teams stay focused with smart workspaces, task management, real-time collaboration, and productivity insights—all in one platform.",

  keywords: [
    "productivity platform",
    "workspace management",
    "task management",
    "team collaboration",
    "project tracking",
    "focura",
  ],

  applicationName: "Focura",
  category: "productivity",

  openGraph: {
    title: "Focura – Focus Smarter. Work Better.",
    description:
      "Organize workspaces, manage tasks, collaborate with your team, and track productivity—all in one focused platform.",
    url: "https://focura-client.vercel.app",
    siteName: "Focura",
    images: [
      {
        url: "https://focura.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Focura productivity platform dashboard",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Focura – Focus Smarter. Work Better.",
    description:
      "Manage workspaces, tasks, and teams with clarity. Stay focused with Focura.",
    images: ["https://focura.app/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  alternates: {
    canonical: "https://focura-client.vercel.app",
  },
};


export default function Home() {
  return (
    <div >
    <Hero />
    <FeatureSection />
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

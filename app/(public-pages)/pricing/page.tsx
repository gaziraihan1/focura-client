import type { Metadata } from "next";
import PricingContent from "./pricing-content";

export const metadata: Metadata = {
  title: "Pricing | Focura",
  description:
    "View Focura's transparent pricing plans. Free tier for individuals, Pro and Team plans for growing teams. No hidden fees.",
  keywords: [
    "focura pricing",
    "project management pricing",
    "task management plans",
    "team collaboration pricing",
    "productivity tool cost",
  ],
  openGraph: {
    title: "Focura Pricing – Simple, Transparent Plans",
    description:
      "Choose the right Focura plan for your team. Free, Pro, and Team options with no hidden fees.",
    url: "https://focura-client.vercel.app/pricing",
    siteName: "Focura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focura Pricing – Simple, Transparent Plans",
    description:
      "Choose the right Focura plan for your team. Free, Pro, and Team options with no hidden fees.",
  },
  alternates: {
    canonical: "https://focura-client.vercel.app/pricing",
  },
};

export default function PricingPage() {
  return <PricingContent />;
}

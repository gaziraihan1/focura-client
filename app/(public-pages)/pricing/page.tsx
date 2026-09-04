import type { Metadata } from "next";
import PricingContent from "./pricing-content";

export const metadata: Metadata = {
  title: "Pricing | Gablura",
  description:
    "View Gablura's transparent pricing plans. Free tier for individuals, Pro and Team plans for growing teams. No hidden fees.",
  keywords: [
    "gablura pricing",
    "project management pricing",
    "task management plans",
    "team collaboration pricing",
    "productivity tool cost",
  ],
  openGraph: {
    title: "Gablura Pricing – Simple, Transparent Plans",
    description:
      "Choose the right Gablura plan for your team. Free, Pro, and Team options with no hidden fees.",
    url: "https://gablura-client.vercel.app/pricing",
    siteName: "Gablura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gablura Pricing – Simple, Transparent Plans",
    description:
      "Choose the right Gablura plan for your team. Free, Pro, and Team options with no hidden fees.",
  },
  alternates: {
    canonical: "https://gablura-client.vercel.app/pricing",
  },
};

export default function PricingPage() {
  return <PricingContent />;
}

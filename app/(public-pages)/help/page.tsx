import type { Metadata } from "next";
import HelpContent from "./help-content";

export const metadata: Metadata = {
  title: "Help Center | Focura",
  description:
    "Get help with Focura. Browse guides, FAQs, and tutorials to get started with workspace management, task tracking, and team collaboration.",
  keywords: [
    "focura help",
    "focura support",
    "focura guide",
    "focura tutorial",
    "focura FAQ",
    "workspace help",
  ],
  openGraph: {
    title: "Focura Help Center – Guides, FAQs & Tutorials",
    description:
      "Get help with Focura. Browse guides, FAQs, and tutorials to master workspace management.",
    url: "https://focura-client.vercel.app/help",
    siteName: "Focura",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Focura help center",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focura Help Center – Guides, FAQs & Tutorials",
    description:
      "Get help with Focura. Browse guides, FAQs, and tutorials to master workspace management.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://focura-client.vercel.app/help",
  },
};

export default function HelpPage() {
  return <HelpContent />;
}

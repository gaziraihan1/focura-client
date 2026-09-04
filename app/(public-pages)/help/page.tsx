import type { Metadata } from "next";
import HelpContent from "./help-content";

export const metadata: Metadata = {
  title: "Help Center | Gablura",
  description:
    "Get help with Gablura. Browse guides, FAQs, and tutorials to get started with workspace management, task tracking, and team collaboration.",
  keywords: [
    "gablura help",
    "gablura support",
    "gablura guide",
    "gablura tutorial",
    "gablura FAQ",
    "workspace help",
  ],
  openGraph: {
    title: "Gablura Help Center – Guides, FAQs & Tutorials",
    description:
      "Get help with Gablura. Browse guides, FAQs, and tutorials to master workspace management.",
    url: "https://gablura.vercel.app/help",
    siteName: "Gablura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gablura Help Center – Guides, FAQs & Tutorials",
    description:
      "Get help with Gablura. Browse guides, FAQs, and tutorials to master workspace management.",
  },
  alternates: {
    canonical: "https://gablura.vercel.app/help",
  },
};

export default function HelpPage() {
  return <HelpContent />;
}

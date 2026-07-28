import type { Metadata } from "next";
import AllFeaturesContent from "./all-features-content";

export const metadata: Metadata = {
  title: "Feature Requests | Focura",
  description:
    "Vote on features you'd love to see in Focura, or submit your own idea. Help shape the future of our productivity platform.",
  keywords: [
    "focura feature requests",
    "focura voting",
    "focura feedback",
    "product suggestions",
    "feature board",
  ],
  openGraph: {
    title: "Focura Feature Requests – Vote & Submit Ideas",
    description:
      "Vote on features you'd love to see in Focura, or submit your own idea.",
    url: "https://focura-client.vercel.app/features/all-features",
    siteName: "Focura",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Focura feature requests board",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focura Feature Requests – Vote & Submit Ideas",
    description:
      "Vote on features you'd love to see in Focura, or submit your own idea.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://focura-client.vercel.app/features/all-features",
  },
};

export default function AllFeaturesPage() {
  return <AllFeaturesContent />;
}

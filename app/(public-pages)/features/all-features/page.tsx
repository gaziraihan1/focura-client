import type { Metadata } from "next";
import AllFeaturesContent from "./all-features-content";

export const metadata: Metadata = {
  title: "Feature Requests | Gablura",
  description:
    "Vote on features you'd love to see in Gablura, or submit your own idea. Help shape the future of our productivity platform.",
  keywords: [
    "gablura feature requests",
    "gablura voting",
    "gablura feedback",
    "product suggestions",
    "feature board",
  ],
  openGraph: {
    title: "Gablura Feature Requests – Vote & Submit Ideas",
    description:
      "Vote on features you'd love to see in Gablura, or submit your own idea.",
    url: "https://gablura.vercel.app/features/all-features",
    siteName: "Gablura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gablura Feature Requests – Vote & Submit Ideas",
    description:
      "Vote on features you'd love to see in Gablura, or submit your own idea.",
  },
  alternates: {
    canonical: "https://gablura.vercel.app/features/all-features",
  },
};

export default function AllFeaturesPage() {
  return <AllFeaturesContent />;
}

import type { Metadata } from "next";
import RoadmapContent from "./roadmap-content";

export const metadata: Metadata = {
  title: "Roadmap | Focura",
  description:
    "See what Focura has shipped, what's in progress, and what's planned next. A transparent view of our product roadmap.",
  keywords: [
    "focura roadmap",
    "product roadmap",
    "feature timeline",
    "upcoming features",
    "product updates",
  ],
  openGraph: {
    title: "Focura Roadmap – What We're Building Next",
    description:
      "A transparent view of everything we've shipped and everything we're building next.",
    url: "https://focura-client.vercel.app/roadmap",
    siteName: "Focura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focura Roadmap – What We're Building Next",
    description:
      "A transparent view of everything we've shipped and everything we're building next.",
  },
  alternates: {
    canonical: "https://focura-client.vercel.app/roadmap",
  },
};

export default function RoadmapPage() {
  return <RoadmapContent />;
}

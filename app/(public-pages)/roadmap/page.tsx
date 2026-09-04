import type { Metadata } from "next";
import RoadmapContent from "./roadmap-content";

export const metadata: Metadata = {
  title: "Roadmap | Gablura",
  description:
    "See what Gablura has shipped, what's in progress, and what's planned next. A transparent view of our product roadmap.",
  keywords: [
    "gablura roadmap",
    "product roadmap",
    "feature timeline",
    "upcoming features",
    "product updates",
  ],
  openGraph: {
    title: "Gablura Roadmap – What We're Building Next",
    description:
      "A transparent view of everything we've shipped and everything we're building next.",
    url: "https://gablura.vercel.app/roadmap",
    siteName: "Gablura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gablura Roadmap – What We're Building Next",
    description:
      "A transparent view of everything we've shipped and everything we're building next.",
  },
  alternates: {
    canonical: "https://gablura.vercel.app/roadmap",
  },
};

export default function RoadmapPage() {
  return <RoadmapContent />;
}

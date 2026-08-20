import { Suspense } from "react";
import ResourcePopularList from "@/components/Resources/ResourcePopularList";
import ResourcesCategories from "@/components/Resources/ResourcesCategories";
import ResourcesCTA from "@/components/Resources/ResourcesCTA";
import ResourcesFeaturedGuides from "@/components/Resources/ResourcesFeaturedGuides";
import ResourcesHero from "@/components/Resources/ResourcesHero";
import ResourceUpdateList from "@/components/Resources/ResourceUpdateList";
import ResourcesPopularSkeleton from "@/components/Resources/ResourcesPopularSkeleton";
import ResourcesUpdatesSkeleton from "@/components/Resources/ResourcesUpdatesSkeleton";

// Force dynamic rendering to avoid build-time API calls to unavailable backend
export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Focura Resources – Guides, Tutorials & Insights",
  description:
    "Access Focura resources: tutorials, guides, blogs, and tips to maximize productivity and master workspace management.",
  keywords: [
    "focura resources",
    "focura guides",
    "focura tutorials",
    "productivity tips",
    "workspace management guide",
  ],
  openGraph: {
    title: "Focura Resources – Learn & Master Productivity",
    description:
      "Explore articles, tutorials, and guides to get the most out of Focura and boost your team's productivity.",
    url: "https://focura-client.vercel.app/resources",
    siteName: "Focura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focura Resources – Learn & Master Productivity",
    description:
      "Explore articles, tutorials, and guides to get the most out of Focura and boost your team's productivity.",
  },
  alternates: {
    canonical: "https://focura-client.vercel.app/resources",
  },
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  return (
    <div>
      <ResourcesHero />
      <Suspense fallback={<ResourcesPopularSkeleton />}>
        <ResourcePopularList searchParams={searchParams} />
      </Suspense>
      <ResourcesFeaturedGuides />
      <ResourcesCategories />
      <Suspense fallback={<ResourcesUpdatesSkeleton />}>
        <ResourceUpdateList searchParams={searchParams} />
      </Suspense>
      <ResourcesCTA />
    </div>
  );
}

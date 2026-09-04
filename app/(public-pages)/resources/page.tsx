import { Suspense } from "react";
import ResourcePopularList from "@/components/public/resources/ResourcePopularList";
import ResourcesCategories from "@/components/public/resources/ResourcesCategories";
import ResourcesCTA from "@/components/public/resources/ResourcesCTA";
import ResourcesFeaturedGuides from "@/components/public/resources/ResourcesFeaturedGuides";
import ResourcesHero from "@/components/public/resources/ResourcesHero";
import ResourceUpdateList from "@/components/public/resources/ResourceUpdateList";
import ResourcesPopularSkeleton from "@/components/public/resources/ResourcesPopularSkeleton";
import ResourcesUpdatesSkeleton from "@/components/public/resources/ResourcesUpdatesSkeleton";

// Force dynamic rendering to avoid build-time API calls to unavailable backend
export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gablura Resources – Guides, Tutorials & Insights",
  description:
    "Access Gablura resources: tutorials, guides, blogs, and tips to maximize productivity and master workspace management.",
  keywords: [
    "gablura resources",
    "gablura guides",
    "gablura tutorials",
    "productivity tips",
    "workspace management guide",
  ],
  openGraph: {
    title: "Gablura Resources – Learn & Master Productivity",
    description:
      "Explore articles, tutorials, and guides to get the most out of Gablura and boost your team's productivity.",
    url: "https://gablura.vercel.app/resources",
    siteName: "Gablura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gablura Resources – Learn & Master Productivity",
    description:
      "Explore articles, tutorials, and guides to get the most out of Gablura and boost your team's productivity.",
  },
  alternates: {
    canonical: "https://gablura.vercel.app/resources",
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

import ResourcesCategories from '@/components/Resources/ResourcesCategories'
import ResourcesCTA from '@/components/Resources/ResourcesCTA'
import ResourcesFeaturedGuides from '@/components/Resources/ResourcesFeaturedGuides'
import ResourcesHero from '@/components/Resources/ResourcesHero'
import ResourcesPopular from '@/components/Resources/ResourcesPopular'
import ResourcesUpdates from '@/components/Resources/ResourcesUpdates'
import React from 'react'

export const metadata = {
  title: "Focura Resources – Guides, Tutorials & Insights",
  description:
    "Access Focura resources: tutorials, guides, blogs, and tips to maximize productivity and master workspace management.",
  openGraph: {
    title: "Focura Resources – Learn & Master Productivity",
    description:
      "Explore articles, tutorials, and guides to get the most out of Focura and boost your team's productivity.",
    url: "https://focura.app/resources",
    siteName: "Focura",
    images: [
      {
        url: "/og-resources.png",
        width: 1200,
        height: 630,
        alt: "Focura resources and guides",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focura Resources – Learn & Master Productivity",
    description:
      "Explore articles, tutorials, and guides to get the most out of Focura and boost your team's productivity.",
    images: ["/og-resources.png"],
  },
};


export default function ResourcesPage() {
  return (
    <div>
        <ResourcesHero />
        <ResourcesPopular />
        <ResourcesFeaturedGuides />
        <ResourcesCategories />
        <ResourcesUpdates />
        <ResourcesCTA />
    </div>
  )
}

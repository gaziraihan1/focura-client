import FeatureComparison from '@/components/Features/FeatureComparision'
import FeatureFinalCTA from '@/components/Features/FeatureFinalCTA'
import FeaturesHero from '@/components/Features/FeatureHero'
import FeaturesDetails from '@/components/Features/FeaturesDetails'
import FeaturesHighlights from '@/components/Features/FeaturesHighlights'
import InteractiveDemo from '@/components/Features/InteractiveDemo'
import Metrics from '@/components/Features/Metrics'
import UseCases from '@/components/Features/UseCases'
import WhyChooseFocura from '@/components/Features/WhyChooseFocura'
import { Metadata } from 'next'
import React from 'react'

export const metadata:Metadata = {
  title: "Focura Features – Smart Task & Workspace Management",
  description:
    "Discover Focura’s powerful features: manage tasks, collaborate with teams, track projects, and boost productivity with ease.",
  openGraph: {
    title: "Focura Features – Work Smarter, Not Harder",
    description:
      "Explore all features of Focura: workspace management, task tracking, team collaboration, and productivity insights.",
    url: "https://focura.app/features",
    siteName: "Focura",
    images: [
      {
        url: "/og-features.png",
        width: 1200,
        height: 630,
        alt: "Focura features overview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focura Features – Work Smarter, Not Harder",
    description:
      "Explore all features of Focura: workspace management, task tracking, team collaboration, and productivity insights.",
    images: ["/og-features.png"],
  },
};


export default function page() {
  return (
    <div>
        <FeaturesHero />
        <FeaturesHighlights />
        <FeaturesDetails />
        <FeatureComparison />
        <WhyChooseFocura />
        <InteractiveDemo />
        <UseCases />
        <Metrics />
        <FeatureFinalCTA />
    </div>
  )
}

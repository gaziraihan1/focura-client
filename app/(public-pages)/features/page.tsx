import FeatureComparison from '@/components/public/features/FeatureComparision'
import FeatureFinalCTA from '@/components/public/features/FeatureFinalCTA'
import FeaturesHero from '@/components/public/features/FeatureHero'
import FeaturesDetails from '@/components/public/features/FeaturesDetails'
import FeaturesHighlights from '@/components/public/features/FeaturesHighlights'
import InteractiveDemo from '@/components/public/features/InteractiveDemo'
import Metrics from '@/components/public/features/Metrics'
import UseCases from '@/components/public/features/UseCases'
import WhyChooseFocura from '@/components/public/features/WhyChooseFocura'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Focura Features – Smart Task & Workspace Management",
  description:
    "Discover Focura's powerful features: manage tasks, collaborate with teams, track projects, and boost productivity with ease.",
  keywords: [
    "focura features",
    "task management",
    "workspace management",
    "team collaboration",
    "project tracking",
    "productivity insights",
  ],
  openGraph: {
    title: "Focura Features – Work Smarter, Not Harder",
    description:
      "Explore all features of Focura: workspace management, task tracking, team collaboration, and productivity insights.",
    url: "https://focura-client.vercel.app/features",
    siteName: "Focura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focura Features – Work Smarter, Not Harder",
    description:
      "Explore all features of Focura: workspace management, task tracking, team collaboration, and productivity insights.",
  },
  alternates: {
    canonical: "https://focura-client.vercel.app/features",
  },
};


export default function FeaturesPage() {
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

import FeatureComparison from '@/components/Features/FeatureComparision'
import FeatureFinalCTA from '@/components/Features/FeatureFinalCTA'
import FeaturesHero from '@/components/Features/FeatureHero'
import FeaturesDetails from '@/components/Features/FeaturesDetails'
import FeaturesHighlights from '@/components/Features/FeaturesHighlights'
import InteractiveDemo from '@/components/Features/InteractiveDemo'
import Metrics from '@/components/Features/Metrics'
import UseCases from '@/components/Features/UseCases'
import WhyChooseFocura from '@/components/Features/WhyChooseFocura'
import React from 'react'

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

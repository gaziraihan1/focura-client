import ResourcesCategories from '@/components/Resources/ResourcesCategories'
import ResourcesCTA from '@/components/Resources/ResourcesCTA'
import ResourcesFeaturedGuides from '@/components/Resources/ResourcesFeaturedGuides'
import ResourcesHero from '@/components/Resources/ResourcesHero'
import ResourcesPopular from '@/components/Resources/ResourcesPopular'
import ResourcesUpdates from '@/components/Resources/ResourcesUpdates'
import React from 'react'

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

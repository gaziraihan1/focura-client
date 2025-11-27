import FinalSolutionsCTA from '@/components/Solutions/FinalSolutionsCTA'
import SolutionsFeatureShowcase from '@/components/Solutions/SolutionsFeatureShowcase'
import SolutionsHero from '@/components/Solutions/SolutionsHero'
import SolutionsMetrics from '@/components/Solutions/SolutionsMetrics'
import SolutionProblems from '@/components/Solutions/SolutionsProblem'
import SolutionUseCases from '@/components/Solutions/SolutionsUseCases'
import React from 'react'

export default function Solutions() {
  return (
    <div>
        <SolutionsHero />
        <SolutionProblems />
        <SolutionUseCases />
        <SolutionsFeatureShowcase />
        <SolutionsMetrics />
        <FinalSolutionsCTA />
    </div>
  )
}

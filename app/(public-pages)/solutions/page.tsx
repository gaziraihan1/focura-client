import FinalSolutionsCTA from '@/components/Solutions/FinalSolutionsCTA'
import SolutionsFeatureShowcase from '@/components/Solutions/SolutionsFeatureShowcase'
import SolutionsHero from '@/components/Solutions/SolutionsHero'
import SolutionsMetrics from '@/components/Solutions/SolutionsMetrics'
import SolutionProblems from '@/components/Solutions/SolutionsProblem'
import SolutionUseCases from '@/components/Solutions/SolutionsUseCases'
import React from 'react'

export const metadata = {
  title: "Focura Solutions – Tailored Productivity for Every Team",
  description:
    "Focura provides solutions for startups, small teams, and enterprises. Streamline workflows, collaborate effectively, and increase productivity.",
  openGraph: {
    title: "Focura Solutions – Productivity for Every Team",
    description:
      "See how Focura’s tailored solutions help teams of all sizes manage workspaces, tasks, and projects efficiently.",
    url: "https://focura.app/solutions",
    siteName: "Focura",
    images: [
      {
        url: "/og-solutions.png",
        width: 1200,
        height: 630,
        alt: "Focura solutions for teams",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focura Solutions – Productivity for Every Team",
    description:
      "See how Focura’s tailored solutions help teams of all sizes manage workspaces, tasks, and projects efficiently.",
    images: ["/og-solutions.png"],
  },
};


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

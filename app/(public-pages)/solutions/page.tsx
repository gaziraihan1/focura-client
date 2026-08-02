import FinalSolutionsCTA from '@/components/Solutions/FinalSolutionsCTA'
import SolutionsFeatureShowcase from '@/components/Solutions/SolutionsFeatureShowcase'
import SolutionsHero from '@/components/Solutions/SolutionsHero'
import SolutionsMetrics from '@/components/Solutions/SolutionsMetrics'
import SolutionProblems from '@/components/Solutions/SolutionsProblem'
import SolutionUseCases from '@/components/Solutions/SolutionsUseCases'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Focura Solutions – Tailored Productivity for Every Team",
  description:
    "Focura provides solutions for startups, small teams, and enterprises. Streamline workflows, collaborate effectively, and increase productivity.",
  keywords: [
    "focura solutions",
    "team productivity",
    "startup workspace",
    "enterprise project management",
    "workflow automation",
  ],
  openGraph: {
    title: "Focura Solutions – Productivity for Every Team",
    description:
      "See how Focura's tailored solutions help teams of all sizes manage workspaces, tasks, and projects efficiently.",
    url: "https://focura-client.vercel.app/solutions",
    siteName: "Focura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focura Solutions – Productivity for Every Team",
    description:
      "See how Focura's tailored solutions help teams of all sizes manage workspaces, tasks, and projects efficiently.",
  },
  alternates: {
    canonical: "https://focura-client.vercel.app/solutions",
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

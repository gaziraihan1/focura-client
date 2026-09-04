import FinalSolutionsCTA from '@/components/public/solutions/FinalSolutionsCTA'
import SolutionsFeatureShowcase from '@/components/public/solutions/SolutionsFeatureShowcase'
import SolutionsHero from '@/components/public/solutions/SolutionsHero'
import SolutionsMetrics from '@/components/public/solutions/SolutionsMetrics'
import SolutionProblems from '@/components/public/solutions/SolutionsProblem'
import SolutionUseCases from '@/components/public/solutions/SolutionsUseCases'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gablura Solutions – Tailored Productivity for Every Team",
  description:
    "Gablura provides solutions for startups, small teams, and enterprises. Streamline workflows, collaborate effectively, and increase productivity.",
  keywords: [
    "gablura solutions",
    "team productivity",
    "startup workspace",
    "enterprise project management",
    "workflow automation",
  ],
  openGraph: {
    title: "Gablura Solutions – Productivity for Every Team",
    description:
      "See how Gablura's tailored solutions help teams of all sizes manage workspaces, tasks, and projects efficiently.",
    url: "https://gablura.vercel.app/solutions",
    siteName: "Gablura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gablura Solutions – Productivity for Every Team",
    description:
      "See how Gablura's tailored solutions help teams of all sizes manage workspaces, tasks, and projects efficiently.",
  },
  alternates: {
    canonical: "https://gablura.vercel.app/solutions",
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

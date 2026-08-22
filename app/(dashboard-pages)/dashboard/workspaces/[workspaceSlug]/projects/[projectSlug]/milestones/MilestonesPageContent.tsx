"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import MilestoneList from "@/components/Dashboard/ProjectDetails/MilestoneList";
import { ProjectManagerOnly } from "@/components/Dashboard/ProjectDetails/ProjectManagerOnly";
import { useProjectDetailsBySlug } from "@/hooks/useProjects";

interface MilestonesPageContentProps {
  projectSlug: string;
}

export function MilestonesPageContent({ projectSlug }: MilestonesPageContentProps) {
  const router = useRouter();
  const { data: project } = useProjectDetailsBySlug(projectSlug);

  return (
    <ProjectManagerOnly project={project}>
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Milestones</h1>
          <p className="text-xs text-muted-foreground mt-1">Track key project milestones with health status and progress.</p>
        </div>
        {project?.id && <MilestoneList projectId={project.id} />}
      </div>
    </ProjectManagerOnly>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SprintList from "@/components/dashboard/projects/project-details/SprintList";
import { ProjectManagerOnly } from "@/components/dashboard/projects/project-details/ProjectManagerOnly";
import { useProjectDetailsBySlug } from "@/hooks/useProjects";

interface SprintsPageContentProps {
  projectSlug: string;
}

export function SprintsPageContent({ projectSlug }: SprintsPageContentProps) {
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
          <h1 className="text-xl font-bold text-foreground">Sprints</h1>
          <p className="text-xs text-muted-foreground mt-1">Plan and track time-boxed iterations with velocity tracking.</p>
        </div>
        {project?.id && <SprintList projectId={project.id} />}
      </div>
    </ProjectManagerOnly>
  );
}

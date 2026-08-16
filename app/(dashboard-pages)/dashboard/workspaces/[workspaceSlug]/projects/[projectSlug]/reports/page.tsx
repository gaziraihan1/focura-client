"use client";

import { useParams } from "next/navigation";
import { useWorkspacePlan } from "@/context/workspacePlan/WorkspacePlanContext";
import { useProjectDetailsBySlug } from "@/hooks/useProjects";
import { ProjectManagerOnly } from "@/components/Dashboard/ProjectDetails/ProjectManagerOnly";
import { ProjectTimeReport } from "@/components/Dashboard/Workspaces/project/Reports/ProjectTimeReport";
import { UpgradePlanCard } from "@/components/Shared/UpgradePlanCard";

export default function ProjectTimeReportPageWrapper() {
  const params = useParams();
  const projectSlug = params?.projectSlug as string;

  const { isFree, isLoading: planLoading } = useWorkspacePlan();
  const { data: project, isLoading: projectLoading } = useProjectDetailsBySlug(projectSlug);

  if (planLoading || projectLoading) return null;

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-1">Project not found</h2>
          <p className="text-sm text-muted-foreground">This project does not exist or you don&apos;t have access.</p>
        </div>
      </div>
    );
  }

  return (
    <ProjectManagerOnly project={project}>
      {isFree ? (
        <UpgradePlanCard
          feature="Project Time Reports"
          description="See exactly how your team's time is spent across tasks, members, and categories."
        />
      ) : (
        <ProjectTimeReport
          workspaceId={project.workspaceId}
          projectId={project.id}
          projectName={project.name}
        />
      )}
    </ProjectManagerOnly>
  );
}

"use client";

import { useWorkspacePlan } from "@/context/workspacePlan/WorkspacePlanContext";
import { useProjectDetailsBySlug } from "@/hooks/useProjects";
import { ProjectManagerOnly } from "@/components/Dashboard/ProjectDetails/ProjectManagerOnly";
import { ProjectAnalyticsPage } from "@/components/Dashboard/Workspaces/project/Analytics/ProjectAnalyticsPage";
import { UpgradePlanCard } from "@/components/Shared/UpgradePlanCard";

interface AnalyticsPageContentProps {
  projectSlug: string;
}

export function AnalyticsPageContent({ projectSlug }: AnalyticsPageContentProps) {
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
          feature="Project Analytics"
          description="Get deep insights into your project's progress, team performance, and deadline risks."
        />
      ) : (
        <ProjectAnalyticsPage
          workspaceId={project.workspaceId}
          projectId={project.id}
          projectName={project.name}
          projectColor={project.color}
        />
      )}
    </ProjectManagerOnly>
  );
}

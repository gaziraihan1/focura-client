"use client";

import { ProjectsEmptyState } from "@/components/Dashboard/Projects/WorkspaceProjects/ProjectsEmptyState";
import { ProjectsSearchBar } from "@/components/Dashboard/Projects/WorkspaceProjects/ProjectsSearchBar";
import { WorkspaceProjectCard } from "@/components/Dashboard/Projects/WorkspaceProjects/WorkspaceProjectCard";
import { WorkspaceProjectsErrorState } from "@/components/Dashboard/Projects/WorkspaceProjects/WorkspaceProjectsErrorState";
import { WorkspaceProjectsPageHeader } from "@/components/Dashboard/Projects/WorkspaceProjects/WorkspaceProjectsPageHeader";
import { useProjects } from "@/hooks/useProjects";
import { useWorkspaceProjectsPage } from "@/hooks/useProjectsPage";
import { useParams } from "next/navigation";
import { LoadingState } from "@/components/Shared/LoadingState";

export default function WorkspaceProjectsPage() {
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;

  const {
    workspace,
    searchQuery,
    setSearchQuery,
    canCreateProjects,
    isLoading,
    hasError,
    currentUserId,
  } = useWorkspaceProjectsPage({ workspaceSlug });

  const {data: projects, isLoading: projectLoading} = useProjects(workspace?.id)

  if (isLoading || projectLoading) {
    return <LoadingState />;
  }

  if (hasError) {
    return <WorkspaceProjectsErrorState />;
  }

  return (
    <div className="space-y-6">
      <WorkspaceProjectsPageHeader
        workspaceName={workspace!.name}
        workspaceSlug={workspaceSlug}
        canCreateProjects={canCreateProjects}
      />

      <ProjectsSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {projects?.length === 0 ? (
        <ProjectsEmptyState
          hasSearchQuery={!!searchQuery}
          workspaceSlug={workspaceSlug}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects?.map((project) => (
            <WorkspaceProjectCard
              key={project.id}
              projectId={project.id}
              workspaceSlug={workspaceSlug}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
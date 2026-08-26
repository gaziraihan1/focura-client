"use client";

import { useRouter } from "next/navigation";
import { ProjectsEmptyState } from "@/components/dashboard/projects/all-projects/ProjectsEmptyState";
import { ProjectsSearchBar } from "@/components/dashboard/projects/all-projects/WorkspaceProjects/ProjectsSearchBar";
import { WorkspaceProjectCard } from "@/components/dashboard/projects/all-projects/WorkspaceProjects/WorkspaceProjectCard";
import { WorkspaceProjectsErrorState } from "@/components/dashboard/projects/all-projects/WorkspaceProjects/WorkspaceProjectsErrorState";
import { WorkspaceProjectsPageHeader } from "@/components/dashboard/projects/all-projects/WorkspaceProjects/WorkspaceProjectsPageHeader";
import { useWorkspaceProjectsPage } from "@/hooks/useProjectsPage";
import { LoadingState } from "@/components/shared/LoadingState";

interface ProjectsPageContentProps {
  workspaceSlug: string;
}

export function ProjectsPageContent({ workspaceSlug }: ProjectsPageContentProps) {
  const router = useRouter();
  const {
    workspace,
    projects,
    searchQuery,
    setSearchQuery,
    canCreateProjects,
    isLoading,
    hasError,
    currentUserId,
  } = useWorkspaceProjectsPage({ workspaceSlug });

  if (isLoading) {
    return <LoadingState />;
  }

  if (hasError) {
    return <WorkspaceProjectsErrorState />;
  }

  return (
    <div className="space-y-6 px-2 sm:px-4 2xl:max-w-7xl mx-auto">
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
          variant="panel"
          action={
            !searchQuery && canCreateProjects
              ? {
                  label: "Create Project",
                  onClick: () =>
                    router.push(
                      `/dashboard/workspaces/${workspaceSlug}/projects/new-project`
                    ),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {projects?.map((project) => (
            <WorkspaceProjectCard
              key={project.id}
              project={project}
              workspaceSlug={workspaceSlug}
              currentUserId={currentUserId}
              canCreateProjects={canCreateProjects}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { FolderKanban } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyState as SharedEmptyState } from "@/components/Shared/EmptyState";

interface ProjectsEmptyStateProps {
  hasSearchQuery: boolean;
  workspaceSlug: string;
  canCreateProjects: boolean;
}

export function ProjectsEmptyState({
  hasSearchQuery,
  workspaceSlug,
  canCreateProjects,
}: ProjectsEmptyStateProps) {
  const router = useRouter();

  return (
    <div className="text-center py-12 rounded-xl bg-card border border-border">
      <SharedEmptyState
        icon={FolderKanban}
        title={
          hasSearchQuery ? "No projects match your search" : "No projects yet"
        }
        description={
          hasSearchQuery
            ? "Try a different search"
            : "Create your first project to get started"
        }
        action={
          !hasSearchQuery && canCreateProjects
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
    </div>
  );
}

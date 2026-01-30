import { FolderKanban } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectsEmptyStateProps {
  hasSearchQuery: boolean;
  workspaceSlug: string;
}

export function ProjectsEmptyState({
  hasSearchQuery,
  workspaceSlug,
}: ProjectsEmptyStateProps) {
  const router = useRouter();

  return (
    <div className="text-center py-12 rounded-xl bg-card border border-border">
      <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {hasSearchQuery ? "No projects match your search" : "No projects yet"}
      </h3>
      <p className="text-muted-foreground mb-6">
        {hasSearchQuery
          ? "Try a different search"
          : "Create your first project to get started"}
      </p>
      {!hasSearchQuery && (
        <button
          onClick={() =>
            router.push(
              `/dashboard/workspaces/${workspaceSlug}/projects/new-project`
            )
          }
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Create Project
        </button>
      )}
    </div>
  );
}
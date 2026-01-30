import { FolderKanban, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/Dashboard/Workspaces/WorkspacePage/ProjectCard";

interface WorkspaceProjectsTabProps {
  workspaceId: string;
  workspaceSlug: string | undefined;
  canCreateProjects: boolean;
}

export function WorkspaceProjectsTab({
  workspaceId,
  workspaceSlug,
  canCreateProjects,
}: WorkspaceProjectsTabProps) {
  const router = useRouter();
  const { data: projects = [], isLoading } = useProjects(workspaceId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 rounded-lg sm:rounded-xl bg-card border border-border">
        <FolderKanban className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
          No projects yet
        </h3>
        {canCreateProjects && (
          <>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">
              Create your first project to get started
            </p>
            <button
              onClick={() =>
                router.push(`/dashboard/workspaces/${workspaceSlug}/projects/new-project`)
              }
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition text-sm sm:text-base"
            >
              Create Project
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with create button */}
      {canCreateProjects && (
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Projects ({projects.length})
          </h3>
          <button
            onClick={() =>
              router.push(`/dashboard/workspaces/${workspaceSlug}/projects/new-project`)
            }
            className="px-3 sm:px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            workspaceSlug={workspaceSlug}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
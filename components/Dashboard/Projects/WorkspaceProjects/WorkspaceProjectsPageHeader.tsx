import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkspaceProjectsPageHeaderProps {
  workspaceName: string;
  workspaceSlug: string;
  canCreateProjects: boolean;
}

export function WorkspaceProjectsPageHeader({
  workspaceName,
  workspaceSlug,
  canCreateProjects,
}: WorkspaceProjectsPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Projects
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse projects in {workspaceName}
        </p>
      </div>
      {canCreateProjects && (
        <button
          onClick={() =>
            router.push(
              `/dashboard/workspaces/${workspaceSlug}/projects/new-project`
            )
          }
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
        >
          <Plus size={18} />
          New Project
        </button>
      )}
    </div>
  );
}
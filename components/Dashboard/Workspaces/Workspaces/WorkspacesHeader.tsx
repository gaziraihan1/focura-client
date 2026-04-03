import { Plus } from "lucide-react";

interface WorkspacesHeaderProps {
  onCreate: () => void;
}

export function WorkspacesHeader({ onCreate }: WorkspacesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-3xl font-bold">Workspaces</h1>
        <p className="text-muted-foreground mt-1">
          Manage and switch between your workspaces
        </p>
      </div>

      <button
        onClick={onCreate}
        className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg bg-primary text-primary-foreground flex items-center gap-2"
      >
        <Plus size={18} />
        Create Workspace
      </button>
    </div>
  );
}

import { Plus } from "lucide-react";

interface WorkspacesHeaderProps {
  onCreate: () => void;
}

export function WorkspacesHeader({ onCreate }: WorkspacesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Workspaces</h1>
        <p className="text-muted-foreground mt-1">
          Manage and switch between your workspaces
        </p>
      </div>

      <button
        onClick={onCreate}
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground flex items-center gap-2"
      >
        <Plus size={18} />
        Create Workspace
      </button>
    </div>
  );
}

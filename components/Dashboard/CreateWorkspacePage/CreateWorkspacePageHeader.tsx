import { X } from "lucide-react";

interface CreateWorkspacePageHeaderProps {
  onCancel: () => void;
}

export function CreateWorkspacePageHeader({
  onCancel,
}: CreateWorkspacePageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Create Workspace
        </h1>
        <p className="text-muted-foreground mt-1">
          Set up a new workspace for your team
        </p>
      </div>
      <button
        onClick={onCancel}
        className="p-2 rounded-lg hover:bg-accent transition"
      >
        <X size={24} className="text-foreground" />
      </button>
    </div>
  );
}
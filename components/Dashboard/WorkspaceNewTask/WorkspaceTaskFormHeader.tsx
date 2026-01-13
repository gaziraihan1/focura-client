import { ArrowLeft, X } from "lucide-react";

interface WorkspaceTaskFormHeaderProps {
  workspaceName: string;
  onCancel: () => void;
}

export function WorkspaceTaskFormHeader({
  workspaceName,
  onCancel,
}: WorkspaceTaskFormHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-accent transition"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Task</h1>
          <p className="text-muted-foreground mt-1">
            Add a task to {workspaceName}
          </p>
        </div>
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
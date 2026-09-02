import { Button } from "@/components/ui/Button";
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
        <Button aria-label="Previous page" variant="ghost"
          onClick={onCancel}
          className="p-2 rounded-lg transition"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Task</h1>
          <p className="text-muted-foreground mt-1">
            Add a task to {workspaceName}
          </p>
        </div>
      </div>
      <Button aria-label="Close" variant="ghost"
        onClick={onCancel}
        className="p-2 rounded-lg transition"
      >
        <X size={24} className="text-foreground" />
      </Button>
    </div>
  );
}
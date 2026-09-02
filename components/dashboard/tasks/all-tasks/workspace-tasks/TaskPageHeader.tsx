import { Button } from "@/components/ui/Button";
import { WorkspaceRole } from "@/hooks/useWorkspace";
import { Plus } from "lucide-react";

interface TasksPageHeaderProps {
  workspaceName: string;
  onCreateTask: () => void;
  memberRole: WorkspaceRole | null;
}

export function TasksPageHeader({
  workspaceName,
  onCreateTask,
  memberRole,
}: TasksPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Tasks</h1>
        <p className="text-muted-foreground mt-1">
          Manage tasks across all projects in {workspaceName}
        </p>
      </div>
      {
        memberRole !== "GUEST" && (
          <Button
            onClick={onCreateTask}
            className="px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2"
          >
            <Plus size={18} />
            New Task
          </Button>
        )
      }
      
    </div>
  );
}
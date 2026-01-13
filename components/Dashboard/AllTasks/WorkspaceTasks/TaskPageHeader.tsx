import { Plus } from "lucide-react";

interface TasksPageHeaderProps {
  workspaceName: string;
  onCreateTask: () => void;
}

export function TasksPageHeader({
  workspaceName,
  onCreateTask,
}: TasksPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Tasks</h1>
        <p className="text-muted-foreground mt-1">
          Manage tasks across all projects in {workspaceName}
        </p>
      </div>
      <button
        onClick={onCreateTask}
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
      >
        <Plus size={18} />
        New Task
      </button>
    </div>
  );
}
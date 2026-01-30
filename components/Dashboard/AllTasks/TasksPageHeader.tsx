import { Plus } from "lucide-react";

interface TasksPageHeaderProps {
  onCreateTask: () => void;
}

export function TasksPageHeader({ onCreateTask }: TasksPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
        <p className="text-muted-foreground mt-1">
          Manage your tasks and stay productive
        </p>
      </div>
      <button
        onClick={onCreateTask}
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
      >
        <Plus size={18} />
        Add Task
      </button>
    </div>
  );
}
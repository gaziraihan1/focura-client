import { Plus } from "lucide-react";

interface TasksPageHeaderProps {
  onCreateTask: () => void;
}

export function TasksPageHeader({ onCreateTask }: TasksPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-foreground">Tasks</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your tasks and stay productive
        </p>
      </div>
      <button
        onClick={onCreateTask}
        className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
      >
        <Plus size={14} className="sm:h-4.5 sm:w-4.5"/>
        Add Task
      </button>
    </div>
  );
}
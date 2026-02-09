import { Loader2, AlertCircle } from "lucide-react";
import { Task } from "@/hooks/useTask";
import { EmptyState } from "@/components/Dashboard/AllTasks/WorkspaceTasks/EmptyState";
import { TaskList } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskList";

interface TasksContentAreaProps {
  tasks: Task[];
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  activeFiltersCount: number;
  workspaceSlug: string;
  onCreateTask: () => void;
  onAddToPrimary?: (taskId: string) => void;
  onAddToSecondary?: (taskId: string) => void;
  isPrimaryDisabled?: boolean;
}

export function TasksContentArea({
  tasks,
  isLoading,
  isError,
  searchQuery,
  activeFiltersCount,
  workspaceSlug,
  onCreateTask,
  onAddToPrimary,
  onAddToSecondary,
  isPrimaryDisabled = false,
}: TasksContentAreaProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 rounded-xl bg-card border border-border">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">Failed to load tasks</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        hasFilters={searchQuery !== "" || activeFiltersCount > 0}
        searchQuery={searchQuery}
        onCreateTask={onCreateTask}
      />
    );
  }

  return (
    <TaskList
      tasks={tasks}
      workspaceSlug={workspaceSlug}
      onAddToPrimary={onAddToPrimary}
      onAddToSecondary={onAddToSecondary}
      isPrimaryDisabled={isPrimaryDisabled}
      showAddButtons={true}
    />
  );
}
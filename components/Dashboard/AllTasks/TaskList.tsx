// components/Dashboard/AllTasks/TaskList.tsx
import { Loader2, AlertCircle } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { FocusTaskCard } from "./FocusTaskCard";
import { Task } from "@/hooks/useTask";

interface TaskListProps {
  tasks: Task[];
  focusedTaskId?: string | null;
  focusTimeRemaining?: number;
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  onCreateTask: () => void;
}

export function TaskList({
  tasks,
  focusedTaskId,
  focusTimeRemaining = 0,
  isLoading,
  isError,
  searchQuery,
  onCreateTask,
}: TaskListProps) {
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
        <p className="text-muted-foreground">Failed to load tasks</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl bg-card border border-border">
        <p className="text-muted-foreground">
          {searchQuery ? "No tasks match your search" : "No tasks found"}
        </p>
        {!searchQuery && (
          <button
            onClick={onCreateTask}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Create Your First Task
          </button>
        )}
      </div>
    );
  }

  const focusedTask = focusedTaskId ? tasks.find(t => t.id === focusedTaskId) : null;
  const otherTasks = focusedTaskId ? tasks.filter(t => t.id !== focusedTaskId) : tasks;

  return (
    <div className="space-y-3">
      {/* Focused Task - Always shown first */}
      {focusedTask && (
        <FocusTaskCard 
          task={focusedTask} 
          timeRemaining={focusTimeRemaining}
        />
      )}

      {/* Regular Tasks */}
      {otherTasks.map((task: Task, index: number) => (
        <TaskCard key={task.id} task={task} index={index} />
      ))}
    </div>
  );
}
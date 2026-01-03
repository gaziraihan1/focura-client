// import { TeamTask } from types/task.types";
// import { Task } from "@/types/task.types";
import { Task } from "@/hooks/useTask";
import { TaskCardTeam } from "./TaskCardTeam";

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
}

export function TaskList({ tasks, isLoading }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-lg bg-muted/40 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No tasks match the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCardTeam key={task.id} task={task} />
      ))}
    </div>
  );
}

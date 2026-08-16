import { Task } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";


interface TaskSectionProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  variant: 'destructive' | 'primary' | 'default' | 'muted';
}

const STATUS_DOT: Record<string, string> = {
  COMPLETED: "bg-green-500",
  IN_PROGRESS: "bg-blue-500",
  IN_REVIEW: "bg-purple-500",
  BLOCKED: "bg-red-500",
  CANCELLED: "bg-gray-400",
  TODO: "bg-gray-300",
};

export default function TaskSection({ title, icon, count, tasks, onTaskClick, variant }: TaskSectionProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return 'text-destructive';
      case 'primary':
        return 'text-primary';
      case 'default':
        return 'text-foreground';
      case 'muted':
        return 'text-muted-foreground';
    }
  };

  return (
    <div>
      <div className={cn('flex items-center gap-2 mb-3', getVariantStyles())}>
        {icon}
        <h3 className="text-sm font-semibold">
          {title} <span className="text-muted-foreground">({count})</span>
        </h3>
      </div>
      <div className="space-y-2">
        {tasks.slice(0, 5).map((task) => {
          const dueLabel = task.dueDate
            ? new Date(task.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            : null;
          const isTaskOverdue =
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            task.status !== "COMPLETED";

          return (
            <button
              key={task.id}
              onClick={() => onTaskClick(task)}
              className="w-full text-left p-3 rounded-lg bg-muted hover:bg-accent transition-colors group"
            >
              <div className="flex items-start gap-2">
                {task.project && (
                  <div
                    className="w-1 h-full rounded-full mt-1"
                    style={{ backgroundColor: task.project.color }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground truncate group-hover:text-primary">
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      aria-hidden
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        STATUS_DOT[task.status] ?? "bg-gray-300"
                      )}
                    />
                    <span className="text-xs text-muted-foreground">
                      {task.priority}
                    </span>
                    {task.assignees.length > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {task.assignees.length}
                      </span>
                    )}
                    {dueLabel && (
                      <span
                        className={cn(
                          "text-xs",
                          isTaskOverdue ? "text-destructive font-medium" : "text-muted-foreground"
                        )}
                      >
                        {isTaskOverdue ? `Overdue · ${dueLabel}` : `Due ${dueLabel}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
        {tasks.length > 5 && (
          <div className="text-xs text-muted-foreground text-center py-2">
            +{tasks.length - 5} more
          </div>
        )}
      </div>
    </div>
  );
}

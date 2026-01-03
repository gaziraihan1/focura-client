import { Task } from "@/hooks/useTask";
import { Clock, MessageCircle, AlertTriangle } from "lucide-react";
import { getTaskTimeInfo } from "@/lib/task/time";

export function TaskCardTeam({ task }: { task: Task }) {
  const { isOverdue, hoursUntilDue } = getTaskTimeInfo(task);

  return (
    <div className="rounded-xl border bg-background p-4 hover:bg-muted/40 transition">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">{task.title}</h3>

          {task.project && (
            <p className="text-xs text-muted-foreground">
              {task.project.workspace.name} • {task.project.name}
            </p>
          )}
        </div>

        {isOverdue && (
          <AlertTriangle className="w-4 h-4 text-destructive" />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="capitalize">{task.status.toLowerCase()}</span>
          <span className="capitalize">{task.priority.toLowerCase()}</span>

          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {hoursUntilDue !== null ? `${hoursUntilDue}h` : "—"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <MessageCircle className="w-3 h-3" />
          {task._count.comments}
        </div>
      </div>
    </div>
  );
}

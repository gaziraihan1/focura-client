import { Task } from "@/hooks/useTask";
import { TaskCard } from "./TaskCard";
import { Sparkles, ListChecks } from "lucide-react";

interface PrimaryTasksViewProps {
  primaryTask: Task | null;
  secondaryTasks: Task[];
  workspaceSlug: string;
}

export function PrimaryTasksView({
  primaryTask,
  secondaryTasks,
  workspaceSlug,
}: PrimaryTasksViewProps) {
  const hasTasks = primaryTask || secondaryTasks.length > 0;

  if (!hasTasks) {
    return (
      <div className="text-center py-16 rounded-xl bg-card border border-border">
        <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Primary Tasks Yet
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Go to the &qout;All Tasks&qout; tab and click the purple + icon to set your primary task,
          or the amber + icon to add secondary tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primary Task Section */}
      {primaryTask && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles size={20} className="text-purple-500" />
              Primary Task
            </h2>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <TaskCard task={primaryTask} workspaceSlug={workspaceSlug} />
          </div>
        </div>
      )}

      {/* Divider */}
      {primaryTask && secondaryTasks.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-sm text-muted-foreground">
              Supporting Tasks
            </span>
          </div>
        </div>
      )}

      {/* Secondary Tasks Section */}
      {secondaryTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ListChecks size={20} className="text-amber-500" />
              Secondary Tasks ({secondaryTasks.length})
            </h2>
          </div>
          <div className="space-y-3 border-l-4 border-amber-500 pl-4">
            {secondaryTasks.map((task) => (
              <TaskCard key={task.id} task={task} workspaceSlug={workspaceSlug} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
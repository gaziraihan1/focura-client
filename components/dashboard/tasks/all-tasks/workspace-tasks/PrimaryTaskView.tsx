import { Task } from "@/hooks/useTask";
import { Sparkles, ListChecks } from "lucide-react";
import { useState } from "react";
import { RemovableTaskCard } from "./RemovalTaskCard";

interface PrimaryTasksViewProps {
  primaryTask: Task | null;
  secondaryTasks: Task[];
  workspaceSlug: string;
  onRemove: (taskId: string) => Promise<void>;
}

export function PrimaryTasksView({
  primaryTask,
  secondaryTasks,
  workspaceSlug,
  onRemove,
}: PrimaryTasksViewProps) {
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (taskId: string) => {
    setRemovingId(taskId);
    try {
      await onRemove(taskId);
    } finally {
      setRemovingId(null);
    }
  };

  const hasTasks = primaryTask || secondaryTasks.length > 0;

  if (!hasTasks) {
    return (
      <div className="text-center py-16 rounded-xl bg-card border border-border">
        <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Primary Tasks Yet
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Go to the &quot;All Tasks&quot; tab and click the purple + icon to set your
          primary task, or the amber + icon to add secondary tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {primaryTask && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-purple-500" />
            </span>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles size={20} className="text-purple-500" />
              Primary Task
            </h2>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <RemovableTaskCard
              task={primaryTask}
              workspaceSlug={workspaceSlug}
              isRemoving={removingId === primaryTask.id}
              onRemove={handleRemove}
              accentColor="purple"
            />
          </div>
        </div>
      )}

      {primaryTask && secondaryTasks.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-sm text-muted-foreground">
              Supporting Tasks
            </span>
          </div>
        </div>
      )}

      {secondaryTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ListChecks size={20} className="text-amber-500" />
              Secondary Tasks ({secondaryTasks.length})
            </h2>
          </div>
          <div className="space-y-3 border-l-4 border-amber-500 pl-4">
            {secondaryTasks.map((task) => (
              <RemovableTaskCard
                key={task.id}
                task={task}
                workspaceSlug={workspaceSlug}
                isRemoving={removingId === task.id}
                onRemove={handleRemove}
                accentColor="amber"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
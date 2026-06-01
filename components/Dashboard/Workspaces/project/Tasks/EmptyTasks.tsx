import { CheckCircle2, Plus } from "lucide-react";

export function EmptyTasks({ onAddTask, canCreate, isArchived }: { onAddTask: () => void; canCreate: boolean; isArchived: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted border border-border">
        <CheckCircle2 className="size-7 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">No tasks found</p>
        <p className="text-xs text-muted-foreground max-w-55">
          Adjust filters or create the first task for this project.
        </p>
      </div>
      {canCreate && !isArchived && (
        <button
          onClick={onAddTask}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Plus className="size-4" /> Create task
        </button>
      )}
    </div>
  );
}
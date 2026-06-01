import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function PageHeader({
  projectName,
  projectColor,
  workspaceName,
  totalCount,
  onAddTask,
  canCreate,
  isArchived
}: {
  projectName:   string;
  projectColor:  string;
  workspaceName?: string;
  totalCount:    number;
  onAddTask:     () => void;
  canCreate:     boolean;
  isArchived:    boolean
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: projectColor }} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-foreground truncate">{projectName}</h1>
              <span className="hidden sm:inline text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 shrink-0">
                {totalCount} task{totalCount !== 1 ? 's' : ''}
              </span>
            </div>
            {workspaceName && (
              <p className="text-xs text-muted-foreground truncate">{workspaceName} · Tasks</p>
            )}
          </div>
        </div>
      </div>

      {canCreate && !isArchived && (
        <button
          onClick={onAddTask}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shrink-0"
        >
          <Plus className="size-4" />
          New Task
        </button>
      )}
    </div>
  );
}
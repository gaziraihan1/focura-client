import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type AgingStatus = "normal" | "warning" | "critical";

interface KanbanCardMetadataProps {
  daysStale: number;
  agingStatus: AgingStatus;
  taskStatus: string;
  isBlocked: boolean;
  subtasksCount: number;
  subtaskProgress: number;
}

export function KanbanCardMetadata({
  daysStale,
  agingStatus,
  taskStatus,
  isBlocked,
  subtasksCount,
  subtaskProgress,
}: KanbanCardMetadataProps) {
  return (
    <div className="space-y-2 mb-3">
      {daysStale > 0 && (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] sm:text-xs font-medium",
            agingStatus === "critical" &&
              "bg-destructive/20 text-destructive",
            agingStatus === "warning" &&
              "bg-amber-500/20 text-amber-700 dark:text-amber-400",
            agingStatus === "normal" && "bg-muted text-muted-foreground"
          )}
        >
          <Clock className="w-3 h-3" />
          <span>
            {daysStale}d in {taskStatus.toLowerCase().replace("_", " ")}
          </span>
        </div>
      )}

      {isBlocked && (
        <div className="bg-destructive/20 border border-destructive/30 rounded px-2 py-1.5 text-xs text-destructive">
          <strong>Blocked:</strong> Waiting for review
        </div>
      )}

      {subtasksCount > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Subtasks</span>
            <span>{Math.round(subtaskProgress)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
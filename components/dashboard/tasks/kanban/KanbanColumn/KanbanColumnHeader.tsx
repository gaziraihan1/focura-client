import { ColumnConfig } from "@/hooks/useKanbanBoard";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface KanbanColumnHeaderProps {
  isOverLimit: boolean;
  isNearLimit: boolean;
  enforceWIP: boolean;
  stats: {
    count: number;
    isBottleneck: boolean;
    avgDays: number;
  };
  column: ColumnConfig;
  isBlocked: boolean;
  taskLength: number;
}

export default function KanbanColumnHeader({
  isOverLimit,
  column,
  enforceWIP,
  isNearLimit,
  stats,
  isBlocked,
  taskLength,
}: KanbanColumnHeaderProps) {
  const getHeaderColor = () => {
    if (isOverLimit) return "text-destructive";
    if (isNearLimit || stats.isBottleneck)
      return "text-amber-600 dark:text-amber-400";
    if (stats.count === 0) return "text-green-600 dark:text-green-400";
    return "text-foreground";
  };
  return (
    <div className="p-3 sm:p-4 border-b border-border bg-muted/50">
      <div className="flex items-center justify-between mb-2">
        <h3
          className={cn("font-semibold text-sm sm:text-base", getHeaderColor())}
        >
          {column.title}
        </h3>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs sm:text-sm font-bold",
              isOverLimit && "text-destructive",
              isNearLimit && !isOverLimit && "text-amber-600",
            )}
          >
            {stats.count}
            {enforceWIP && column.wipLimit < 999 && (
              <span className="text-muted-foreground font-normal">
                {" "}
                / {column.wipLimit}
              </span>
            )}
          </span>

          {(isOverLimit || stats.isBottleneck) && (
            <AlertTriangle
              className={cn(
                "w-4 h-4",
                isOverLimit ? "text-destructive" : "text-amber-500",
              )}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground">
        <span>
          Avg:{" "}
          <span className="font-medium text-foreground">
            {stats.avgDays.toFixed(1)}d
          </span>
        </span>

        {stats.isBottleneck && (
          <span className="text-amber-600 dark:text-amber-400 font-medium">
            ⚠️ Bottleneck
          </span>
        )}

        {isBlocked && taskLength === 0 && (
          <span className="text-green-600 dark:text-green-400 font-medium">
            ✓ Clear
          </span>
        )}
      </div>
    </div>
  );
}

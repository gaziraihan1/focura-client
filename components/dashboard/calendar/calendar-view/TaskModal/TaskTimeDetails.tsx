import { Clock, TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskTimeDetailsProps {
  startDate?: string | null;
  dueDate?: string | null;
  estimatedHours?: number | null;
  createdAt: string;
  isOverdue: boolean;
  updatedAt?: string | null;
  timeProgress?: number | null;
}

export function TaskTimeDetails({
  startDate,
  dueDate,
  estimatedHours,
  createdAt,
  isOverdue,
  updatedAt,
  timeProgress,
}: TaskTimeDetailsProps) {
  const progress = timeProgress && timeProgress > 0 ? Math.min(100, Math.round(timeProgress)) : null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Time Details</h3>
      </div>
      <div className="space-y-2 pl-6">
        {startDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Start Date:</span>
            <span className="font-medium text-foreground">
              {format(parseISO(startDate), "MMM d, yyyy")}
            </span>
          </div>
        )}
        {dueDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Due Date:</span>
            <span
              className={cn(
                "font-medium",
                isOverdue ? "text-destructive" : "text-foreground"
              )}
            >
              {format(parseISO(dueDate), "MMM d, yyyy")}
            </span>
          </div>
        )}
        {estimatedHours && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estimated Time:</span>
            <span className="font-medium text-foreground">
              {estimatedHours}h
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Created:</span>
          <span className="font-medium text-foreground">
            {format(parseISO(createdAt), "MMM d, yyyy")}
          </span>
        </div>
        {updatedAt && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Updated:</span>
            <span className="font-medium text-foreground">
              {format(parseISO(updatedAt), "MMM d, yyyy")}
            </span>
          </div>
        )}
      </div>

      {progress !== null && (
        <div className="pl-6 mt-3">
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {progress}% of estimate used
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

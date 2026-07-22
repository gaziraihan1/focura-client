import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useTaskDueDate,
  getUrgencyClasses,
  type DueDateInfo,
} from "@/hooks/useTaskDueDate";
import type { Task } from "@/hooks/useTask";

interface DueDateBadgeProps {
  task: Task;
  /** Show the badge even when there's no due date */
  showEmpty?: boolean;
  /** Size variant */
  size?: "sm" | "md";
  /** Additional class names */
  className?: string;
}

export function DueDateBadge({
  task,
  showEmpty = false,
  size = "sm",
  className,
}: DueDateBadgeProps) {
  const info = useTaskDueDate(task);

  if (!info.hasDueDate && !showEmpty) return null;

  const urgencyClasses = getUrgencyClasses(info.urgency);
  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-1.5 py-0.5 gap-1"
      : "text-xs px-2 py-1 gap-1.5";

  const Icon =
    info.urgency === "overdue"
      ? AlertTriangle
      : info.isCompleted
      ? CheckCircle2
      : Clock;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        urgencyClasses,
        sizeClasses,
        className
      )}
      title={
        info.dueDate
          ? `Due: ${info.dueDate.toLocaleDateString()} ${info.dueDate.toLocaleTimeString()}`
          : undefined
      }
    >
      <Icon className={cn(size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3")} />
      {info.timeRemaining}
    </span>
  );
}

/**
 * Standalone due date indicator for use in task lists/boards.
 * Shows a colored dot + text for quick scanning.
 */
export function DueDateIndicator({
  task,
  className,
}: {
  task: Task;
  className?: string;
}) {
  const info = useTaskDueDate(task);

  if (!info.hasDueDate) return null;

  const dotColor = {
    overdue: "bg-red-500",
    "due-today": "bg-orange-500",
    "due-soon": "bg-yellow-500",
    normal: "bg-muted-foreground/50",
  }[info.urgency];

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
      <span>{info.timeRemaining}</span>
    </div>
  );
}

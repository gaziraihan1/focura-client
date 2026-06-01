
import { Task } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import { memo } from "react";
type TaskPriority = Task['priority'];

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; dot: string; badge: string }> = {
  LOW:    { label: 'Low',    dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400' },
  MEDIUM: { label: 'Medium', dot: 'bg-blue-500',  badge: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'     },
  HIGH:   { label: 'High',   dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  URGENT: { label: 'Urgent', dot: 'bg-red-500',   badge: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'         },
};


export const PriorityBadge = memo(function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium', cfg.badge)}>
      <span className={cn('size-1.5 rounded-full shrink-0', cfg.dot)} />
      {cfg.label}
    </span>
  );
});
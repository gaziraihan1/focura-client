import { Task } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import {
  Clock,
  MessageSquare,
  ListTodo,
  Paperclip,
  Target,
  Flag,
  Zap,
  Flame,
  User,
  Users,
} from "lucide-react";

interface DetailedTaskCardProps {
  task: Task;
  onClick: () => void;
  variant: 'overdue' | 'urgent' | 'high' | 'medium' | 'low';
}

const PRIORITY_BADGE: Record<string, string> = {
  URGENT: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  HIGH: "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
  MEDIUM: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  LOW: "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400",
};

const ENERGY_BADGE: Record<string, string> = {
  HIGH: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  MEDIUM: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  LOW: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400",
};

export default function DetailedTaskCard({ task, onClick, variant }: DetailedTaskCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'overdue':
        return 'border-l-4 border-l-destructive bg-destructive/10 hover:bg-destructive/20';
      case 'urgent':
        return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30';
      case 'high':
        return 'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/30';
      case 'medium':
        return 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30';
      case 'low':
        return 'border-l-4 border-l-gray-400 bg-gray-50 dark:bg-gray-950/20 hover:bg-gray-100 dark:hover:bg-gray-950/30';
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'IN_REVIEW':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
    }
  };

  const timeProgress = task.timeTracking?.timeProgress ?? null;
  const dueLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-lg transition-all group',
        getVariantStyles()
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-base font-semibold text-foreground group-hover:text-primary flex-1">
          {task.title}
        </h4>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getStatusColor())}>
            {task.status.replace('_', ' ')}
          </span>
          <span
            className={cn(
              'text-xs px-2 py-1 rounded-full font-medium border',
              PRIORITY_BADGE[task.priority] ?? PRIORITY_BADGE.LOW
            )}
          >
            {task.priority}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Plan chips: milestone / sprint */}
      {(task.milestone || task.sprint) && (
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {task.milestone && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Target className="w-3 h-3" />
              {task.milestone.title}
            </span>
          )}
          {task.sprint && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Flag className="w-3 h-3" />
              {task.sprint.name}
            </span>
          )}
        </div>
      )}

      {/* Focus / energy badge */}
      {(task.energyType || task.focusRequired) && (
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {task.energyType && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border',
                ENERGY_BADGE[task.energyType] ?? ENERGY_BADGE.MEDIUM
              )}
            >
              <Zap className="w-3 h-3" />
              {task.energyType} energy
            </span>
          )}
          {task.focusRequired && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Flame className="w-3 h-3" />
              Focus required
            </span>
          )}
        </div>
      )}

      {/* Time progress */}
      {timeProgress !== null && timeProgress > 0 && (
        <div className="mb-3">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(100, timeProgress)}%` }}
            />
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {Math.min(100, Math.round(timeProgress))}% of estimate used
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        {task.estimatedHours && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{task.estimatedHours}h</span>
          </div>
        )}

        {dueLabel && (
          <div
            className={cn(
              "flex items-center gap-1.5 text-sm",
              variant === "overdue" ? "text-destructive font-medium" : "text-muted-foreground"
            )}
          >
            <Clock className="w-4 h-4" />
            <span>{variant === "overdue" ? `Overdue · ${dueLabel}` : `Due ${dueLabel}`}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {task.assignees.length === 0 ? (
            <>
              <User className="w-4 h-4" />
              <span>Personal</span>
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              <span>{task.assignees.length} assignee{task.assignees.length > 1 ? 's' : ''}</span>
            </>
          )}
        </div>

        {task.project && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: task.project.color }}
            />
            <span>{task.project.name}</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            {task._count.comments}
          </span>
          <span className="inline-flex items-center gap-1">
            <ListTodo className="w-3.5 h-3.5" />
            {task._count.subtasks}
          </span>
          <span className="inline-flex items-center gap-1">
            <Paperclip className="w-3.5 h-3.5" />
            {task._count.files}
          </span>
        </div>
      </div>

      {/* Assignee avatars */}
      {task.assignees.length > 0 && (
        <div className="flex items-center gap-1.5 mt-3">
          <div className="flex -space-x-1.5">
            {task.assignees.slice(0, 4).map((assignee) => (
              <div
                key={assignee.user.id}
                title={assignee.user.name}
                className="w-6 h-6 rounded-full bg-primary/15 border-2 border-card flex items-center justify-center text-[9px] font-semibold text-primary"
              >
                {(assignee.user.name || "?").charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          {task.assignees.length > 4 && (
            <span className="text-[11px] text-muted-foreground">
              +{task.assignees.length - 4}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

import {
  CheckCircle2,
  TrendingUp,
  Clock,
  Flag,
  Folder,
  Timer,
  AlertCircle,
  Calendar,
  Plus,
  Loader2,
} from "lucide-react";
import { Task } from "@/hooks/useTask";
import {
  formatTimeDuration,
  getPriorityColor,
  getStatusColor,
  getTimeStatusColor,
} from "@/utils/task.utils";
import { formatHoursSinceCreation } from "@/utils/taskcard.utils";

export function TaskCardHeader({
  task,
  showButtons,
  isPrimaryDisabled,
  isInPrimary,
  isInSecondary,
  primaryDisabled,
  secondaryDisabled,
  isPrimaryLoading,
  isSecondaryLoading,
  handlePrimaryClick,
  handleSecondaryClick,
}: {
  task: Task;
  showButtons: boolean;
  isPrimaryDisabled: boolean;
  isInPrimary: boolean;
  isInSecondary: boolean;
  primaryDisabled: boolean;
  secondaryDisabled: boolean;
  isPrimaryLoading: boolean;
  isSecondaryLoading: boolean;
  handlePrimaryClick: (e: React.MouseEvent) => void;
  handleSecondaryClick: (e: React.MouseEvent) => void;
}) {
  const isCompleted = task.status === "COMPLETED";

  return (
    <div className="flex items-start gap-3">
      {/* Status orb */}
      <div
        className={`
          shrink-0 mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center
          ${getStatusColor(task.status)}
          shadow-sm ring-1 ring-inset ring-white/10
        `}
      >
        {isCompleted ? (
          <CheckCircle2 size={17} strokeWidth={2.2} />
        ) : (
          <Clock size={17} strokeWidth={2.2} />
        )}
      </div>

      {/* Title + description */}
      <div className="flex-1 min-w-0 pr-1">
        <h3
          className={`
            font-semibold leading-snug tracking-tight text-foreground
            group-hover:text-primary transition-colors duration-200
            ${isCompleted ? "line-through text-muted-foreground" : ""}
          `}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Right-side controls */}
      <div className="flex items-center gap-2 shrink-0 ml-1">
        {/* Priority flag — always visible */}
        <Flag
          size={16}
          strokeWidth={2.2}
          className={`${getPriorityColor(task.priority)} shrink-0`}
        />

        {/* Action buttons — always visible on touch, hover-reveal on desktop */}
        {showButtons && (
          <div className="flex gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {/* Primary */}
            <button
              onClick={handlePrimaryClick}
              disabled={primaryDisabled}
              title={
                isInPrimary
                  ? "Already your primary task"
                  : isPrimaryDisabled
                  ? "Primary task already set"
                  : "Set as Primary task"
              }
              className={`
                flex items-center justify-center w-7 h-7 rounded-lg text-white text-xs font-bold
                transition-all duration-150 shadow-sm
                ${
                  primaryDisabled
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-40 shadow-none"
                    : "bg-violet-500 hover:bg-violet-600 hover:shadow-md active:scale-95"
                }
              `}
            >
              {isPrimaryLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Plus size={13} strokeWidth={2.8} />
              )}
            </button>

            {/* Secondary */}
            <button
              onClick={handleSecondaryClick}
              disabled={secondaryDisabled}
              title={
                isInSecondary
                  ? "Already a secondary task"
                  : "Add to Secondary"
              }
              className={`
                flex items-center justify-center w-7 h-7 rounded-lg text-white text-xs font-bold
                transition-all duration-150 shadow-sm
                ${
                  secondaryDisabled
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-40 shadow-none"
                    : "bg-amber-500 hover:bg-amber-600 hover:shadow-md active:scale-95"
                }
              `}
            >
              {isSecondaryLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Plus size={13} strokeWidth={2.8} />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function TaskCardMetaChips({ task }: { task: Task }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {/* Project badge */}
      {task.project && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${task.project.color}18`,
            color: task.project.color,
            border: `1px solid ${task.project.color}30`,
          }}
        >
          <Folder size={11} strokeWidth={2.2} />
          {task.project.name}
        </span>
      )}

      {/* Status pill */}
      <span
        className={`
          inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
          ${getStatusColor(task.status)}
          ring-1 ring-inset ring-current/20
        `}
      >
        {task.status.replace("_", " ")}
      </span>

      {/* Time since creation */}
      {task.timeTracking && (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Timer size={12} strokeWidth={2} />
          {formatHoursSinceCreation(task.timeTracking.hoursSinceCreation)} ago
        </span>
      )}

      {/* Due countdown */}
      {task.timeTracking?.hoursUntilDue != null && (
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold ${getTimeStatusColor(
            task.timeTracking
          )}`}
        >
          <AlertCircle size={12} strokeWidth={2.2} />
          {formatTimeDuration(task.timeTracking.hoursUntilDue)}
        </span>
      )}

      {/* Fallback due date */}
      {task.dueDate && !task.timeTracking && (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar size={12} strokeWidth={2} />
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}

      {/* Engagement counts — pushed right */}
      <div className="flex items-center gap-2.5 text-xs text-muted-foreground ml-auto">
        {task._count.comments > 0 && (
          <span className="flex items-center gap-1">
            <span>💬</span>
            <span className="font-medium">{task._count.comments}</span>
          </span>
        )}
        {task._count.subtasks > 0 && (
          <span className="flex items-center gap-1">
            <span>✓</span>
            <span className="font-medium">{task._count.subtasks}</span>
          </span>
        )}
        {task._count.files > 0 && (
          <span className="flex items-center gap-1">
            <span>📎</span>
            <span className="font-medium">{task._count.files}</span>
          </span>
        )}
      </div>
    </div>
  );
}

export function TaskCardProgressAssignees({
  task,
  progress,
}: {
  task: Task;
  progress: number | null;
}) {
  if (!(progress !== null || task.assignees.length > 0)) return null;

  return (
    <div className="mt-3.5 flex items-center gap-3">
      {/* Progress */}
      {progress !== null && task.estimatedHours && (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <TrendingUp
            size={12}
            strokeWidth={2}
            className="text-muted-foreground shrink-0"
          />
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress > 100
                  ? "bg-red-500"
                  : progress > 80
                  ? "bg-orange-500"
                  : "bg-blue-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold tabular-nums text-muted-foreground shrink-0">
            {progress}%
          </span>
        </div>
      )}

      {/* Assignee avatars */}
      {task.assignees.length > 0 && (
        <div className="flex -space-x-1.5 ml-auto">
          {task.assignees.slice(0, 4).map((assignee) => (
            <div
              key={assignee.user.id}
              title={assignee.user.name}
              className="
                w-6 h-6 rounded-full border-2 border-card
                bg-primary/20 flex items-center justify-center
                text-[10px] font-bold text-primary
                ring-1 ring-primary/10
              "
            >
              {assignee.user.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {task.assignees.length > 4 && (
            <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
              +{task.assignees.length - 4}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

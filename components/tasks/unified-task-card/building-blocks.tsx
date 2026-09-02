"use client";

import { AlertCircle, Calendar, CheckCircle2, Clock, File, Folder, MessageSquare, Timer, TrendingUp } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import {
  getStatusColor,
  getTimeStatusColor,
  formatTimeDuration,
} from "@/utils/task.utils";
import type { Task } from "@/hooks/useTask";

// ─── Building blocks shared by card variants ──────────────────────────────────

/** Rounded status orb with clock / completion check. */
export function StatusOrb({ status }: { status: string }) {
  const isCompleted = status === "COMPLETED";
  return (
    <div
      className={`
        shrink-0 mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center
        ${getStatusColor(status)}
        shadow-sm ring-1 ring-inset ring-white/10
      `}
    >
      {isCompleted ? (
        <CheckCircle2 size={17} strokeWidth={2.2} />
      ) : (
        <Clock size={17} strokeWidth={2.2} />
      )}
    </div>
  );
}

/** Title (strikethrough when completed) + optional description block. */
export function TitleBlock({
  title,
  description,
  completed,
  showDescription = true,
  hoverClass = "group-hover:text-primary",
}: {
  title: string;
  description?: string | null;
  completed: boolean;
  showDescription?: boolean;
  hoverClass?: string;
}) {
  return (
    <div className="flex-1 min-w-0">
      <h3
        className={`
          font-semibold leading-snug tracking-tight text-foreground
          ${hoverClass} transition-colors duration-200
          ${completed ? "line-through text-muted-foreground" : ""}
        `}
      >
        {title}
      </h3>
      {showDescription && description && (
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

/** Colored project pill. */
export function ProjectPill({ project }: { project: NonNullable<Task["project"]> }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${project.color}18`,
        color: project.color,
        border: `1px solid ${project.color}30`,
      }}
    >
      <Folder size={11} strokeWidth={2.2} />
      {project.name}
    </span>
  );
}

/** Status text pill using the shared status color scale. */
export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
        ${getStatusColor(status)}
        ring-1 ring-inset ring-current/20
      `}
    >
      {status.replace("_", " ")}
    </span>
  );
}

/** Comment/subtask/file counters shown on the right of the chips row. */
export function EngagementCounts({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-2.5 text-xs text-muted-foreground ml-auto">
      {task._count.comments > 0 && (
        <span className="flex items-center gap-1">
          <MessageSquare size={12} strokeWidth={2} />
          <span className="font-medium">{task._count.comments}</span>
        </span>
      )}
      {task._count.subtasks > 0 && (
        <span className="flex items-center gap-1">
          <CheckCircle2 size={12} strokeWidth={2} />
          <span className="font-medium">{task._count.subtasks}</span>
        </span>
      )}
      {task._count.files > 0 && (
        <span className="flex items-center gap-1">
          <File size={12} strokeWidth={2} />
          <span className="font-medium">{task._count.files}</span>
        </span>
      )}
    </div>
  );
}

/**
 * Meta chips row: project badge, status pill, created/due time info and
 * engagement counts — identical between the detailed and workspace variants.
 */
export function TaskChipsRow({
  task,
  showProject,
  showStatusPill,
  showTimeTracking,
  showEngagementCounts,
}: {
  task: Task;
  showProject: boolean;
  showStatusPill: boolean;
  showTimeTracking: boolean;
  showEngagementCounts: boolean;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {showProject && task.project && <ProjectPill project={task.project} />}
      {showStatusPill && <StatusPill status={task.status} />}

      {showTimeTracking && task.timeTracking && (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Timer size={12} strokeWidth={2} />
          Created {formatTimeDuration(task.timeTracking.hoursSinceCreation)} ago
        </span>
      )}

      {showTimeTracking && task.timeTracking?.hoursUntilDue != null && (
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold ${getTimeStatusColor(
            task.timeTracking
          )}`}
        >
          <AlertCircle size={12} strokeWidth={2.2} />
          {formatTimeDuration(task.timeTracking.hoursUntilDue)}
        </span>
      )}

      {task.dueDate && !task.timeTracking && (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar size={12} strokeWidth={2} />
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}

      {showEngagementCounts && <EngagementCounts task={task} />}
    </div>
  );
}

/** Assignee avatar stack with +N overflow. */
export function AssigneeStack({
  assignees,
  maxVisible = 4,
}: {
  assignees: Task["assignees"];
  maxVisible?: number;
}) {
  return (
    <div className="flex -space-x-1.5 ml-auto">
      {assignees.slice(0, maxVisible).map((assignee) => (
        <Avatar
          key={assignee.user.id}
          name={assignee.user.name}
          image={assignee.user.image}
          size="sm"
        />
      ))}
      {assignees.length > maxVisible && (
        <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
          +{assignees.length - maxVisible}
        </div>
      )}
    </div>
  );
}

/** Progress bar + assignees row (detailed/workspace layout). */
export function ProgressAndAssignees({
  progress,
  task,
  showAssignees,
}: {
  progress: number | null;
  task: Task;
  showAssignees: boolean;
}) {
  return (
    <div className="mt-3.5 flex items-center gap-3">
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

      {showAssignees && task.assignees.length > 0 && (
        <AssigneeStack assignees={task.assignees} />
      )}
    </div>
  );
}

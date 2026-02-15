import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Flag,
  Folder,
  Timer,
  AlertCircle,
  TrendingUp,
  Calendar,
  Plus,
} from "lucide-react";
import { Task } from "@/hooks/useTask";
import {
  formatTimeDuration,
  getPriorityColor,
  getStatusColor,
  getTimeStatusColor,
} from "@/utils/task.utils";

// interface TimeTracking {
//   hoursSinceCreation: number;
//   hoursUntilDue: number;
//   isDueToday: boolean;
//   isOverdue: boolean;
//   timeProgress: number;
// }


interface TaskCardProps {
  task: Task ;
  workspaceSlug: string;
  onAddToPrimary?: (taskId: string) => void;
  onAddToSecondary?: (taskId: string) => void;
  isPrimaryDisabled?: boolean;
  showAddButtons?: boolean;
}

export function TaskCard({
  task,
  workspaceSlug,
  onAddToPrimary,
  onAddToSecondary,
  isPrimaryDisabled = false,
  showAddButtons = false,
}: TaskCardProps) {
  const isCompleted = task.status === "COMPLETED";
  const showButtons = showAddButtons && !isCompleted;

  const handlePrimaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToPrimary && !isPrimaryDisabled) {
      onAddToPrimary(task.id);
    }
  };

  const handleSecondaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToSecondary) {
      onAddToSecondary(task.id);
    }
  };

  return (
    <Link href={`/dashboard/workspaces/${workspaceSlug}/tasks/${task.id}`}>
      <div className="p-4 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group relative">
        {/* Add to Primary/Secondary Buttons */}
        {showButtons && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {/* Primary Button */}
            <button
              onClick={handlePrimaryClick}
              disabled={isPrimaryDisabled}
              className={`p-2 rounded-lg transition-all ${
                isPrimaryDisabled
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : "bg-purple-500 hover:bg-purple-600 text-white shadow-md hover:shadow-lg"
              }`}
              title={isPrimaryDisabled ? "Primary task already set" : "Add to Primary"}
            >
              <Plus size={16} />
            </button>
            {/* Secondary Button */}
            <button
              onClick={handleSecondaryClick}
              className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg transition-all"
              title="Add to Secondary"
            >
              <Plus size={16} />
            </button>
          </div>
        )}

        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className="shrink-0 mt-1">
            <div
              className={`w-10 h-10 rounded-lg ${getStatusColor(
                task.status
              )} flex items-center justify-center`}
            >
              {task.status === "COMPLETED" ? (
                <CheckCircle2 size={20} />
              ) : (
                <Clock size={20} />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Title and Priority */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>

              <Flag size={18} className={getPriorityColor(task.priority)} />
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {/* Project Badge */}
              {task.project && (
                <div className="flex items-center gap-2">
                  <Folder size={14} className="text-muted-foreground" />
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: `${task.project.color}20`,
                      color: task.project.color,
                    }}
                  >
                    {task.project.name}
                  </span>
                </div>
              )}

              {/* Status Badge */}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status.replace("_", " ")}
              </span>

              {/* Time Tracking Info */}
              {task.timeTracking && (
                <>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Timer size={14} />
                    <span>
                      Created {task.timeTracking.hoursSinceCreation}h ago
                    </span>
                  </div>

                  {task.timeTracking.hoursUntilDue !== null && (
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${getTimeStatusColor(
                        task.timeTracking
                      )}`}
                    >
                      <AlertCircle size={14} />
                      <span>
                        {formatTimeDuration(task.timeTracking.hoursUntilDue)}
                      </span>
                    </div>
                  )}

                  {task.timeTracking.timeProgress !== null &&
                    task.estimatedHours && (
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-muted-foreground" />
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              task.timeTracking.timeProgress > 100
                                ? "bg-red-500"
                                : task.timeTracking.timeProgress > 80
                                ? "bg-orange-500"
                                : "bg-blue-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                task.timeTracking.timeProgress
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {task.timeTracking.timeProgress}%
                        </span>
                      </div>
                    )}
                </>
              )}

              {/* Due Date (fallback if no time tracking) */}
              {task.dueDate && !task.timeTracking && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar size={14} />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}

              {/* Assignees */}
              {task.assignees.length > 0 && (
                <div className="flex -space-x-2">
                  {task.assignees.slice(0, 3).map((assignee) => (
                    <div
                      key={assignee.user.id}
                      className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium text-primary-foreground"
                      title={assignee.user.name}
                    >
                      {assignee.user.name.charAt(0)}
                    </div>
                  ))}
                  {task.assignees.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                      +{task.assignees.length - 3}
                    </div>
                  )}
                </div>
              )}

              {/* Counts */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
                {task._count?.comments > 0 && (
                  <span>{task._count.comments} 💬</span>
                )}
                {task._count?.subtasks > 0 && (
                  <span>{task._count.subtasks} ✓</span>
                )}
                {task._count?.files > 0 && (
                  <span>{task._count.files} 📎</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
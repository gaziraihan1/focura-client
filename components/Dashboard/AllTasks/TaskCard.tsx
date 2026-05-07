import { motion } from "framer-motion";
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
} from "lucide-react";
import { Avatar } from "@/components/Shared/Avatar";
import {
  getStatusColor,
  getPriorityColor,
  getTimeStatusColor,
  formatTimeDuration,
} from "@/utils/task.utils";
import { Task } from "@/hooks/useTask";
import { formatHoursSinceCreation } from "@/utils/taskcard.utils";

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const isCompleted = task.status === "COMPLETED";

  const progress =
    task.timeTracking?.timeProgress != null
      ? Math.min(100, task.timeTracking.timeProgress)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25, ease: "easeOut" }}
    >
      <Link href={`/dashboard/tasks/${task.id}`}>
        <div
          className={`
            group relative rounded-2xl border bg-card overflow-hidden
            transition-all duration-300 ease-out
            hover:shadow-[0_8px_32px_-4px_hsl(var(--foreground)/0.12)]
            hover:-translate-y-0.5 hover:border-primary/30
            ${isCompleted ? "opacity-70" : ""}
          `}
        >
          <div className="p-5">
            {/* ── Row 1: Status icon + Title + Priority flag ── */}
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
              <div className="flex-1 min-w-0">
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

              {/* Priority flag */}
              <Flag
                size={16}
                strokeWidth={2.2}
                className={`${getPriorityColor(task.priority)} shrink-0 mt-0.5`}
              />
            </div>

            {/* ── Row 2: Meta chips ── */}
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
                  Created {formatHoursSinceCreation(task.timeTracking.hoursSinceCreation)} ago
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

            {/* ── Row 3: Progress bar + Assignees ── */}
            {(progress !== null || task.assignees.length > 0) && (
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
                      <Avatar
                        key={assignee.user.id}
                        name={assignee.user.name}
                        image={assignee.user.image}
                        size="sm"
                      />
                    ))}
                    {task.assignees.length > 4 && (
                      <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                        +{task.assignees.length - 4}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
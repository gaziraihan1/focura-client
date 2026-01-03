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

interface TaskCardProps {
  task: any;
  index: number;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    TODO: "bg-gray-500/10 text-gray-500",
    IN_PROGRESS: "bg-blue-500/10 text-blue-500",
    IN_REVIEW: "bg-purple-500/10 text-purple-500",
    BLOCKED: "bg-red-500/10 text-red-500",
    COMPLETED: "bg-green-500/10 text-green-500",
    CANCELLED: "bg-gray-500/10 text-gray-500",
  };
  return colors[status] || "bg-gray-500/10 text-gray-500";
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    URGENT: "text-red-500",
    HIGH: "text-orange-500",
    MEDIUM: "text-blue-500",
    LOW: "text-green-500",
  };
  return colors[priority] || "text-gray-500";
};

const formatTimeDuration = (hours: number) => {
  if (hours < 0) {
    const absHours = Math.abs(hours);
    if (absHours < 24) return `${absHours}h overdue`;
    const days = Math.floor(absHours / 24);
    return `${days}d overdue`;
  }
  
  if (hours < 24) return `${hours}h left`;
  const days = Math.floor(hours / 24);
  return `${days}d left`;
};

const formatHoursSinceCreation = (totalHours: number) => {
  if (totalHours < 24) {
    return `${Math.floor(totalHours)}h`;
  }

  const days = Math.floor(totalHours / 24);
  const hours = Math.floor(totalHours % 24);

  return `${days}d ${hours}h`;
};



const getTimeStatusColor = (timeTracking: any) => {
  if (!timeTracking) return "text-gray-500";
  
  if (timeTracking.isOverdue) return "text-red-500";
  if (timeTracking.isDueToday) return "text-orange-500";
  if (timeTracking.hoursUntilDue !== null && timeTracking.hoursUntilDue < 24) {
    return "text-orange-500";
  }
  return "text-blue-500";
};

export function TaskCard({ task, index }: TaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/dashboard/tasks/${task.id}`}>
        <div className="p-4 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
          <div className="flex items-start gap-4">
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

                <Flag
                  size={18}
                  className={getPriorityColor(task.priority)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-3">
                {task.project && (
                  <div className="flex items-center gap-2">
                    <Folder size={14} className="text-muted-foreground" />
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${task.project.color}20`,
                        color: task.project.color,
                      }}
                    >
                      {task.project.name}
                    </span>
                  </div>
                )}

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status.replace("_", " ")}
                </span>

                {task.timeTracking && (
                  <>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Timer size={14} />
                      <span>Created {formatHoursSinceCreation(task.timeTracking.hoursSinceCreation)} ago</span>
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

                    {task.timeTracking.timeProgress !== null && task.estimatedHours && (
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-muted-foreground" />
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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

                {task.dueDate && !task.timeTracking && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar size={14} />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}

                {task.assignees.length > 0 && (
                  <div className="flex -space-x-2">
                    {task.assignees.slice(0, 3).map((assignee: any) => (
                      <div
                        key={assignee.user.id}
                        className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium"
                        title={assignee.user.name}
                      >
                        {assignee.user.name.charAt(0)}
                      </div>
                    ))}
                    {task.assignees.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium">
                        +{task.assignees.length - 3}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
                  {task._count.comments > 0 && (
                    <span>{task._count.comments} 💬</span>
                  )}
                  {task._count.subtasks > 0 && (
                    <span>{task._count.subtasks} ✓</span>
                  )}
                  {task._count.files > 0 && (
                    <span>{task._count.files} 📎</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
"use client"
import { Task } from "@/hooks/useTask";
import Link from "next/link";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Flag,
  Folder,
  Timer,
  TrendingUp,
  Calendar,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { getTaskTimeInfo } from "@/lib/task/time";
import Image from "next/image";
import { motion } from "framer-motion";

type TaskStatus = Task['status'];
type TaskPriority = Task['priority'];

const getStatusColor = (status: TaskStatus): string => {
  const colors: Record<TaskStatus, string> = {
    TODO: "bg-gray-500/10 text-gray-500",
    IN_PROGRESS: "bg-blue-500/10 text-blue-500",
    IN_REVIEW: "bg-purple-500/10 text-purple-500",
    BLOCKED: "bg-red-500/10 text-red-500",
    COMPLETED: "bg-green-500/10 text-green-500",
    CANCELLED: "bg-gray-500/10 text-gray-500",
  };
  return colors[status];
};

const getPriorityColor = (priority: TaskPriority): string => {
  const colors: Record<TaskPriority, string> = {
    URGENT: "text-red-500",
    HIGH: "text-orange-500",
    MEDIUM: "text-blue-500",
    LOW: "text-green-500",
  };
  return colors[priority];
};

const formatTimeDuration = (hours: number): string => {
  if (hours < 0) {
    const absHours = Math.abs(hours);
    if (absHours < 24) return `${Math.floor(absHours)}h overdue`;
    const days = Math.floor(absHours / 24);
    return `${days}d overdue`;
  }
  
  if (hours < 24) return `${Math.floor(hours)}h left`;
  const days = Math.floor(hours / 24);
  return `${days}d left`;
};

const formatHoursSinceCreation = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (totalHours < 24) {
    return `${totalHours}h`;
  }

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  return `${days}d ${hours}h`;
};

const calculateTimeProgress = (
  startDate: string | undefined,
  dueDate: string | null,
  estimatedHours: number | undefined
): number | null => {
  if (!startDate || !dueDate || !estimatedHours) return null;
  
  const now = new Date();
  const start = new Date(startDate);
  const due = new Date(dueDate);
  
  const totalTime = due.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  
  if (totalTime <= 0) return null;
  
  return Math.round((elapsed / totalTime) * 100);
};

interface TaskCardTeamProps {
  task: Task;
  index: number
}

export function TaskCardTeam({ task, index }: TaskCardTeamProps) {
  const { isOverdue, hoursUntilDue } = getTaskTimeInfo(task);
  const timeProgress = calculateTimeProgress(task.startDate, task.dueDate, task.estimatedHours);

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}>

    <Link href={`/dashboard/tasks/${task.id}`}>
      <div className="p-4 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className="shrink-0 mt-1">
            <div
              className={`w-10 h-10 rounded-lg ${getStatusColor(
                task.status
              )} flex items-center justify-center`}
            >
              {task.status === 'COMPLETED' ? (
                <CheckCircle2 size={20} />
              ) : task.status === 'BLOCKED' ? (
                <AlertTriangle size={20} />
              ) : (
                <Clock size={20} />
              )}
            </div>
          </div>

          {/* Content */}
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

            {/* Project and Workspace Info */}
            {task.project && (
              <div className="flex items-center gap-2 mt-2">
                <Folder size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {task.project.workspace.name} • {task.project.name}
                </span>
              </div>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {/* Project Color Badge */}
              {task.project && (
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: `${task.project.color}20`,
                    color: task.project.color,
                  }}
                >
                  {task.project.name}
                </span>
              )}

              {/* Status Badge */}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status.replace("_", " ")}
              </span>

              {/* Created Time */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Timer size={14} />
                <span>Created {formatHoursSinceCreation(task.createdAt)} ago</span>
              </div>

              {/* Due Time */}
              {task.dueDate && hoursUntilDue !== null && (
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    isOverdue 
                      ? "text-red-500" 
                      : hoursUntilDue < 24 
                      ? "text-orange-500" 
                      : "text-blue-500"
                  }`}
                >
                  <AlertCircle size={14} />
                  <span>{formatTimeDuration(hoursUntilDue)}</span>
                </div>
              )}

              {/* Due Date (fallback) */}
              {task.dueDate && hoursUntilDue === null && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar size={14} />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}

              {/* Time Progress Bar */}
              {timeProgress !== null && task.estimatedHours && (
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-muted-foreground" />
                  <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        timeProgress > 100
                          ? "bg-red-500"
                          : timeProgress > 80
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.min(100, timeProgress)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {timeProgress}%
                  </span>
                </div>
              )}

              {/* Assignees */}
              {task.assignees.length > 0 && (
                <div className="flex -space-x-2">
                  {task.assignees.slice(0, 3).map((assignee) => (
                    <div
                      key={assignee.user.id}
                      className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium"
                      title={assignee.user.name}
                    >
                      {assignee.user.image ? (
                        <Image
                          src={assignee.user.image}
                          alt={assignee.user.name}
                          width={20}
                          height={20}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        assignee.user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  ))}
                  {task.assignees.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium">
                      +{task.assignees.length - 3}
                    </div>
                  )}
                </div>
              )}

              {/* Counts */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
                {task._count.comments > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    <span>{task._count.comments}</span>
                  </div>
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
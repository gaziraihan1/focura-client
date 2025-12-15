// utils/task.utils.ts
import { TimeTracking, TaskStatus, TaskPriority } from "@/types/task.types";

export const formatTimeDuration = (hours: number): string => {
  if (hours < 0) {
    const absHours = Math.abs(hours);
    if (absHours < 24) return `${absHours}h overdue`;
    const days = Math.floor(absHours / 24);
    const remainingHours = absHours % 24;
    return `${days}d ${remainingHours}h overdue`;
  }

  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h`;
};

export const getTimeStatusColor = (timeTracking: TimeTracking | undefined): string => {
  if (!timeTracking) return "text-gray-500";

  if (timeTracking.isOverdue) return "text-red-500 bg-red-500/10";
  if (timeTracking.isDueToday) return "text-orange-500 bg-orange-500/10";
  if (timeTracking.hoursUntilDue !== null && timeTracking.hoursUntilDue < 24) {
    return "text-orange-500 bg-orange-500/10";
  }
  return "text-blue-500 bg-blue-500/10";
};

export const getFocusLevelColor = (level: number): string => {
  if (level >= 4) return "text-red-500";
  if (level >= 3) return "text-orange-500";
  return "text-blue-500";
};

export const getEnergyTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    LOW: "text-green-500 bg-green-500/10",
    MEDIUM: "text-blue-500 bg-blue-500/10",
    HIGH: "text-red-500 bg-red-500/10",
  };
  return colors[type] || "text-gray-500 bg-gray-500/10";
};

export const getStatusColor = (status: TaskStatus): string => {
  const colors: Record<string, string> = {
    TODO: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    IN_PROGRESS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    IN_REVIEW: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    BLOCKED: "bg-red-500/10 text-red-500 border-red-500/20",
    COMPLETED: "bg-green-500/10 text-green-500 border-green-500/20",
    CANCELLED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };
  return colors[status] || "bg-gray-500/10 text-gray-500";
};

export const getPriorityColor = (priority: TaskPriority): string => {
  const colors: Record<string, string> = {
    URGENT: "bg-red-500/10 text-red-500 border-red-500/20",
    HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    MEDIUM: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    LOW: "bg-green-500/10 text-green-500 border-green-500/20",
  };
  return colors[priority] || "bg-gray-500/10 text-gray-500";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};
import { TimeTracking, TaskPriority, TaskStatus } from '@/types/task.types';

export function getStatusColor(status: TaskStatus): string {
  const colors: Record<TaskStatus, string> = {
    TODO: 'bg-gray-500/10 text-gray-500',
    IN_PROGRESS: 'bg-blue-500/10 text-blue-500',
    IN_REVIEW: 'bg-purple-500/10 text-purple-500',
    BLOCKED: 'bg-red-500/10 text-red-500',
    COMPLETED: 'bg-green-500/10 text-green-500',
    CANCELLED: 'bg-gray-500/10 text-gray-500',
  };
  return colors[status] || 'bg-gray-500/10 text-gray-500';
}

export function getPriorityColor(priority: TaskPriority): string {
  const colors: Record<TaskPriority, string> = {
    URGENT: 'text-red-500',
    HIGH: 'text-orange-500',
    MEDIUM: 'text-blue-500',
    LOW: 'text-green-500',
  };
  return colors[priority] || 'text-gray-500';
}

export function formatTimeDuration(hours: number): string {
  if (hours < 0) {
    const absHours = Math.abs(hours);
    if (absHours < 24) return `${absHours}h overdue`;
    const days = Math.floor(absHours / 24);
    return `${days}d overdue`;
  }

  if (hours < 24) return `${hours}h left`;
  const days = Math.floor(hours / 24);
  return `${days}d left`;
}

export function formatHoursSinceCreation(totalHours: number): string {
  if (totalHours < 24) {
    return `${Math.floor(totalHours)}h`;
  }

  const days = Math.floor(totalHours / 24);
  const hours = Math.floor(totalHours % 24);

  return `${days}d ${hours}h`;
}

export function getTimeStatusColor(timeTracking: TimeTracking | null): string {
  if (!timeTracking) return 'text-gray-500';

  if (timeTracking.isOverdue) return 'text-red-500';
  if (timeTracking.isDueToday) return 'text-orange-500';
  if (
    timeTracking.hoursUntilDue !== null &&
    timeTracking.hoursUntilDue < 24
  ) {
    return 'text-orange-500';
  }
  return 'text-blue-500';
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getProgressPercentage(timeRemaining: number): number {
  return Math.min(100, timeRemaining > 0 ? 100 - (timeRemaining / 1500) * 100 : 100);
}

export function getProgressBarColor(timeProgress: number): string {
  if (timeProgress > 100) return 'bg-red-500';
  if (timeProgress > 80) return 'bg-orange-500';
  return 'bg-purple-500';
}
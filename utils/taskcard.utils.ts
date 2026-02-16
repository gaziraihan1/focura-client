import {  TaskPriority } from '@/types/task.types';



export function getPriorityColor(priority: TaskPriority): string {
  const colors: Record<TaskPriority, string> = {
    URGENT: 'text-red-500',
    HIGH: 'text-orange-500',
    MEDIUM: 'text-blue-500',
    LOW: 'text-green-500',
  };
  return colors[priority] || 'text-gray-500';
}

export function formatHoursSinceCreation(totalHours: number): string {
  if (totalHours < 24) {
    return `${Math.floor(totalHours)}h`;
  }

  const days = Math.floor(totalHours / 24);
  const hours = Math.floor(totalHours % 24);

  return `${days}d ${hours}h`;
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

export const calculateTimeProgress = (
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
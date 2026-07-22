"use client";

import { useMemo } from "react";
import type { Task } from "@/hooks/useTask";

export interface DueDateInfo {
  /** Whether the task has a due date set */
  hasDueDate: boolean;
  /** The due date as a Date object */
  dueDate: Date | null;
  /** Whether the task is overdue (past due date and not completed) */
  isOverdue: boolean;
  /** Whether the task is due today */
  isDueToday: boolean;
  /** Whether the task is due within the specified hours */
  isDueSoon: boolean;
  /** Whether the task is completed */
  isCompleted: boolean;
  /** Hours until the due date (negative if overdue) */
  hoursUntilDue: number | null;
  /** Human-readable time remaining string */
  timeRemaining: string;
  /** Urgency level for styling */
  urgency: "overdue" | "due-today" | "due-soon" | "normal";
}

/**
 * Hook to compute due date information for a task.
 *
 * @param task - The task object
 * @param soonThresholdHours - Hours threshold for "due soon" (default: 6)
 * @returns DueDateInfo with computed fields
 */
export function useTaskDueDate(
  task: Task,
  soonThresholdHours: number = 6
): DueDateInfo {
  return useMemo(() => {
    const now = new Date();
    const isCompleted =
      task.status === "COMPLETED" || task.status === "CANCELLED";

    if (!task.dueDate) {
      return {
        hasDueDate: false,
        dueDate: null,
        isOverdue: false,
        isDueToday: false,
        isDueSoon: false,
        isCompleted,
        hoursUntilDue: null,
        timeRemaining: "No due date",
        urgency: "normal",
      };
    }

    const due = new Date(task.dueDate);
    const diffMs = due.getTime() - now.getTime();
    const hoursUntilDue = diffMs / (1000 * 60 * 60);

    const isOverdue = hoursUntilDue < 0 && !isCompleted;
    const isDueToday =
      due.getFullYear() === now.getFullYear() &&
      due.getMonth() === now.getMonth() &&
      due.getDate() === now.getDate();
    const isDueSoon =
      hoursUntilDue >= 0 && hoursUntilDue <= soonThresholdHours && !isCompleted;

    // Compute urgency
    let urgency: DueDateInfo["urgency"] = "normal";
    if (isOverdue) urgency = "overdue";
    else if (isDueToday) urgency = "due-today";
    else if (isDueSoon) urgency = "due-soon";

    // Compute human-readable time remaining
    let timeRemaining: string;
    if (isCompleted) {
      timeRemaining = "Completed";
    } else if (isOverdue) {
      const absHours = Math.abs(Math.floor(hoursUntilDue));
      if (absHours < 1) {
        const mins = Math.abs(Math.floor(hoursUntilDue * 60));
        timeRemaining = `${mins}m overdue`;
      } else if (absHours < 24) {
        timeRemaining = `${absHours}h overdue`;
      } else {
        const days = Math.floor(absHours / 24);
        timeRemaining = `${days}d overdue`;
      }
    } else if (hoursUntilDue < 1) {
      const mins = Math.floor(hoursUntilDue * 60);
      timeRemaining = `${mins}m left`;
    } else if (hoursUntilDue < 24) {
      timeRemaining = `${Math.floor(hoursUntilDue)}h left`;
    } else {
      const days = Math.floor(hoursUntilDue / 24);
      timeRemaining = `${days}d left`;
    }

    return {
      hasDueDate: true,
      dueDate: due,
      isOverdue,
      isDueToday,
      isDueSoon,
      isCompleted,
      hoursUntilDue,
      timeRemaining,
      urgency,
    };
  }, [task.dueDate, task.status, soonThresholdHours]);
}

/**
 * Check if a task should receive a due date reminder notification.
 * Returns true if the task has a due date, is not completed,
 * and is within the reminder threshold.
 */
export function shouldSendReminder(
  task: Task,
  reminderHours: number[] = [3, 6]
): boolean {
  if (!task.dueDate) return false;
  if (task.status === "COMPLETED" || task.status === "CANCELLED") return false;

  const now = new Date();
  const due = new Date(task.dueDate);
  const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Check if within any reminder window
  return reminderHours.some(
    (h) => hoursUntilDue > 0 && hoursUntilDue <= h
  );
}

/**
 * Get the CSS class for urgency-based styling.
 */
export function getUrgencyClasses(urgency: DueDateInfo["urgency"]): string {
  switch (urgency) {
    case "overdue":
      return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
    case "due-today":
      return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
    case "due-soon":
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
    case "normal":
    default:
      return "text-muted-foreground bg-muted/50 border-border";
  }
}

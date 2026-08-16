import type { TimeEntryCategory } from "@/types/task.types";

/**
 * Shared category metadata for time entries. Kept in one place so the task
 * details card and the "My Time Entries" view render identical badges.
 */
export const TIME_ENTRY_CATEGORY_META: Record<
  TimeEntryCategory,
  { label: string; className: string }
> = {
  DEEP_WORK: {
    label: "Deep Work",
    className:
      "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
  },
  MEETINGS: {
    label: "Meetings",
    className:
      "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
  },
  ADMIN: {
    label: "Admin",
    className:
      "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
  },
  LEARNING: {
    label: "Learning",
    className:
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  },
  BREAK: {
    label: "Break",
    className:
      "bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400",
  },
  OTHER: {
    label: "Other",
    className:
      "bg-neutral-500/10 border-neutral-500/20 text-neutral-600 dark:text-neutral-400",
  },
};

export const TIME_ENTRY_CATEGORY_OPTIONS = Object.keys(
  TIME_ENTRY_CATEGORY_META
) as TimeEntryCategory[];

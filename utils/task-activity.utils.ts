// utils/task-activity.util.ts
import type { Activity, ActivityMetadata, GroupedActivities } from '@/types/task-activity.types';

export function getActivityIcon(action: string): string {
  switch (action) {
    case 'CREATED':
      return 'Plus';
    case 'UPDATED':
      return 'Pencil';
    case 'DELETED':
      return 'Trash2';
    case 'COMPLETED':
      return 'CheckCircle2';
    case 'ASSIGNED':
    case 'UNASSIGNED':
      return 'Users';
    case 'COMMENTED':
      return 'MessageSquare';
    case 'STATUS_CHANGED':
    case 'PRIORITY_CHANGED':
      return 'AlertCircle';
    default:
      return 'Circle';
  }
}

export function getActionColor(action: string): string {
  switch (action) {
    case 'CREATED':
      return 'text-green-600 dark:text-green-400';
    case 'COMPLETED':
      return 'text-blue-600 dark:text-blue-400';
    case 'DELETED':
      return 'text-red-600 dark:text-red-400';
    case 'UPDATED':
    case 'STATUS_CHANGED':
    case 'PRIORITY_CHANGED':
      return 'text-yellow-600 dark:text-yellow-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

export function getActivityDescription(
  action:   string,
  metadata?: ActivityMetadata,
): string {
  const isSubtask = metadata?.isSubtask === true;
  const subject   = isSubtask ? "subtask" : "task";

  switch (action) {
    case "CREATED":
      return `created a ${subject}`;

    case "UPDATED":
      return metadata?.changes
        ? `updated ${Object.keys(metadata.changes).join(", ")} on ${subject}`
        : `updated this ${subject}`;

    case "COMPLETED":
      return `completed this ${subject}`;

    case "DELETED":
      return `deleted a ${subject}`;

    case "STATUS_CHANGED":
      return metadata?.newStatus
        ? `changed ${subject} status to ${metadata.newStatus}`
        : `changed the ${subject} status`;

    case "PRIORITY_CHANGED":
      return metadata?.newPriority
        ? `changed ${subject} priority to ${metadata.newPriority}`
        : `changed the ${subject} priority`;

    case "ASSIGNED":
      return `was assigned to this ${subject}`;

    case "UNASSIGNED":
      return `was unassigned from this ${subject}`;

    case "COMMENTED":
      return "added a";

    default:
      return action.toLowerCase().replace("_", " ");
  }
}

export function getUserInitials(name: string): string {
  return name?.charAt(0).toUpperCase() || 'U';
}

export function groupActivitiesByDate(activities: Activity[]): GroupedActivities {
  return activities.reduce((acc, activity) => {
    const date = new Date(activity.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as GroupedActivities);
}
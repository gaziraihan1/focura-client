import type { Activity, ActivityMetadata, GroupedActivities } from '@/types/task-activity.types';

export function getActivityIcon(action: string): string {
  switch (action) {
    case 'CREATED':      return 'Plus';
    case 'UPDATED':      return 'Pencil';
    case 'DELETED':      return 'Trash2';
    case 'COMPLETED':    return 'CheckCircle2';
    case 'ASSIGNED':
    case 'UNASSIGNED':   return 'Users';
    case 'COMMENTED':    return 'MessageSquare';
    case 'UPLOADED':     return 'Paperclip';
    case 'MOVED':        return 'ArrowRight';
    case 'STATUS_CHANGED':
    case 'PRIORITY_CHANGED': return 'AlertCircle';
    default:             return 'Circle';
  }
}

export function getActionColor(action: string): string {
  switch (action) {
    case 'CREATED':
    case 'ASSIGNED':     return 'text-green-600 dark:text-green-400';
    case 'COMPLETED':    return 'text-blue-600 dark:text-blue-400';
    case 'DELETED':
    case 'UNASSIGNED':   return 'text-red-600 dark:text-red-400';
    case 'UPLOADED':
    case 'MOVED':        return 'text-purple-600 dark:text-purple-400';
    case 'COMMENTED':    return 'text-indigo-600 dark:text-indigo-400';
    case 'UPDATED':
    case 'STATUS_CHANGED':
    case 'PRIORITY_CHANGED': return 'text-yellow-600 dark:text-yellow-400';
    default:             return 'text-gray-600 dark:text-gray-400';
  }
}

export function getActivityDescription(
  action: string,
  metadata?: ActivityMetadata,
  entityType?: string,
): string {
  const isSubtask = metadata?.isSubtask === true;

  const subject =
    entityType === 'COMMENT'      ? 'comment'    :
    entityType === 'FILE'         ? 'file'       :
    entityType === 'MEMBER'       ? 'member'     :
    entityType === 'PROJECT'      ? 'project'    :
    entityType === 'WORKSPACE'    ? 'workspace'  :
    entityType === 'ANNOUNCEMENT' ? 'announcement':
    isSubtask                     ? 'subtask'    :
    'task';

  switch (action) {
    case 'CREATED':
      if (entityType === 'ANNOUNCEMENT') return 'created an announcement'
      return `created a ${subject}`;

    case 'UPDATED':
      if (entityType === 'COMMENT') return 'edited a comment';
      return metadata?.changes
        ? `updated ${Object.keys(metadata.changes).join(', ')} on this ${subject}`
        : `updated this ${subject}`;

    case 'COMPLETED':
      return `completed this ${subject}`;

    case 'DELETED':
      if (entityType === 'COMMENT') return 'deleted a comment';
      if (entityType === 'FILE')    return 'deleted an attachment';
      if (entityType ===  'ANNOUNCEMENT') return 'deleted an announcement'
      return `deleted a ${subject}`;

    case 'STATUS_CHANGED':
      return metadata?.newStatus
        ? `changed ${subject} status to ${metadata.newStatus.replace('_', ' ')}`
        : `changed the ${subject} status`;

    case 'PRIORITY_CHANGED':
      return metadata?.newPriority
        ? `changed ${subject} priority to ${metadata.newPriority}`
        : `changed the ${subject} priority`;

    case 'ASSIGNED':
      return metadata?.assigneeName
        ? `assigned ${metadata.assigneeName} to this ${subject}`
        : `assigned a member to this ${subject}`;

    case 'UNASSIGNED':
      return metadata?.assigneeName
        ? `removed ${metadata.assigneeName} from this ${subject}`
        : `unassigned a member from this ${subject}`;

    case 'COMMENTED':
      return 'added a comment';

    case 'UPLOADED':
      return metadata?.fileName
        ? `uploaded ${metadata.fileName}`
        : 'uploaded an attachment';

    case 'MOVED':
      return metadata?.destination
        ? `moved this ${subject} to ${metadata.destination}`
        : `moved this ${subject}`;

    default:
      return action.toLowerCase().replace(/_/g, ' ');
  }
}

export function getUserInitials(name: string): string {
  return name?.charAt(0).toUpperCase() || 'U';
}

export function groupActivitiesByDate(activities: Activity[]): GroupedActivities {
  return activities.reduce((acc, activity) => {
    const date = new Date(activity.createdAt).toLocaleDateString('en-US', {
      year:  'numeric',
      month: 'long',
      day:   'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {} as GroupedActivities);
}
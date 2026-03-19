// types/task-activity.types.ts

export interface ActivityMetadata {
  changes?:      Record<string, unknown>;
  newStatus?:    string;
  newPriority?:  string;
  taskTitle?:    string;
  isSubtask?:    boolean;
  subtaskTitle?: string;
  parentTaskId?: string
  [key: string]: unknown;
}

export interface ActivityUser {
  id: string;
  name: string;
  image?: string;
}

export interface Activity {
  id: string;
  action: string;
  entityType: string;
  createdAt: string;
  metadata?: ActivityMetadata;
  user: ActivityUser;
}

export interface TaskActivityListProps {
  activities: Activity[];
}

export type ActivityAction =
  | 'CREATED'
  | 'UPDATED'
  | 'DELETED'
  | 'COMPLETED'
  | 'ASSIGNED'
  | 'UNASSIGNED'
  | 'COMMENTED'
  | 'STATUS_CHANGED'
  | 'PRIORITY_CHANGED';

export interface GroupedActivities {
  [date: string]: Activity[];
}
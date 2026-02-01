export type ActivityAction =
  | 'CREATED'
  | 'UPDATED'
  | 'DELETED'
  | 'COMPLETED'
  | 'COMMENTED'
  | 'ASSIGNED'
  | 'UNASSIGNED'
  | 'STATUS_CHANGED'
  | 'MOVED'
  | 'PRIORITY_CHANGED';

export type EntityType =
  | 'TASK'
  | 'PROJECT'
  | 'WORKSPACE'
  | 'COMMENT'
  | 'MEMBER'
  | 'FILE';

export type DatePreset = 'today' | 'yesterday' | 'week' | 'month' | 'custom';

export interface ActivityFilterValues {
  action?: ActivityAction;
  entityType?: EntityType;
  startDate?: string;
  endDate?: string;
}

export interface SelectOption<T> {
  value: T | 'all';
  label: string;
}

export interface DatePresetOption {
  value: DatePreset;
  label: string;
}
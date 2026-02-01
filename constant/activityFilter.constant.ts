// constants/activity-filter.constants.ts
import {
  ActivityAction,
  EntityType,
  SelectOption,
  DatePresetOption,
} from '@/types/activityFilter.types';

export const ACTION_OPTIONS: SelectOption<ActivityAction>[] = [
  { value: 'all', label: 'All Actions' },
  { value: 'CREATED', label: 'Created' },
  { value: 'UPDATED', label: 'Updated' },
  { value: 'DELETED', label: 'Deleted' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'COMMENTED', label: 'Commented' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'UNASSIGNED', label: 'Unassigned' },
  { value: 'STATUS_CHANGED', label: 'Status Changed' },
  { value: 'MOVED', label: 'Moved' },
  { value: 'PRIORITY_CHANGED', label: 'Priority Changed' },
];

export const ENTITY_OPTIONS: SelectOption<EntityType>[] = [
  { value: 'all', label: 'All Types' },
  { value: 'TASK', label: 'Tasks' },
  { value: 'PROJECT', label: 'Projects' },
  { value: 'WORKSPACE', label: 'Workspaces' },
  { value: 'COMMENT', label: 'Comments' },
  { value: 'FILE', label: 'Files' },
  { value: 'MEMBER', label: 'Members' },
];

export const DATE_PRESETS: DatePresetOption[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'custom', label: 'Custom Range' },
];
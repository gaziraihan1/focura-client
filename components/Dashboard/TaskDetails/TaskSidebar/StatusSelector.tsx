import { Lock } from 'lucide-react';
import { Task } from '@/types/task.types';
import { getStatusColor } from '@/utils/task.utils';
import {
  STATUS_OPTIONS,
  PERSONAL_TASK_STATUS_OPTIONS,
  STATUS_LABELS,
} from '@/constant/task.constant';

interface StatusSelectorProps {
  status: Task['status'];
  isPersonalTask: boolean;
  isUpdatingStatus: boolean;
  canChangeStatus: boolean;
  onStatusChange: (status: Task['status']) => void;
}

export function StatusSelector({
  status,
  isPersonalTask,
  isUpdatingStatus,
  canChangeStatus,
  onStatusChange,
}: StatusSelectorProps) {
  const statusLabel = STATUS_LABELS[status] || status;

  if (!canChangeStatus) {
    return (
      <div>
        <div
          className={`w-full px-4 py-2 rounded-lg border ${getStatusColor(
            status
          )} font-medium text-center opacity-60 cursor-not-allowed`}
        >
          {statusLabel}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Lock size={12} />
          <span>You don&apos;t have permission to change the status</span>
        </div>
      </div>
    );
  }

  const availableStatuses = isPersonalTask
    ? PERSONAL_TASK_STATUS_OPTIONS
    : STATUS_OPTIONS;

  return (
    <div>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as Task['status'])}
        disabled={isUpdatingStatus}
        className={`w-full px-4 py-2 rounded-lg border ${getStatusColor(
          status
        )} font-medium focus:ring-2 ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {availableStatuses.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isPersonalTask && (
        <p className="text-xs text-muted-foreground mt-2">
          Personal tasks support: To Do, In Progress, Completed
        </p>
      )}
    </div>
  );
}
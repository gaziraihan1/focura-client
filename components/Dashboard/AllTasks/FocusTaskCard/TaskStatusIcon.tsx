import { CheckCircle2, Clock } from 'lucide-react';
import { TaskStatus } from '@/types/task.types';
import { getStatusColor } from '@/utils/task.utils';

interface TaskStatusIconProps {
  status: TaskStatus;
}

export function TaskStatusIcon({ status }: TaskStatusIconProps) {
  return (
    <div
      className={`w-12 h-12 rounded-xl ${getStatusColor(
        status
      )} flex items-center justify-center border-2 border-purple-500/30`}
    >
      {status === 'COMPLETED' ? (
        <CheckCircle2 size={24} />
      ) : (
        <Clock size={24} />
      )}
    </div>
  );
}
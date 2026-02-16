import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getStatusColor } from '@/utils/task.utils';
import { TaskStatus } from '@/types/task.types';

interface TeamTaskStatusIconProps {
  status: TaskStatus;
}

export function TeamTaskStatusIcon({ status }: TeamTaskStatusIconProps) {
  const getIcon = () => {
    if (status === 'COMPLETED') {
      return <CheckCircle2 size={20} />;
    }
    if (status === 'BLOCKED') {
      return <AlertTriangle size={20} />;
    }
    return <Clock size={20} />;
  };

  return (
    <div
      className={`w-10 h-10 rounded-lg ${getStatusColor(
        status
      )} flex items-center justify-center`}
    >
      {getIcon()}
    </div>
  );
}
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getStatusColor } from '@/utils/task.utils';
import { TaskStatus } from '@/types/task.types';

interface TeamTaskStatusIconProps {
  status: TaskStatus;
}

export function TeamTaskStatusIcon({ status }: TeamTaskStatusIconProps) {
  const getIcon = () => {
    if (status === 'COMPLETED') return <CheckCircle2 size={17} strokeWidth={2.2} />;
    if (status === 'BLOCKED') return <AlertTriangle size={17} strokeWidth={2.2} />;
    return <Clock size={17} strokeWidth={2.2} />;
  };

  return (
    <div
      className={`
        w-9 h-9 rounded-xl flex items-center justify-center
        ${getStatusColor(status)}
        shadow-sm ring-1 ring-inset ring-white/10
      `}
    >
      {getIcon()}
    </div>
  );
}
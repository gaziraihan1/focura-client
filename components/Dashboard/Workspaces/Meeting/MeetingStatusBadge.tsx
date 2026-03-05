import type { MeetingStatus } from '@/types/meeting.types';
import { STATUS_LABELS, STATUS_COLORS } from '@/utils/meeting.utils';

interface Props {
  status: MeetingStatus;
  className?: string;
}

export function MeetingStatusBadge({ status, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]} ${className}`}
    >
      {status === 'ONGOING' && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}
'use client';

import { CalendarClock } from 'lucide-react';
import type { MeetingStatus } from '@/types/meeting.types';
import { STATUS_LABELS } from '@/utils/meeting.utils';

interface Props {
  activeStatus: MeetingStatus | undefined;
  onStatusChange: (status: MeetingStatus | undefined) => void;
  upcoming: boolean;
  onUpcomingChange: (upcoming: boolean) => void;
  total: number;
}

const STATUSES: (MeetingStatus | 'ALL')[] = [
  'ALL', 'SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED',
];

export function MeetingFilters({
  activeStatus, onStatusChange, upcoming, onUpcomingChange, total,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center rounded-lg border bg-card p-1 gap-0.5">
        {STATUSES.map((s) => {
          const active = s === 'ALL' ? !activeStatus : activeStatus === s;
          return (
            <button
              key={s}
              onClick={() => onStatusChange(s === 'ALL' ? undefined : s)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s === 'ALL' ? 'All' : STATUS_LABELS[s]}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onUpcomingChange(!upcoming)}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
          upcoming
            ? 'border-primary/50 bg-primary/10 text-primary'
            : 'border-border bg-card text-muted-foreground hover:text-foreground'
        }`}
      >
        <CalendarClock size={12} />
        Upcoming only
      </button>

      <span className="ml-auto text-xs text-muted-foreground">
        {total} meeting{total !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
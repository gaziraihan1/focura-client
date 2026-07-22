import { CalendarX2 } from 'lucide-react';
import { EmptyState as SharedEmptyState } from '@/components/Shared/EmptyState';

interface Props {
  isAdmin: boolean;
  onCreateClick?: () => void;
  hasFilters: boolean;
}

export function MeetingEmptyState({ isAdmin, onCreateClick, hasFilters }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-16 px-6 text-center">
      <SharedEmptyState
        icon={CalendarX2}
        title={hasFilters ? 'No meetings match your filters' : 'No meetings yet'}
        description={
          hasFilters
            ? 'Try changing or clearing your filters to see more meetings.'
            : isAdmin
            ? 'Schedule your first meeting to keep your team aligned and informed.'
            : 'Meetings scheduled by admins will appear here when available.'
        }
        action={
          isAdmin && !hasFilters && onCreateClick
            ? { label: 'New meeting', onClick: onCreateClick }
            : undefined
        }
      />
    </div>
  );
}

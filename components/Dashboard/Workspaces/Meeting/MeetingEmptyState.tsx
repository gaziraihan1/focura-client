import { CalendarX2, Plus } from 'lucide-react';

interface Props {
  isAdmin: boolean;
  onCreateClick?: () => void;
  hasFilters: boolean;
}

export function MeetingEmptyState({ isAdmin, onCreateClick, hasFilters }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-16 px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <CalendarX2 size={20} />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">
        {hasFilters ? 'No meetings match your filters' : 'No meetings yet'}
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs mb-4">
        {hasFilters
          ? 'Try changing or clearing your filters to see more meetings.'
          : isAdmin
          ? 'Schedule your first meeting to keep your team aligned and informed.'
          : 'Meetings scheduled by admins will appear here when available.'}
      </p>
      {isAdmin && !hasFilters && onCreateClick && (
        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          New meeting
        </button>
      )}
    </div>
  );
}
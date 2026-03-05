import { Check } from 'lucide-react';
import type { WorkspaceMember } from '@/hooks/useWorkspace';
import { MemberAvatar } from './MemberAvatar';

interface Props {
  attendeeIds: string[];
  members: WorkspaceMember[];
  currentUserId: string;
  search: string;
  onSearchChange: (v: string) => void;
  onToggle: (userId: string) => void;
  required?: boolean;
}

export function AttendeePicker({
  attendeeIds, members, currentUserId, search, onSearchChange, onToggle, required,
}: Props) {
  const filtered = members.filter(
    (m) =>
      m.userId !== currentUserId &&
      (m.user.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.user.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {required
            ? <span>Attendees <span className="text-destructive">*</span></span>
            : 'Pre-invite attendees'
          }
        </p>
        {attendeeIds.length > 0 && (
          <span className="text-xs text-muted-foreground">{attendeeIds.length} selected</span>
        )}
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search members..."
        className="input-base"
      />

      <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border bg-background p-1">
        {filtered.length === 0 ? (
          <p className="px-3 py-4 text-center text-xs text-muted-foreground">No members found</p>
        ) : (
          filtered.map((m) => {
            const selected = attendeeIds.includes(m.userId);
            return (
              <button
                key={m.userId}
                type="button"
                onClick={() => onToggle(m.userId)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                  selected ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-foreground'
                }`}
              >
                <MemberAvatar user={m.user} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.user.name ?? m.user.email}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.user.email}</p>
                </div>
                {selected && <Check size={14} />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
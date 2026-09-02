'use client';

import { useState } from 'react';
import {
  Globe,
  Lock,
  CalendarDays,
  Clock,
  MapPin,
  MoreVertical,
  Users,
  Video,
} from 'lucide-react';
import type { Meeting } from '@/types/meeting.types';
import { MeetingStatusBadge } from './MeetingStatusBadge';
import {
  formatMeetingDate,
  formatMeetingTime,
  formatMeetingDuration,
  isMeetingLive,
} from '@/utils/meeting.utils';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

interface Props {
  meeting: Meeting;
  isAdmin: boolean;
  currentUserId: string;
  onEdit?: (meeting: Meeting) => void;
  onCancel?: (meeting: Meeting) => void;
  onDelete?: (meeting: Meeting) => void;
  onClick?: (meeting: Meeting) => void;
}

export function MeetingCard({
  meeting,
  isAdmin,
  currentUserId,
  onEdit,
  onCancel,
  onDelete,
  onClick,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const live        = isMeetingLive(meeting.startTime, meeting.endTime);
  const canManage   = isAdmin || meeting.createdById === currentUserId;
  const isCancelled = meeting.status === 'CANCELLED';

  const start = new Date(meeting.startTime);
  const dayShort = start.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
  });
  const dayNum = start.getUTCDate();

  return (
    <div
      role="group"
      tabIndex={0}
      onClick={() => onClick?.(meeting)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick(meeting);
        }
      }}
      className={`group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-primary/30 hover:shadow-md' : ''
      } ${isCancelled ? 'opacity-60' : ''}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <MeetingStatusBadge status={live ? 'ONGOING' : meeting.status} />
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              meeting.visibility === 'PUBLIC'
                ? 'bg-accent text-accent-foreground'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {meeting.visibility === 'PUBLIC' ? (
              <Globe size={10} />
            ) : (
              <Lock size={10} />
            )}
            {meeting.visibility === 'PUBLIC' ? 'Public' : 'Private'}
          </span>
        </div>

        {canManage && !isCancelled && (
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground md:opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground p-0"
              aria-label="Meeting actions"
            >
              <MoreVertical size={15} />
            </Button>
            {menuOpen && (
              <MenuDropdown
                meeting={meeting}
                onEdit={onEdit}
                onCancel={onCancel}
                onDelete={onDelete}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
        {meeting.title}
      </h3>

      {/* Date block */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-muted/40">
          <span className="text-[10px] font-medium uppercase leading-none tracking-wide text-muted-foreground">
            {dayShort}
          </span>
          <span className="mt-0.5 text-sm font-bold leading-none text-foreground">
            {dayNum}
          </span>
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Clock size={12} className="shrink-0 text-muted-foreground" />
            <span className="truncate">
              {formatMeetingTime(meeting.startTime)} –{' '}
              {formatMeetingTime(meeting.endTime)}
            </span>
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays size={12} className="shrink-0" />
            <span className="truncate">
              {formatMeetingDate(meeting.startTime)} ·{' '}
              {formatMeetingDuration(meeting.startTime, meeting.endTime)}
            </span>
          </p>
        </div>
      </div>

      {/* Location / link */}
      {(meeting.location || meeting.link) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          {meeting.location && (
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{meeting.location}</span>
            </span>
          )}
          {meeting.link && (
            <a
              href={meeting.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <Video size={12} />
              Join meeting
            </a>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
        {meeting.attendees.length > 0 ? (
          <div className="flex min-w-0 items-center gap-2">
            <AvatarStack users={meeting.attendees.map((a) => a.user)} max={5} />
            <span className="text-xs text-muted-foreground">
              {meeting.attendees.length}{' '}
              {meeting.attendees.length === 1 ? 'attendee' : 'attendees'}
            </span>
          </div>
        ) : (
          <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <Users size={12} className="shrink-0" />
            <span className="truncate">
              {meeting.visibility === 'PUBLIC'
                ? 'Open to all workspace members'
                : 'No attendees'}
            </span>
          </span>
        )}
        <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
          {formatMeetingDuration(meeting.startTime, meeting.endTime)}
        </span>
      </div>
    </div>
  );
}

// ─── MenuDropdown ─────────────────────────────────────────────────────────────

function MenuDropdown({
  meeting,
  onEdit,
  onCancel,
  onDelete,
  onClose,
}: {
  meeting: Meeting;
  onEdit?: (m: Meeting) => void;
  onCancel?: (m: Meeting) => void;
  onDelete?: (m: Meeting) => void;
  onClose: () => void;
}) {
  const item = (label: string, action: () => void, danger = false) => (
    <Button
      key={label}
      variant="ghost"
      onClick={() => { action(); onClose(); }}
      className={`w-full px-3 py-1.5 text-left text-sm rounded-md transition-colors ${
        danger
          ? 'text-destructive hover:bg-destructive/10'
          : 'text-foreground hover:bg-accent'
      }`}
    >
      {label}
    </Button>
  );

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} role="presentation" />
      <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-border bg-popover p-1 shadow-md">
        {onEdit   && item('Edit', () => onEdit(meeting))}
        {onCancel && item('Cancel meeting', () => onCancel(meeting), true)}
        {onDelete && item('Delete', () => onDelete(meeting), true)}
      </div>
    </>
  );
}

// ─── AvatarStack ──────────────────────────────────────────────────────────────

function AvatarStack({
  users,
  max,
}: {
  users: { id: string; name: string | null; image: string | null }[];
  max: number;
}) {
  const visible = users.slice(0, max);
  const rest    = users.length - visible.length;
  return (
    <div className="flex -space-x-1.5">
      {visible.map((u) => (
        <div
          key={u.id}
          title={u.name ?? u.id}
          className="h-6 w-6 rounded-full border-2 border-card bg-muted overflow-hidden flex items-center justify-center text-[10px] font-semibold text-muted-foreground"
        >
          {u.image ? (
            <Image width={300} height={300} src={u.image} alt={u.name ?? ''} className="h-full w-full object-cover" />
          ) : (
            (u.name?.[0] ?? '?').toUpperCase()
          )}
        </div>
      ))}
      {rest > 0 && (
        <div className="h-6 w-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
          +{rest}
        </div>
      )}
    </div>
  );
}

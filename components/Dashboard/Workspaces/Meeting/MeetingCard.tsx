'use client';

import { useState } from 'react';
import {
  Globe,
  Lock,
  Calendar,
  Clock,
  MapPin,
  Link2,
  MoreVertical,
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

  return (
    <article
      onClick={() => onClick?.(meeting)}
      className={`group relative flex flex-col gap-3 rounded-xl border bg-card p-4 transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-ring/50 hover:shadow-sm' : ''
      } ${isCancelled ? 'opacity-60' : ''}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
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
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-accent hover:text-foreground"
              aria-label="Meeting actions"
            >
              <MoreVertical size={15} />
            </button>
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

      {/* Time row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {formatMeetingDate(meeting.startTime)}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {formatMeetingTime(meeting.startTime)} – {formatMeetingTime(meeting.endTime)}
        </span>
        <span className="rounded bg-muted px-1.5 py-0.5 font-medium">
          {formatMeetingDuration(meeting.startTime, meeting.endTime)}
        </span>
      </div>

      {/* Location / link */}
      {(meeting.location || meeting.link) && (
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {meeting.location && (
            <span className="flex items-center gap-1 truncate">
              <MapPin size={12} />
              {meeting.location}
            </span>
          )}
          {meeting.link && (
            <a
              href={meeting.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-primary hover:underline truncate"
            >
              <Link2 size={12} />
              Join meeting
            </a>
          )}
        </div>
      )}

      {/* Attendees */}
      {meeting.attendees.length > 0 && (
        <div className="flex items-center gap-1.5">
          <AvatarStack users={meeting.attendees.map((a) => a.user)} max={5} />
          <span className="text-xs text-muted-foreground">
            {meeting.attendees.length}{' '}
            {meeting.attendees.length === 1 ? 'attendee' : 'attendees'}
          </span>
        </div>
      )}

      {meeting.visibility === 'PUBLIC' && meeting.attendees.length === 0 && (
        <p className="text-xs text-muted-foreground">Open to all workspace members</p>
      )}
    </article>
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
    <button
      key={label}
      onClick={() => { action(); onClose(); }}
      className={`w-full px-3 py-1.5 text-left text-sm rounded-md transition-colors ${
        danger
          ? 'text-destructive hover:bg-destructive/10'
          : 'text-foreground hover:bg-accent'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border bg-popover p-1 shadow-md">
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
'use client';

import { X, Calendar, Clock, MapPin, Link2 } from 'lucide-react';
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
  meeting: Meeting | null;
  open: boolean;
  onClose: () => void;
  isAdmin: boolean;
  currentUserId: string;
  onEdit?: (meeting: Meeting) => void;
  onCancel?: (meeting: Meeting) => void;
}

export function MeetingDetailModal({
  meeting, open, onClose, isAdmin, currentUserId, onEdit, onCancel,
}: Props) {
  if (!open || !meeting) return null;

  const live       = isMeetingLive(meeting.startTime, meeting.endTime);
  const canManage  = isAdmin || meeting.createdById === currentUserId;
  const isCancelled = meeting.status === 'CANCELLED';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-lg max-h-[95dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <MeetingStatusBadge status={live ? 'ONGOING' : meeting.status} />
              <span className="text-xs text-muted-foreground">
                {meeting.visibility === 'PUBLIC' ? '🌐 Public' : '🔒 Private'}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-foreground leading-tight">
              {meeting.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="divide-y divide-border">
          {/* Time */}
          <section className="px-5 py-4 space-y-1">
            <InfoRow icon={<Calendar size={15} />} >
              {formatMeetingDate(meeting.startTime)}
            </InfoRow>
            <InfoRow icon={<Clock size={15} />}>
              {formatMeetingTime(meeting.startTime)} – {formatMeetingTime(meeting.endTime)}{' '}
              <span className="text-muted-foreground">
                ({formatMeetingDuration(meeting.startTime, meeting.endTime)})
              </span>
            </InfoRow>
          </section>

          {/* Location / link */}
          {(meeting.link || meeting.location) && (
            <section className="px-5 py-4 space-y-1">
              {meeting.link && (
                <InfoRow icon={<Link2 size={15} />}>
                  <a
                    href={meeting.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {meeting.link}
                  </a>
                </InfoRow>
              )}
              {meeting.location && (
                <InfoRow icon={<MapPin size={15} />}>
                  {meeting.location}
                </InfoRow>
              )}
            </section>
          )}

          {/* Description */}
          {meeting.description && (
            <section className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">About</p>
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {meeting.description}
              </p>
            </section>
          )}

          {/* Attendees */}
          <section className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {meeting.visibility === 'PUBLIC'
                ? `Attendees (${meeting.attendees.length || 'open to all'})`
                : `Attendees (${meeting.attendees.length})`}
            </p>
            {meeting.visibility === 'PUBLIC' && meeting.attendees.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This is a public meeting — all workspace members can join.
              </p>
            ) : (
              <div className="space-y-2">
                {meeting.attendees.map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                      {a.user.image
                        ? <Image width={200}
                         height={200} src={a.user.image} alt={a.user.name ?? ''} className="h-full w-full object-cover" />
                        : (a.user.name?.[0] ?? '?').toUpperCase()
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.user.name ?? a.user.email}</p>
                      <p className="text-xs text-muted-foreground truncate">{a.user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Organizer */}
          <section className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Organized by</p>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {meeting.createdBy.image
                  ? <Image width={200}
                   height={200} src={meeting.createdBy.image} alt={meeting.createdBy.name ?? ''} className="h-full w-full object-cover" />
                  : (meeting.createdBy.name?.[0] ?? '?').toUpperCase()
                }
              </div>
              <span className="text-sm text-foreground">{meeting.createdBy.name ?? meeting.createdBy.email}</span>
            </div>
          </section>
        </div>

        {/* Footer */}
        {(canManage && !isCancelled) || meeting.link ? (
          <div className="sticky bottom-0 border-t bg-card px-5 py-4 flex gap-3">
            {meeting.link && (
              <a
                href={meeting.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Join meeting
              </a>
            )}
            {canManage && !isCancelled && (
              <>
                {onEdit && (
                  <button
                    onClick={() => onEdit(meeting)}
                    className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    Edit
                  </button>
                )}
                {onCancel && (
                  <button
                    onClick={() => onCancel(meeting)}
                    className="rounded-lg border border-destructive/30 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <span className="text-sm text-foreground">{children}</span>
    </div>
  );
}
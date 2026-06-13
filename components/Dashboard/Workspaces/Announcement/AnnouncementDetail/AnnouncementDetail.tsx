'use client';

import { ArrowLeft, Pin, Globe, Lock, FolderOpen, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAnnouncement } from '@/hooks/useAnnouncement';
import { AnnouncementDetailSkeleton } from './AnnouncementDetailsSkeleton';
import { AnnouncementAuthor } from './AnnouncementAuthor';
import { AnnouncementTargets } from './AnnouncementTargets';

interface AnnouncementDetailProps {
  id: string;
  workspaceSlug: string;
}

/**
 * Announcement detail feature root.
 * Wires useAnnouncement → AnnouncementAuthor, AnnouncementTargets, and inline content.
 */
export function AnnouncementDetail({ id, workspaceSlug }: AnnouncementDetailProps) {
    console.log(id)
  const { data: announcement, isLoading, isError } = useAnnouncement(id);

  if (isLoading) return <AnnouncementDetailSkeleton />;

  if (isError || !announcement) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <User className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Announcement not found</p>
        <p className="text-xs text-muted-foreground">
          This announcement may have been deleted or you don&apos;t have access.
        </p>
      </div>
    );
  }

  const isPrivate   = announcement.visibility === 'PRIVATE';
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(announcement.createdAt));

  const wasEdited =
    announcement.updatedAt &&
    announcement.updatedAt !== announcement.createdAt;

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Back nav ── */}
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/dashboard/workspaces/${workspaceSlug}/announcements`}
          className={cn(
            'group mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground',
            'transition-colors hover:text-foreground',
          )}
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to announcements
        </Link>

        {/* ── Main card ── */}
        <article className="rounded-2xl border border-border bg-card shadow-(--shadow-card)">

          {/* ── Accent bar (pinned = primary, private = muted) ── */}
          <div
            className={cn(
              'h-1 w-full rounded-t-2xl',
              announcement.isPinned ? 'bg-primary' : 'bg-border',
            )}
          />

          <div className="p-6 sm:p-8">

            {/* ── Badge row ── */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {announcement.isPinned && (
                <span className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5',
                  'bg-primary/10 text-primary text-xs font-medium',
                )}>
                  <Pin className="size-3" />
                  Pinned
                </span>
              )}

              <span className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                isPrivate
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
              )}>
                {isPrivate ? <Lock className="size-3" /> : <Globe className="size-3" />}
                {isPrivate ? 'Private' : 'Public'}
              </span>

              {announcement.project && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                  <FolderOpen className="size-3" />
                  Project scoped
                </span>
              )}
            </div>

            {/* ── Title ── */}
            <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {announcement.title}
            </h1>

            {/* ── Author + meta row ── */}
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <AnnouncementAuthor user={announcement.createdBy} />

              <div className="flex flex-col gap-1.5 sm:items-end">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  {formattedDate}
                </span>
                {wasEdited && (
                  <span className="text-xs text-muted-foreground">
                    Edited {new Intl.DateTimeFormat('en-US', {
                      dateStyle: 'medium',
                    }).format(new Date(announcement.updatedAt))}
                  </span>
                )}
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="mb-6 h-px bg-border" />

            {/* ── Content body ── */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {/* Renders content as pre-formatted paragraphs — swap for MDX/rich text renderer if needed */}
              {announcement.content.split('\n').map((paragraph, i) =>
                paragraph.trim() ? (
                  <p
                    key={i}
                    className="mb-4 text-sm leading-relaxed text-foreground last:mb-0"
                  >
                    {paragraph}
                  </p>
                ) : (
                  <div key={i} className="mb-4" />
                ),
              )}
            </div>
          </div>

          {/* ── Targets footer (private only) ── */}
          {isPrivate && announcement.targets.length > 0 && (
            <div className="border-t border-border px-6 py-5 sm:px-8">
              <AnnouncementTargets targets={announcement.targets} />
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
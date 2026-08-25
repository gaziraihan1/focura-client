'use client';

import { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Globe, Lock, Pin, Pencil, Trash2, Loader2, Megaphone, ArrowRight } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/shared/Avatar';
import type { Announcement } from '@/types/announcement.types';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { stripTokens } from '@/utils/announcement.utils';

interface AnnouncementCardProps {
  announcement: Announcement;
  canManage:    boolean;
  isDeleting:   boolean;
  isPinning:    boolean;
  onClick:      () => void;
  onEdit?:      () => void;
  onDelete:     (e: React.MouseEvent) => void;
  onTogglePin:  (e: React.MouseEvent) => void;
  index:        number;
}


// oxlint-disable-next-line react-doctor/prefer-explicit-variants -- loading-state flags render distinct sub-states
export function AnnouncementCard({
  announcement,
  canManage,
  isDeleting,
  isPinning,
  onClick,
  onEdit,
  onDelete,
  onTogglePin,
  index,
}: AnnouncementCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isPublic = announcement.visibility === 'PUBLIC';
  const timeAgo  = formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true });
  const preview  = stripTokens(announcement.content);
  const isLong   = preview.length >= 50;
  const shown    = isLong ? `${preview.slice(0, 50)}...` : preview;

  // Show an "Edited" chip when the announcement was actually updated
  // (tolerance avoids false positives from identical create/update timestamps).
  const isEdited =
    new Date(announcement.updatedAt).getTime() -
      new Date(announcement.createdAt).getTime() >
    1000;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(e);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmOpen(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -16, transition: { duration: 0.18 } }}
        transition={{ duration: 0.22, ease: 'easeOut', delay: index * 0.04 }}
        onClick={onClick}
        role="group"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={cn(
          'group relative flex flex-col gap-3 p-5 rounded-xl cursor-pointer overflow-hidden',
          'border border-border bg-card',
          'hover:border-primary/30 hover:shadow-md hover:shadow-primary/5',
          'transition-all duration-200',
          announcement.isPinned && 'border-amber-500/30 bg-amber-500/5',
        )}
      >
        {/* Pinned left accent bar */}
        {announcement.isPinned && (
          <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-linear-to-b from-amber-500 to-amber-400/30" />
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={cn(
              'shrink-0 flex h-8 w-8 items-center justify-center rounded-lg',
              announcement.isPinned
                ? 'bg-amber-500/15 text-amber-500'
                : 'bg-primary/10 text-primary',
            )}>
              <Megaphone className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
              {announcement.title}
            </h3>
          </div>

          <span className={cn(
            'shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border',
            isPublic
              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
              : 'bg-primary/10 text-primary border-primary/20',
          )}>
            {isPublic
              ? <Globe className="w-2.5 h-2.5" />
              : <Lock  className="w-2.5 h-2.5" />}
            {isPublic ? 'Public' : 'Private'}
          </span>
        </div>

        {/* Content preview */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {shown}
          {isLong && (
            <span className="inline-flex items-center gap-0.5 font-medium text-primary/80 hover:text-primary transition-colors">
              {' '}read more <ArrowRight className="w-3 h-3" />
            </span>
          )}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar
              name={announcement.createdBy.name}
              image={announcement.createdBy.image}
              size="sm"
            />
            <span className="text-[11px] text-muted-foreground truncate">
              {announcement.createdBy.name}
            </span>
            <span className="text-muted-foreground/40 text-[11px]">·</span>
            <span className="text-[11px] text-muted-foreground/70 shrink-0 inline-flex items-center gap-1">
              {timeAgo}
              {isEdited && (
                <span
                  title={format(new Date(announcement.updatedAt), 'MMM d, yyyy · h:mm a')}
                  className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  Edited
                </span>
              )}
            </span>
          </div>

          {canManage && (
            <div className="flex items-center gap-0.5 md:opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                  title="Edit"
                  aria-label="Edit announcement"
                  className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={(e) => { e.stopPropagation(); onTogglePin(e); }}
                disabled={isPinning}
                title={announcement.isPinned ? 'Unpin' : 'Pin'}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  announcement.isPinned
                    ? 'text-amber-500 hover:bg-amber-500/10'
                    : 'text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10',
                )}
              >
                {isPinning
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Pin     className="w-3.5 h-3.5" />}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleDeleteClick}
                disabled={isDeleting}
                title="Delete"
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
              >
                {isDeleting
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Trash2  className="w-3.5 h-3.5" />}
              </motion.button>
            </div>
          )}
        </div>

        {/* Recipients for private announcements */}
        {!isPublic && announcement.targets.length > 0 && (
          <div className="flex items-center gap-1.5 pt-2 border-t border-border/40">
            <div className="flex -space-x-1">
              {announcement.targets.slice(0, 4).map((t) => (
                <Avatar key={t.userId} name={t.user.name} image={t.user.image} size="sm" />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">
              {announcement.targets.length} recipient{announcement.targets.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </motion.div>

      {confirmOpen && (
        <DeleteConfirmModal
          title={announcement.title}
          isDeleting={isDeleting}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Lock, Pin, Trash2, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/Shared/Avatar';
import type { Announcement } from '@/types/announcement.types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface AnnouncementCardProps {
  announcement: Announcement;
  canManage:    boolean;
  isDeleting:   boolean;
  isPinning:    boolean;
  onClick:      () => void;
  onDelete:     (e: React.MouseEvent) => void;
  onTogglePin:  (e: React.MouseEvent) => void;
  index:        number;
}

/** Strip format tokens for the plain-text card preview */
function stripTokens(raw: string): string {
  return raw
    .replace(/\/\/([\s\S]*?)\//g,           '$1')
    .replace(/\*\*([\s\S]*?)\*\*/g,         '$1')
    .replace(/\$\$([\s\S]*?)\$\$/g,         '$1')
    .replace(/\{([^}|]+)(?:\|([^}]*))?\}/g, (_, url, label) => label ?? url)
    .replace(/>/g, ' ');
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function AnnouncementCard({
  announcement,
  canManage,
  isDeleting,
  isPinning,
  onClick,
  onDelete,
  onTogglePin,
  index,
}: AnnouncementCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isPublic = announcement.visibility === 'PUBLIC';
  const timeAgo  = formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true });
  const preview  = stripTokens(announcement.content);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(e);
    // modal stays open while isDeleting — parent unmounts card on success
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
        className={cn(
          'group relative flex flex-col gap-3 p-5 rounded-xl cursor-pointer',
          'border border-border bg-card',
          'hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5',
          'transition-all duration-200',
          announcement.isPinned && 'border-amber-500/30 bg-amber-500/5',
        )}
      >
        {/* Pin strip */}
        {announcement.isPinned && (
          <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-linear-to-r from-amber-500/60 to-amber-400/20" />
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 min-w-0">
            {announcement.isPinned && (
              <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 fill-amber-500/30" />
            )}
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
          {preview.length >= 50 ? `${preview.slice(0, 50)}...` : preview}
          {preview.length >= 50 && (
            <span className="opacity-70 hover:opacity-100 transition-all hover:text-accent-foreground/70">
              {' '}read more
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
            <span className="text-[11px] text-muted-foreground/70 shrink-0">
              {timeAgo}
            </span>
          </div>

          {canManage && (
            <div className="flex items-center gap-0.5 md:opacity-0 group-hover:opacity-100 transition-opacity">
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

        {/* Private recipients */}
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

      {/* Confirm delete modal — rendered outside the card so clicks don't bubble */}
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
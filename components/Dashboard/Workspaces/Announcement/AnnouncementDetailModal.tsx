'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Lock, Pin, Calendar, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/Shared/Avatar';
import { parseAnnouncement } from '@/utils/announcement.utils';
import type { Announcement } from '@/types/announcement.types';
import Link from 'next/link';

interface AnnouncementDetailModalProps {
  announcement: Announcement | null;
  isOpen:       boolean;
  onClose:      () => void;
}

function RenderedContent({ raw }: { raw: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = useCallback((val: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(val);
      setTimeout(() => setCopied(null), 1800);
    });
  }, []);

  const tokens = parseAnnouncement(raw);

  return (
    <p className="text-sm text-foreground/85 leading-relaxed wrap-break-word">
      {tokens.map((token, i): React.ReactNode => {
        if (token.type === 'text')
          return <span key={i}>{token.value}</span>;

        if (token.type === 'italic')
          return <em key={i} className="italic">{token.value}</em>;

        if (token.type === 'bold')
          return <strong key={i} className="font-semibold">{token.value}</strong>;

        if (token.type === 'break')
          return <br key={i} />;

        if (token.type === 'mono')
          return (
            <span key={i} className="inline-flex items-center gap-1">
              <code className="px-1.5 py-0.5 rounded bg-muted text-[0.8em] font-mono border border-border/60 text-foreground/80">
                {token.value}
              </code>
              <button
                type="button"
                onClick={() => handleCopy(token.value)}
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                title="Copy"
              >
                {copied === token.value
                  ? <Check className="w-3 h-3 text-green-500" />
                  : <Copy  className="w-3 h-3" />}
              </button>
            </span>
          );

        if (token.type === 'link')
          return (
            <Link
              key={i}
              href={token.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            >
              {token.label}
            </Link>
          );

        return null;
      })}
    </p>
  );
}

export function AnnouncementDetailModal({
  announcement,
  isOpen,
  onClose,
}: AnnouncementDetailModalProps) {
  if (!announcement) return null;

  const isPublic = announcement.visibility === 'PUBLIC';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={cn(
                'relative w-full max-w-lg max-h-[90vh] flex flex-col',
                'rounded-2xl bg-card border border-border shadow-2xl shadow-black/20',
                announcement.isPinned && 'border-amber-500/30',
              )}
            >
              {announcement.isPinned && (
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" />
              )}

              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border shrink-0">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {announcement.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        <Pin className="w-2.5 h-2.5" />
                        Pinned
                      </span>
                    )}
                    <span className={cn(
                      'inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                      isPublic
                        ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-primary bg-primary/10 border-primary/20',
                    )}>
                      {isPublic
                        ? <Globe className="w-2.5 h-2.5" />
                        : <Lock  className="w-2.5 h-2.5" />}
                      {isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground leading-snug">
                    {announcement.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <RenderedContent raw={announcement.content} />

                {/* Meta */}
                <div className="flex items-center gap-4 pt-4 border-t border-border flex-wrap">
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={announcement.createdBy.name}
                      image={announcement.createdBy.image}
                      size="sm"
                    />
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        {announcement.createdBy.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Author</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(announcement.createdAt), 'MMM d, yyyy · h:mm a')}
                  </div>
                </div>

                {/* Private recipients */}
                {!isPublic && announcement.targets.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Recipients ({announcement.targets.length})
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {announcement.targets.map((t) => (
                        <div
                          key={t.userId}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/40"
                        >
                          <Avatar name={t.user.name} image={t.user.image} size="sm" />
                          <span className="text-xs text-foreground truncate">{t.user.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
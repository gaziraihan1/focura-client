'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnnouncementCard }        from './AnnouncementCard';
import { AnnouncementDetailModal } from './AnnouncementDetailModal';
import type { Announcement, AnnouncementPagination } from '@/types/announcement.types';

interface AnnouncementListProps {
  announcements: Announcement[];
  pagination:    AnnouncementPagination;
  canManage:     boolean;
  isLoading:     boolean;
  deletingId:    string | null;
  pinningId:     string | null;
  currentPage:   number;
  onDelete:      (id: string) => void;
  onTogglePin:   (id: string) => void;
  onPageChange:  (page: number) => void;
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Megaphone className="w-7 h-7 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground">No announcements yet</p>
      <p className="text-xs text-muted-foreground mt-1.5 max-w-55">
        Workspace announcements will appear here.
      </p>
    </motion.div>
  );
}

function PaginationBar({
  pagination,
  currentPage,
  onPageChange,
}: {
  pagination:  AnnouncementPagination;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <p className="text-xs text-muted-foreground">
        Page {currentPage} of {pagination.totalPages}
        {' · '}
        <span className="font-medium text-foreground">{pagination.totalCount}</span> total
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrev}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNext}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function AnnouncementList({
  announcements,
  pagination,
  canManage,
  isLoading,
  deletingId,
  pinningId,
  currentPage,
  onDelete,
  onTogglePin,
  onPageChange,
}: AnnouncementListProps) {
  const [selected, setSelected] = useState<Announcement | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (announcements.length === 0) return <EmptyState />;

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {announcements.map((a, i) => (
            <AnnouncementCard
              key={a.id}
              announcement={a}
              index={i}
              canManage={canManage}
              isDeleting={deletingId === a.id}
              isPinning={pinningId  === a.id}
              onClick={() => setSelected(a)}
              onDelete={(e)     => { e.stopPropagation(); onDelete(a.id); }}
              onTogglePin={(e)  => { e.stopPropagation(); onTogglePin(a.id); }}
            />
          ))}
        </AnimatePresence>
      </div>

      <PaginationBar
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />

      <AnnouncementDetailModal
        announcement={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
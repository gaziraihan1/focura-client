'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { AnnouncementCard }        from './AnnouncementCard';
import { AnnouncementDetailModal } from './AnnouncementDetailModal';
import { Pagination }              from '@/components/Shared/Pagination'; 
import type { Announcement, AnnouncementPagination } from '@/types/announcement.types';
import EmptyState from '../EmptyState';

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
        <AnimatePresence>
          {announcements.map((a, i) => (
            <AnnouncementCard
              key={a.id}
              announcement={a}
              index={i}
              canManage={canManage}
              isDeleting={deletingId === a.id}
              isPinning={pinningId  === a.id}
              onClick={() => setSelected(a)}
              onDelete={(e)    => { e.stopPropagation(); onDelete(a.id); }}
              onTogglePin={(e) => { e.stopPropagation(); onTogglePin(a.id); }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Your existing Pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
        itemsPerPage={pagination.pageSize}
        totalItems={pagination.totalCount}
      />

      <AnnouncementDetailModal
        announcement={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
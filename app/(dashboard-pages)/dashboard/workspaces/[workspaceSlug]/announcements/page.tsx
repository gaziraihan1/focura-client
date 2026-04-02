'use client';

import { useParams } from 'next/navigation';
import { Plus, Megaphone } from 'lucide-react';
import { AnnouncementList }    from '@/components/Dashboard/Workspaces/Announcement/AnnouncementList';
import { AnnouncementFilters } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementFilters';
import { AnnouncementModal }   from '@/components/Dashboard/Workspaces/Announcement/AnnouncementModal';
import { useAnnouncementPage } from '@/hooks/useAnnouncementPage';

export default function AnnouncementsPage() {
  const { workspaceSlug } = useParams();

  const {
    data, isLoading, filters,
    setVisibility, setIsPinned, setPage, resetFilters, activeFiltersCount,
    canManage, members,
    showModal, openModal, handleClose,
    form, isValid, isSubmitting,
    setTitle, setContent, setVisibilityField,
    setIsPinnedField, setProjectId, toggleTarget,
    handleSubmit,
    deletingId, pinningId, handleDelete, handleTogglePin,
  } = useAnnouncementPage(workspaceSlug as string);

  return (
    <div className="space-y-6 px-2 sm:px-4 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Megaphone className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Announcements</h1>
          {data?.pagination.totalCount !== undefined && (
            <span className="text-sm text-muted-foreground">
              ({data.pagination.totalCount})
            </span>
          )}
        </div>
        {canManage && (
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> New
          </button>
        )}
      </div>

      <AnnouncementFilters
        visibility={filters.visibility ?? 'ALL'}
        isPinned={filters.isPinned}
        activeFiltersCount={activeFiltersCount}
        onVisibilityChange={setVisibility}
        onIsPinnedChange={setIsPinned}
        onReset={resetFilters}
      />

      <AnnouncementList
        announcements={data?.data ?? []}
        pagination={data?.pagination ?? {
          page: 1, pageSize: 10, totalCount: 0,
          totalPages: 0, hasNext: false, hasPrev: false,
        }}
        canManage={canManage}
        isLoading={isLoading}
        deletingId={deletingId}
        pinningId={pinningId}
        currentPage={filters.page ?? 1}
        onDelete={handleDelete}
        onTogglePin={handleTogglePin}
        onPageChange={setPage}
      />

      <AnnouncementModal
        isOpen={showModal}
        isLoading={isSubmitting}
        isValid={isValid}
        form={form}
        members={members.map((m) => ({
          userId: m.id,
          user: { id: m.id, name: m.name, image: m.image ?? null },
        }))}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onVisibilityChange={setVisibilityField}
        onIsPinnedChange={setIsPinnedField}
        onProjectChange={setProjectId}
        onTargetToggle={toggleTarget}
      />
    </div>
  );
}
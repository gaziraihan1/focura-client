// app/dashboard/workspaces/[workspaceSlug]/announcements/page.tsx
"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Plus, Megaphone } from "lucide-react";
import { AnnouncementList }    from "@/components/Dashboard/Workspaces/Announcement/AnnouncementList";

import { AnnouncementFilters } from "@/components/Dashboard/Workspaces/Announcement/AnnouncementFilters";
import { useAnnouncementFilters, useAnnouncements, useCreateAnnouncement, useDeleteAnnouncement, useTogglePinAnnouncement } from "@/hooks/useAnnouncement";
import { useWorkspace, useWorkspaceRole }        from "@/hooks/useWorkspace";
import { useTeamMembers } from "@/hooks/useTeam";
import { AnnouncementModal } from "@/components/Dashboard/Workspaces/Announcement/AnnouncementModal";

export default function AnnouncementsPage() {
  const { workspaceSlug } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pinningId,  setPinningId]  = useState<string | null>(null);

  const { data: workspace } = useWorkspace(workspaceSlug as string);
  const workspaceId = workspace?.id;

  const { filters, setVisibility, setIsPinned, setPage, resetFilters, activeFiltersCount } = useAnnouncementFilters();
  const { data, isLoading } = useAnnouncements(workspaceId ?? "", filters);
  const workspaceRole = useWorkspaceRole(workspaceId ?? "");
  const canManage = workspaceRole.isOwner || workspaceRole.isAdmin;

  const { data: members = [] } = useTeamMembers(workspaceId);

  const createAnnouncement = useCreateAnnouncement(workspaceId ?? "");
  const deleteAnnouncement = useDeleteAnnouncement(workspaceId ?? "");
  const togglePin          = useTogglePinAnnouncement(workspaceId ?? "");

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await deleteAnnouncement.mutateAsync(id); }
    finally { setDeletingId(null); }
  };

  const handleTogglePin = async (id: string) => {
    setPinningId(id);
    try { await togglePin.mutateAsync(id); }
    finally { setPinningId(null); }
  };

  return (
    <div className="space-y-6 px-2 sm:px-4 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Megaphone className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Announcements</h1>
          {data?.pagination.totalCount !== undefined && (
            <span className="text-sm text-muted-foreground">({data.pagination.totalCount})</span>
          )}
        </div>
        {canManage && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> New
          </button>
        )}
      </div>

      <AnnouncementFilters
        visibility={filters.visibility ?? "ALL"}
        isPinned={filters.isPinned}
        activeFiltersCount={activeFiltersCount}
        onVisibilityChange={setVisibility}
        onIsPinnedChange={setIsPinned}
        onReset={resetFilters}
      />

      <AnnouncementList
        announcements={data?.data ?? []}
        pagination={data?.pagination ?? { page: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasNext: false, hasPrev: false }}
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
        onClose={() => setShowModal(false)}
        onSubmit={async (data) => { await createAnnouncement.mutateAsync(data); setShowModal(false); }}
        isLoading={createAnnouncement.isPending}
        members={members.map(m => ({ userId: m.id, user: { id: m.id, name: m.name, image: m.image ?? null } }))}
      />
    </div>
  );
}
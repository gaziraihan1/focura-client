"use client";

import { useState, useMemo } from "react";
import { Plus, Megaphone, Search, AlertCircle, Clock } from "lucide-react";
import { useAnnouncementFilters, useProjectAnnouncements, useDeleteAnnouncement, useTogglePinAnnouncement } from "@/hooks/useAnnouncement";
import { ProjectDetails, useProjectDetailsBySlug } from "@/hooks/useProjects";
import { useWorkspaceRole } from "@/hooks/useWorkspace";
import { useUserProfile } from "@/hooks/useUser";
import { useTeamMembers } from "@/hooks/useTeam";
import { useAnnouncementModal } from "@/hooks/useAnnouncementPage";
import { AnnouncementModal } from "@/components/Dashboard/Workspaces/Announcement/AnnouncementModal";
import { FilterBar, FilterType } from "@/components/Dashboard/Workspaces/project/Announcements/FilterBar";
import { EmptyAnnouncements } from "@/components/Dashboard/Workspaces/project/Announcements/EmptyAnnouncements";
import { PinnedBanner } from "@/components/Dashboard/Workspaces/project/Announcements/PinnedBanner";
import { CardSkeleton } from "@/components/Dashboard/Workspaces/project/Announcements/CardSkeleton";
import { AnnouncementCard } from "@/components/Dashboard/Workspaces/project/Announcements/AnnouncementCard";
import { Pagination } from "@/components/Dashboard/Workspaces/project/Announcements/Pagination";
import { AnnouncementDetailModal } from "@/components/Dashboard/Workspaces/Announcement/AnnouncementDetailModal";
import type { Announcement } from "@/types/announcement.types";

interface AnnouncementsPageContentProps {
  projectSlug: string;
}

export function AnnouncementsPageContent({ projectSlug }: AnnouncementsPageContentProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pinningId, setPinningId] = useState<string | null>(null);
  const [detailAnnouncement, setDetailAnnouncement] = useState<Announcement | null>(null);

  const { data: project } = useProjectDetailsBySlug(projectSlug);
  const workspaceSlug = project?.workspace?.slug ?? "";
  const workspaceId = project?.workspace?.id ?? "";
  const projectId = project?.id ?? "";

  const { filters, setPage } = useAnnouncementFilters();
  const { data: announcementData, isLoading: announcementsLoading, isFetching } = useProjectAnnouncements(workspaceSlug, projectId, filters);
  const isLoading = !project || announcementsLoading;

  const { open: openModal, edit: openEdit, modalProps } = useAnnouncementModal(workspaceSlug, projectId || null);

  const workspaceRole = useWorkspaceRole(workspaceId);
  const { userId } = useUserProfile();

  const currentProjectMember = useMemo(
    () => project?.members?.find((m) => m.userId === userId || m.user?.id === userId),
    [project?.members, userId],
  );
  const isArchived = project?.status === "ARCHIVED";

  const canManage = workspaceRole.isOwner || workspaceRole.isAdmin || currentProjectMember?.role === "MANAGER";

  const { data: members = [] } = useTeamMembers(workspaceId || undefined);

  const deleteMutation = useDeleteAnnouncement(workspaceSlug);
  const pinMutation = useTogglePinAnnouncement(workspaceSlug);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await deleteMutation.mutateAsync(id); } finally { setDeletingId(null); }
  };

  const handleTogglePin = async (id: string) => {
    setPinningId(id);
    try { await pinMutation.mutateAsync(id); } finally { setPinningId(null); }
  };

  const filtered = useMemo(() => {
    let list: Announcement[] = announcementData?.data ?? [];
    if (filterType === "pinned") list = list.filter((a) => a.isPinned);
    if (filterType === "public") list = list.filter((a) => a.visibility === "PUBLIC");
    if (filterType === "private") list = list.filter((a) => a.visibility === "PRIVATE");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.createdBy?.name?.toLowerCase().includes(q));
    }
    return list;
  }, [announcementData?.data, filterType, search]);

  const unpinned = filtered.filter((a) => !a.isPinned);
  const isFiltered = !!search.trim() || filterType !== "all";
  const pagination = announcementData?.pagination ?? { page: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasNext: false, hasPrev: false };
  const accentColor = (project as ProjectDetails)?.color ?? "#667eea";

  return (
    <div className="max-w-3xl space-y-6 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Megaphone size={14} style={{ color: accentColor }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>Announcements</span>
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">{project?.name ?? "Project"} Updates</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pagination.totalCount > 0 ? `${pagination.totalCount} announcement${pagination.totalCount !== 1 ? "s" : ""}` : "Keep your team informed with announcements"}
          </p>
        </div>
        {canManage && !isArchived && (
          <button onClick={openModal} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 self-start sm:self-auto">
            <Plus size={15} /> New Announcement
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input aria-label="Search announcements…" type="text" placeholder="Search announcements…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition" />
        </div>
        <FilterBar active={filterType} onChange={(f) => { setFilterType(f); setPage(1); }} total={pagination.totalCount} isFetching={isFetching} />
      </div>

      {isLoading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyAnnouncements filtered={isFiltered} canManage={canManage} onNew={openModal} />
      ) : (
        <div className="space-y-6">
          {filterType !== "pinned" && (
            <PinnedBanner announcements={filtered} canManage={canManage} pinningId={pinningId} deletingId={deletingId} onTogglePin={handleTogglePin} onDelete={handleDelete} isArchived={isArchived} />
          )}
          {(filterType === "pinned" ? filtered : unpinned).length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-muted-foreground/50" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">{filterType === "pinned" ? "Pinned" : "Recent"}</span>
              </div>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}
          <div className="space-y-4">
            {(filterType === "pinned" ? filtered : unpinned).map((a) => (
              <AnnouncementCard key={a.id} announcement={a} canManage={canManage} pinningId={pinningId} deletingId={deletingId} onTogglePin={handleTogglePin} onDelete={handleDelete} onOpen={setDetailAnnouncement} onEdit={canManage && !isArchived ? () => openEdit(a) : undefined} isArchived={isArchived} />
            ))}
          </div>
          <Pagination pagination={pagination} currentPage={filters.page ?? 1} onPageChange={setPage} />
        </div>
      )}

      {!isLoading && !announcementData && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive text-sm">
          <AlertCircle size={15} className="shrink-0" /> Failed to load announcements. Please refresh the page.
        </div>
      )}

      <AnnouncementDetailModal announcement={detailAnnouncement} isOpen={!!detailAnnouncement} onClose={() => setDetailAnnouncement(null)} />

      <AnnouncementModal {...modalProps} members={members.map((m) => ({ userId: m.id, user: { id: m.id, name: m.name, image: m.image ?? null } }))} lockedProjectId={projectId || null} />
    </div>
  );
}

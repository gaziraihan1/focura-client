"use client";

import { TeamTaskFiltersBar } from "@/components/Dashboard/TeamTask/TeamTaskFiltersBar";
import { TeamTasksPageHeader } from "@/components/Dashboard/TeamTask/TeamTasksPageHeader";
import { TeamTasksStats } from "@/components/Dashboard/TeamTask/TeamTasksStats";
import { TeamTasksContent } from "@/components/Dashboard/TeamTask/TeamTasksContent";
import { useTeamTasksPage } from "@/hooks/useTeamTasksPage";

const ITEMS_PER_PAGE = 10;

export default function TeamTasksPage({
  workspaceId,
}: {
  workspaceId?: string;
}) {
  const {
    userId,
    stats,
    scope,
    setScope,
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority,
    attentionOnly,
    filteredTasks,
    paginatedTasks,
    currentPage,
    totalPages,
    totalItems,
    isLoading,
    handlePageChange,
    getSectionTitle,
    setAttentionOnly
    
  } = useTeamTasksPage({ workspaceId });

  const hasNoResults = filteredTasks.length === 0 && !!userId;

  return (
    <div className="space-y-6">
      <TeamTasksPageHeader workspaceId={workspaceId} />

      <TeamTasksStats stats={stats} />

      <TeamTaskFiltersBar
        scope={scope}
        onScopeChange={setScope}
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        attentionOnly={attentionOnly}
        onAttentionToggle={setAttentionOnly}
      />

      <TeamTasksContent
        sectionTitle={getSectionTitle()}
        tasks={paginatedTasks}
        isLoading={isLoading || !userId}
        hasNoResults={hasNoResults}
        attentionOnly={attentionOnly}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
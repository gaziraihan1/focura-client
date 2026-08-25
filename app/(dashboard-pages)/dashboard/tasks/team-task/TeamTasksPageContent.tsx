"use client";

import { TeamTaskFiltersBar } from "@/components/dashboard/team-task/TeamTaskFiltersBar";
import { TeamTasksPageHeader } from "@/components/dashboard/team-task/TeamTasksPageHeader";
import { TeamTasksStats } from "@/components/dashboard/team-task/TeamTasksStats";
import { TeamTasksContent } from "@/components/dashboard/team-task/TeamTasksContent";
import { useTeamTasksPage } from "@/hooks/useTeamTasksPage";

const ITEMS_PER_PAGE = 10;

interface TeamTasksPageContentProps {
  workspaceId?: string;
}

export function TeamTasksPageContent({ workspaceId }: TeamTasksPageContentProps) {
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
    setAttentionOnly,
    focusOnly,
    setFocusOnly

  } = useTeamTasksPage({ workspaceId });

  const hasNoResults = filteredTasks.length === 0 && !!userId;

  return (
    <div className="space-y-6 2xl:max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
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
        focusOnly={focusOnly}
        onFocusToggle={setFocusOnly}
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

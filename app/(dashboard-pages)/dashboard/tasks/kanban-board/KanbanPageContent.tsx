"use client";

import { useCallback } from "react";
import { KanbanHeader } from "@/components/dashboard/tasks/kanban/KanbanHeader";
import { ExecutionControlBar } from "@/components/dashboard/tasks/kanban/ExecutionControlBar";
import { KanbanBoard } from "@/components/dashboard/tasks/kanban/KanbanBoard";
import { InsightFooter } from "@/components/dashboard/tasks/kanban/InsightFooter";
import { KanbanInsightsButton } from "@/components/dashboard/tasks/kanban/KanbanInsightsButton";
import { TaskDetailsModal } from "@/components/dashboard/calendar/calendar-view/TaskDetailsModal";
import { useKanbanPage } from "@/hooks/useKanbanPage";

export function KanbanPageContent() {
  const {
    scope,
    setScope,
    filters,
    setFilters,
    sort,
    setSort,
    focusMode,
    setFocusMode,
    enforceWIP,
    setEnforceWIP,
    showInsights,
    setShowInsights,
    selectedTask,
    setSelectedTask,
    displayTasks,
    taskCounts,
    isLoading,
  } = useKanbanPage();

  const handleOpenInsights = useCallback(() => setShowInsights(true), [setShowInsights]);
  const handleCloseInsights = useCallback(() => setShowInsights(false), [setShowInsights]);
  const handleCloseTask = useCallback(() => setSelectedTask(null), [setSelectedTask]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <KanbanHeader
        scope={scope}
        onScopeChange={setScope}
        taskCounts={taskCounts}
        focusMode={focusMode}
        onFocusModeChange={setFocusMode}
      />

      <ExecutionControlBar
        filters={filters}
        onFiltersChange={setFilters}
        sort={sort}
        onSortChange={setSort}
        enforceWIP={enforceWIP}
        onEnforceWIPChange={setEnforceWIP}
        focusMode={focusMode}
      />

      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          tasks={displayTasks}
          sort={sort}
          enforceWIP={enforceWIP}
          focusMode={focusMode}
          onTaskClick={setSelectedTask}
          isLoading={isLoading}
        />
      </div>

      {showInsights && (
        <InsightFooter
          tasks={displayTasks}
          onClose={handleCloseInsights}
        />
      )}

      <KanbanInsightsButton
        showInsights={showInsights}
        onToggle={handleOpenInsights}
      />

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={handleCloseTask}
        />
      )}
    </div>
  );
}

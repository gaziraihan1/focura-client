"use client";

import React from "react";
import { KanbanHeader } from "@/components/Dashboard/KanbanView/KanbanHeader";
import { ExecutionControlBar } from "@/components/Dashboard/KanbanView/ExecutionControlBar";
import { KanbanBoard } from "@/components/Dashboard/KanbanView/KanbanBoard";
import { InsightFooter } from "@/components/Dashboard/KanbanView/InsightFooter";
import { KanbanInsightsButton } from "@/components/Dashboard/KanbanView/KanbanInsightsButton";
import { TaskDetailsModal } from "@/components/Dashboard/CalendarView/TaskDetailsModal";
import { useWorkspaceKanbanPage } from "@/hooks/useWorkspaceKanbanPage";

interface WorkspaceKanbanPageProps {
  params: {
    "workspace-name": string;
  };
}

export default function WorkspaceKanbanPage({
  params,
}: WorkspaceKanbanPageProps) {
  const workspaceSlug = params["workspace-name"];

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
  } = useWorkspaceKanbanPage({ workspaceSlug });

  return (
    <div className="flex flex-col -mx-4 -my-6 sm:-mx-6 lg:-mx-8 h-[calc(100vh-4rem)]">
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
          onClose={() => setShowInsights(false)}
        />
      )}

      <KanbanInsightsButton
        showInsights={showInsights}
        onToggle={() => setShowInsights(true)}
      />

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
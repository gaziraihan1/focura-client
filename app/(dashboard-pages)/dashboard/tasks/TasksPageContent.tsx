"use client";

import dynamic from "next/dynamic";
import { TasksPageHeader } from "@/components/dashboard/tasks/all-tasks/TasksPageHeader";
import { useTasksPage } from "@/hooks/useTasksPage";
import TaskQuotaDetails from "@/components/dashboard/tasks/all-tasks/TaskQuotaDetails";

const TaskStatsCards = dynamic(
  () => import("@/components/dashboard/tasks/all-tasks/TaskStatsCards").then((m) => m.TaskStatsCards),
  { ssr: false }
);

const TaskFiltersBar = dynamic(
  () => import("@/components/dashboard/tasks/all-tasks/TaskFiltersBar").then((m) => m.TaskFiltersBar),
  { ssr: false }
);

const TasksContent = dynamic(
  () => import("@/components/dashboard/tasks/all-tasks/TasksContent").then((m) => m.TasksContent),
  { ssr: false }
);

const FocusModeBanner = dynamic(
  () => import("@/components/dashboard/tasks/all-tasks/FocusModeBanner").then((m) => m.FocusModeBanner),
  { ssr: false }
);

export function TasksPageContent() {
  const {
    activeTab, searchQuery, selectedStatus, selectedPriority, currentPage, pageSize,
    sortBy, sortOrder, stats, tasks, pagination, isLoading, isError,
    handleTabChange, handleStatusChange, handlePriorityChange, handleSearchChange,
    handleSortChange, handlePageChange, handleCreateTask, focusedTask,
    activeSession, completeSession, quota, focusRequired, setFocusRequired,
  } = useTasksPage();

  return (
    <div className="space-y-6 2xl:max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      <TasksPageHeader onCreateTask={handleCreateTask} />
      <TaskQuotaDetails quota={quota} />
      {focusedTask && activeSession && (
        <FocusModeBanner task={focusedTask} onEndFocus={completeSession} sessionDuration={activeSession.duration} />
      )}

      {stats && <TaskStatsCards stats={stats} activeTab={activeTab} />}

      <TaskFiltersBar
        activeTab={activeTab} onTabChange={handleTabChange} searchQuery={searchQuery}
        onSearchChange={handleSearchChange} selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange} selectedPriority={selectedPriority}
        onPriorityChange={handlePriorityChange} sortBy={sortBy} sortOrder={sortOrder}
        onSortChange={handleSortChange} focusRequired={focusRequired}
        onFocusRequiredChange={setFocusRequired}
      />

      <TasksContent
        tasks={tasks} focusedTaskId={activeSession?.taskId}
        isLoading={isLoading} isError={isError} searchQuery={searchQuery}
        currentPage={currentPage} totalPages={pagination?.totalPages || 0}
        totalItems={pagination?.totalCount || 0} itemsPerPage={pageSize}
        onCreateTask={handleCreateTask} onPageChange={handlePageChange}
      />
    </div>
  );
}

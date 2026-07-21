"use client";

import dynamic from "next/dynamic";
import { TasksPageHeader } from "@/components/Dashboard/AllTasks/TasksPageHeader";
import { useTasksPage } from "@/hooks/useTasksPage";
import TaskQoutaDetails from "@/components/Dashboard/AllTasks/TaskQoutaDetails";

const TaskStatsCards = dynamic(
  () => import("@/components/Dashboard/AllTasks/TaskStatsCards").then((m) => m.TaskStatsCards),
  { ssr: false }
);

const TaskFiltersBar = dynamic(
  () => import("@/components/Dashboard/AllTasks/TaskFiltersBar").then((m) => m.TaskFiltersBar),
  { ssr: false }
);

const TasksContent = dynamic(
  () => import("@/components/Dashboard/AllTasks/TasksContent").then((m) => m.TasksContent),
  { ssr: false }
);

const FocusModeBanner = dynamic(
  () => import("@/components/Dashboard/AllTasks/FocusModeBanner").then((m) => m.FocusModeBanner),
  { ssr: false }
);

export default function TasksPage() {
  const {
    activeTab, searchQuery, selectedStatus, selectedPriority, currentPage, pageSize,
    sortBy, sortOrder, stats, tasks, pagination, isLoading, isError,
    handleTabChange, handleStatusChange, handlePriorityChange, handleSearchChange,
    handleSortChange, handlePageChange, handleCreateTask, focusedTask, timeRemaining,
    activeSession, completeSession, qouta, focusRequired, setFocusRequired,
  } = useTasksPage();

  return (
    <div className="space-y-6">
      <TasksPageHeader onCreateTask={handleCreateTask} />
      <TaskQoutaDetails qouta={qouta} />
      {focusedTask && activeSession && (
        <FocusModeBanner task={focusedTask} timeRemaining={timeRemaining} onEndFocus={completeSession} sessionDuration={activeSession.duration} />
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
        tasks={tasks} focusedTaskId={activeSession?.taskId} focusTimeRemaining={timeRemaining}
        isLoading={isLoading} isError={isError} searchQuery={searchQuery}
        currentPage={currentPage} totalPages={pagination?.totalPages || 0}
        totalItems={pagination?.totalCount || 0} itemsPerPage={pageSize}
        onCreateTask={handleCreateTask} onPageChange={handlePageChange}
      />
    </div>
  );
}

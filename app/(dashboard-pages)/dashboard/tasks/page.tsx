"use client";

import { TaskStatsCards } from "@/components/Dashboard/AllTasks/TaskStatsCards";
import { TaskFiltersBar } from "@/components/Dashboard/AllTasks/TaskFiltersBar";
import { TasksPageHeader } from "@/components/Dashboard/AllTasks/TasksPageHeader";
import { TasksContent } from "@/components/Dashboard/AllTasks/TasksContent";
import { useTasksPage, PAGE_SIZE } from "@/hooks/useTasksPage";

export default function TasksPage() {
  const {
    activeTab,
    searchQuery,
    selectedStatus,
    selectedPriority,
    currentPage,
    stats,
    paginatedTasks,
    totalItems,
    totalPages,
    isLoading,
    isError,
    handleTabChange,
    handleStatusChange,
    handlePriorityChange,
    handleSearchChange,
    handlePageChange,
    handleCreateTask,
  } = useTasksPage();

  return (
    <div className="space-y-6">
      <TasksPageHeader onCreateTask={handleCreateTask} />

      {stats && <TaskStatsCards stats={stats} activeTab={activeTab} />}

      <TaskFiltersBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        selectedPriority={selectedPriority}
        onPriorityChange={handlePriorityChange}
      />

      <TasksContent
        tasks={paginatedTasks}
        isLoading={isLoading}
        isError={isError}
        searchQuery={searchQuery}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={PAGE_SIZE}
        onCreateTask={handleCreateTask}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
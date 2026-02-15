"use client";
import { TaskStatsCards } from "@/components/Dashboard/AllTasks/TaskStatsCards";
import { TaskFiltersBar } from "@/components/Dashboard/AllTasks/TaskFiltersBar";
import { TasksPageHeader } from "@/components/Dashboard/AllTasks/TasksPageHeader";
import { TasksContent } from "@/components/Dashboard/AllTasks/TasksContent";
import { useTasksPage } from "@/hooks/useTasksPage";

export default function TasksPage() {
  const {
    activeTab,
    searchQuery,
    selectedStatus,
    selectedPriority,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    stats,
    tasks,
    pagination,
    isLoading,
    isError,
    handleTabChange,
    handleStatusChange,
    handlePriorityChange,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleCreateTask,
    tasksResponse
  } = useTasksPage();
  console.log(tasksResponse, tasks, pagination)

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
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      
      <TasksContent
        tasks={tasks}
        isLoading={isLoading}
        isError={isError}
        searchQuery={searchQuery}
        currentPage={currentPage}
        totalPages={pagination?.totalPages || 0}
        totalItems={pagination?.totalCount || 0}
        itemsPerPage={pageSize}
        // hasNext={pagination?.hasNext || false}
        // hasPrev={pagination?.hasPrev || false}
        onCreateTask={handleCreateTask}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
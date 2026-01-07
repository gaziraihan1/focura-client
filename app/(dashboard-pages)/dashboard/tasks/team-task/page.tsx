"use client";
import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import {
  TeamTaskFiltersBar,
  TeamTaskScope,
} from "@/components/Dashboard/TeamTask/TeamTaskFiltersBar";
import { Section } from "@/components/Dashboard/TeamTask/Section";
import { Stat } from "@/components/Dashboard/TeamTask/Stat";
import { TaskList } from "@/components/Dashboard/TeamTask/TaskList";
// import { Pagination } from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { useTasks, useTaskStats } from "@/hooks/useTask";
import { useUserId } from "@/hooks/useUser";
import { getTaskTimeInfo } from "@/lib/task/time";
import { Pagination } from "@/components/Dashboard/AllTasks/Pagination";

const ITEMS_PER_PAGE = 10;

export default function TeamTasksPage({
  workspaceId,
}: {
  workspaceId?: string;
}) {
  // Get current user ID
  const userId = useUserId();
  
  // Fetch team/assigned tasks
  const { data: tasks = [], isLoading } = useTasks({
    type: "assigned",
    workspaceId,
  });
  
  // Get stats for assigned tasks only
  const { data: stats } = useTaskStats(workspaceId, "assigned");

  // Filter states
  const [scope, setScope] = useState<TeamTaskScope>("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [attentionOnly, setAttentionOnly] = useState(false);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    // If user not loaded yet, return all tasks
    if (!userId) return tasks;

    return tasks.filter((task) => {
      // Scope filtering
      if (scope === "assigned_to_me") {
        if (!task.assignees.some((a) => a.user.id === userId)) return false;
      }
      
      if (scope === "i_assigned") {
        if (task.createdBy.id !== userId) return false;
      }
      
      if (scope === "collaborative") {
        if (task.assignees.length <= 1) return false;
      }

      // Search filter
      if (
        search &&
        !task.title.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (status !== "all" && task.status !== status) {
        return false;
      }

      // Priority filter
      if (priority !== "all" && task.priority !== priority) {
        return false;
      }

      // Needs Attention filter
      if (attentionOnly) {
        const { isOverdue, isDueToday } = getTaskTimeInfo(task);
        if (
          !(
            task.status === "BLOCKED" ||
            isOverdue ||
            isDueToday
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, scope, search, status, priority, attentionOnly, userId]);

  // Use pagination hook
  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedItems,
    setCurrentPage,
    resetPage,
  } = usePagination({
    items: filteredTasks,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  // Reset to page 1 when filters change
  const handleFilterChange = <T,>(filterSetter: (value: T) => void) => {
    return (value: T) => {
      filterSetter(value);
      resetPage();
    };
  };

  // Handle page change with smooth scroll
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          Team Tasks
        </h1>
        <p className="text-sm text-muted-foreground">
          {workspaceId 
            ? "Tasks assigned in this workspace" 
            : "Work that requires coordination and shared accountability"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Assigned" value={stats?.assigned ?? 0} />
        <Stat label="Overdue" value={stats?.overdue ?? 0} danger />
        <Stat label="Due Today" value={stats?.dueToday ?? 0} />
        <Stat label="In Progress" value={stats?.inProgress ?? 0} />
      </div>

      {/* Filters */}
      <TeamTaskFiltersBar
        scope={scope}
        onScopeChange={handleFilterChange(setScope)}
        search={search}
        onSearchChange={handleFilterChange(setSearch)}
        status={status}
        onStatusChange={handleFilterChange(setStatus)}
        priority={priority}
        onPriorityChange={handleFilterChange(setPriority)}
        attentionOnly={attentionOnly}
        onAttentionToggle={() => {
          setAttentionOnly((v) => !v);
          resetPage();
        }}
      />

      {/* Results */}
      <Section
        title={
          scope === "assigned_to_me"
            ? "Assigned to Me"
            : scope === "i_assigned"
            ? "I Assigned"
            : scope === "collaborative"
            ? "Collaborative Tasks"
            : "All Team Tasks"
        }
        highlight={attentionOnly}
      >
        {/* Task List */}
        <TaskList 
          tasks={paginatedItems} 
          isLoading={isLoading || !userId}
        />

        {/* Pagination */}
        {!isLoading && userId && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={totalItems}
          />
        )}

        {/* No Results Message */}
        {!isLoading && userId && filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters
            </p>
          </div>
        )}
      </Section>
    </div>
  );
}
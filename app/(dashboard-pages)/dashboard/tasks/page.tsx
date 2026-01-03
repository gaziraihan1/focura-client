"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useTasks, useTaskStats, TaskFilters } from "@/hooks/useTask";
import { TaskStatsCards } from "@/components/Dashboard/AllTasks/TaskStatsCards";
import { TaskFiltersBar } from "@/components/Dashboard/AllTasks/TaskFiltersBar";
import { TaskList } from "@/components/Dashboard/AllTasks/TaskList";
import { Pagination } from "@/components/Dashboard/AllTasks/Pagination";

const PAGE_SIZE = 10;

export default function TasksPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "personal" | "assigned">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filters: TaskFilters = useMemo(
    () => ({
      type: activeTab,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
      priority: selectedPriority !== "all" ? selectedPriority : undefined,
    }),
    [activeTab, selectedStatus, selectedPriority]
  );

  const { data: tasks = [], isLoading, isError } = useTasks(filters);
  
  // Pass the same type to stats hook to get filtered stats
  const { data: stats } = useTaskStats(undefined, activeTab);
  
  console.log("Current tab:", activeTab);
  console.log("Stats:", stats);
  console.log("Tasks:", tasks);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const totalPages = Math.ceil(filteredTasks.length / PAGE_SIZE);
  
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTasks.slice(start, start + PAGE_SIZE);
  }, [filteredTasks, currentPage]);

  const handleTabChange = (tab: "all" | "personal" | "assigned") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handlePriorityChange = (priority: string) => {
    setSelectedPriority(priority);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tasks and stay productive
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/tasks/add-task")}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {/* Stats cards show filtered stats based on active tab */}
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

      <TaskList
        tasks={paginatedTasks}
        isLoading={isLoading}
        isError={isError}
        searchQuery={searchQuery}
        onCreateTask={() => router.push("/dashboard/tasks/add-task")}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
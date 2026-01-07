"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTasks } from "@/hooks/useTask";
import { CalendarView } from "@/components/Dashboard/CalendarView/CalendarView";
import { CalendarStats, CalendarLegend } from "@/components/Dashboard/CalendarView/CalendarStats";
import { Plus, Filter, X, Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function CalendarPage() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Fetch tasks
  const { data: allTasks = [], isLoading } = useTasks({
    type: "all",
  });

  // Apply filters
  const filteredTasks = allTasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    return true;
  });

  // Handlers
  const handleTaskClick = (task: any) => {
    router.push(`/dashboard/tasks/${task.id}`);
  };

  const handleCreateTask = (date: Date) => {
    const dueDate = date.toISOString().split("T")[0];
    router.push(`/dashboard/tasks/add-task?dueDate=${dueDate}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize and manage your tasks by date
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="sm:hidden flex-1 px-4 py-2 rounded-lg border border-border bg-background hover:bg-accent transition flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filters</span>
          </button>

          {/* Desktop Filter Dropdown */}
          <div className="hidden sm:block relative">
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-accent transition flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filters</span>
            </button>
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => router.push("/dashboard/tasks/add-task")}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            <span className="text-sm sm:text-base">Add</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="lg:hidden p-2 rounded-lg border border-border bg-background hover:bg-accent transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats - Responsive Grid */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <CalendarStats tasks={filteredTasks} selectedMonth={currentMonth} />
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Calendar - Full width on mobile */}
        <div className="lg:col-span-3">
          <CalendarView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onCreateTask={handleCreateTask}
          />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block space-y-4">
          <CalendarLegend />

          {/* Quick Filters */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <h3 className="font-semibold text-sm mb-3">Quick Filters</h3>
            
            <div className="mb-4">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
              >
                <option value="all">All</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="BLOCKED">Blocked</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
              >
                <option value="all">All</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <h3 className="font-semibold text-sm mb-3">Upcoming This Week</h3>
            <div className="space-y-2">
              {filteredTasks
                .filter((task) => {
                  if (!task.dueDate) return false;
                  const dueDate = new Date(task.dueDate);
                  const today = new Date();
                  const weekFromNow = new Date();
                  weekFromNow.setDate(weekFromNow.getDate() + 7);
                  return dueDate >= today && dueDate <= weekFromNow;
                })
                .slice(0, 5)
                .map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="p-2 rounded-lg hover:bg-accent/5 cursor-pointer transition text-sm"
                  >
                    <p className="font-medium truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.dueDate &&
                        new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                    </p>
                  </div>
                ))}
              {filteredTasks.filter((task) => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                const today = new Date();
                const weekFromNow = new Date();
                weekFromNow.setDate(weekFromNow.getDate() + 7);
                return dueDate >= today && dueDate <= weekFromNow;
              }).length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No upcoming tasks
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl p-6 z-50 lg:hidden max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 rounded-lg hover:bg-accent transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setShowMobileFilters(false);
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                  >
                    <option value="all">All</option>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="BLOCKED">Blocked</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Priority
                  </label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => {
                      setPriorityFilter(e.target.value);
                      setShowMobileFilters(false);
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                  >
                    <option value="all">All</option>
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Modal */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background z-50 lg:hidden overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Quick Access</h3>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-2 rounded-lg hover:bg-accent transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <CalendarLegend />

                {/* Upcoming Tasks */}
                <div className="p-4 rounded-xl bg-card border border-border">
                  <h3 className="font-semibold text-sm mb-3">Upcoming This Week</h3>
                  <div className="space-y-2">
                    {filteredTasks
                      .filter((task) => {
                        if (!task.dueDate) return false;
                        const dueDate = new Date(task.dueDate);
                        const today = new Date();
                        const weekFromNow = new Date();
                        weekFromNow.setDate(weekFromNow.getDate() + 7);
                        return dueDate >= today && dueDate <= weekFromNow;
                      })
                      .slice(0, 5)
                      .map((task) => (
                        <div
                          key={task.id}
                          onClick={() => {
                            handleTaskClick(task);
                            setShowMobileSidebar(false);
                          }}
                          className="p-2 rounded-lg hover:bg-accent/5 cursor-pointer transition text-sm"
                        >
                          <p className="font-medium truncate">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.dueDate &&
                              new Date(task.dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Calendar,
  Flag,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Folder,
  Timer,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { useTasks, useTaskStats, TaskFilters } from "@/hooks/useTask";

// Helper to format time duration
const formatTimeDuration = (hours: number) => {
  if (hours < 0) {
    const absHours = Math.abs(hours);
    if (absHours < 24) return `${absHours}h overdue`;
    const days = Math.floor(absHours / 24);
    return `${days}d overdue`;
  }
  
  if (hours < 24) return `${hours}h left`;
  const days = Math.floor(hours / 24);
  return `${days}d left`;
};

// Helper to get time status color
const getTimeStatusColor = (timeTracking: any) => {
  if (!timeTracking) return "text-gray-500";
  
  if (timeTracking.isOverdue) return "text-red-500";
  if (timeTracking.isDueToday) return "text-orange-500";
  if (timeTracking.hoursUntilDue !== null && timeTracking.hoursUntilDue < 24) {
    return "text-orange-500";
  }
  return "text-blue-500";
};

export default function TasksPage() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"all" | "personal" | "assigned">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  const filters: TaskFilters = useMemo(() => ({
    type: activeTab,
    status: selectedStatus,
    priority: selectedPriority,
  }), [activeTab, selectedStatus, selectedPriority]);

  const { data: tasks = [], isLoading, isError } = useTasks(filters);
  const { data: stats } = useTaskStats();
  // console.log(tasks)

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      TODO: "bg-gray-500/10 text-gray-500",
      IN_PROGRESS: "bg-blue-500/10 text-blue-500",
      IN_REVIEW: "bg-purple-500/10 text-purple-500",
      BLOCKED: "bg-red-500/10 text-red-500",
      COMPLETED: "bg-green-500/10 text-green-500",
      CANCELLED: "bg-gray-500/10 text-gray-500",
    };
    return colors[status] || "bg-gray-500/10 text-gray-500";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      URGENT: "text-red-500",
      HIGH: "text-orange-500",
      MEDIUM: "text-blue-500",
      LOW: "text-green-500",
    };
    return colors[priority] || "text-gray-500";
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

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Personal Tasks</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.personal}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <User size={20} className="text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assigned to Me</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.assigned}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10">
                <CheckCircle2 size={20} className="text-purple-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due Today</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.dueToday}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Clock size={20} className="text-orange-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.overdue}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10">
                <AlertCircle size={20} className="text-red-500" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="rounded-xl bg-card border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex gap-2">
            {[
              { value: "all", label: "All Tasks" },
              { value: "personal", label: "Personal" },
              { value: "assigned", label: "Assigned" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
          >
            <option value="all">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="BLOCKED">Blocked</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
          >
            <option value="all">All Priority</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center py-12 rounded-xl bg-card border border-border">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load tasks</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-card border border-border">
          <p className="text-muted-foreground">
            {searchQuery ? "No tasks match your search" : "No tasks found"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => router.push("/dashboard/tasks/add-task")}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Create Your First Task
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task: any, index: number) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/dashboard/tasks/${task.id}`}>
                <div className="p-4 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      <div
                        className={`w-10 h-10 rounded-lg ${getStatusColor(
                          task.status
                        )} flex items-center justify-center`}
                      >
                        {task.status === "COMPLETED" ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <Clock size={20} />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <Flag
                          size={18}
                          className={getPriorityColor(task.priority)}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        {task.project && (
                          <div className="flex items-center gap-2">
                            <Folder size={14} className="text-muted-foreground" />
                            <span
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: `${task.project.color}20`,
                                color: task.project.color,
                              }}
                            >
                              {task.project.name}
                            </span>
                          </div>
                        )}

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status.replace("_", " ")}
                        </span>

                        {/* 🕐 Time Tracking Information */}
                        {task.timeTracking && (
                          <>
                            {/* Created hours ago */}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Timer size={14} />
                              <span>Created {task.timeTracking.hoursSinceCreation}h ago</span>
                            </div>

                            {/* Time until due / Overdue status */}
                            {task.timeTracking.hoursUntilDue !== null && (
                              <div
                                className={`flex items-center gap-1 text-xs font-medium ${getTimeStatusColor(
                                  task.timeTracking
                                )}`}
                              >
                                <AlertCircle size={14} />
                                <span>
                                  {formatTimeDuration(task.timeTracking.hoursUntilDue)}
                                </span>
                              </div>
                            )}

                            {/* Progress bar for estimated hours */}
                            {task.timeTracking.timeProgress !== null && task.estimatedHours && (
                              <div className="flex items-center gap-2">
                                <TrendingUp size={14} className="text-muted-foreground" />
                                <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${
                                      task.timeTracking.timeProgress > 100
                                        ? "bg-red-500"
                                        : task.timeTracking.timeProgress > 80
                                        ? "bg-orange-500"
                                        : "bg-blue-500"
                                    }`}
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        task.timeTracking.timeProgress
                                      )}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {task.timeTracking.timeProgress}%
                                </span>
                              </div>
                            )}
                          </>
                        )}

                        {/* Due date fallback (if no time tracking) */}
                        {task.dueDate && !task.timeTracking && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar size={14} />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}

                        {task.assignees.length > 0 && (
                          <div className="flex -space-x-2">
                            {task.assignees.slice(0, 3).map((assignee: any) => (
                              <div
                                key={assignee.user.id}
                                className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium"
                                title={assignee.user.name}
                              >
                                {assignee.user.name.charAt(0)}
                              </div>
                            ))}
                            {task.assignees.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium">
                                +{task.assignees.length - 3}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
                          {task._count.comments > 0 && (
                            <span>{task._count.comments} 💬</span>
                          )}
                          {task._count.subtasks > 0 && (
                            <span>{task._count.subtasks} ✓</span>
                          )}
                          {task._count.files > 0 && (
                            <span>{task._count.files} 📎</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
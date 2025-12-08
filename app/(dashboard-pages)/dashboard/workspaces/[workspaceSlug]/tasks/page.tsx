// app/dashboard/[workspaceSlug]/tasks/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Calendar,
  Flag,
//   User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Folder,
  Timer,
  TrendingUp,
  Filter,
  X,
//   Users,
  Tag,
  ArrowUpDown,
  ListFilter,
} from "lucide-react";
import Link from "next/link";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useTasks, useTaskStats, TaskFilters, Task } from "@/hooks/useTask";
import { useProjects } from "@/hooks/useProjects";
import { useLabels } from "@/hooks/useLabels";
import { useTeamMembers } from "@/hooks/useTeam";

// Helper functions
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

type TimeTracking = {
  hoursSinceCreation: number;
  hoursUntilDue: number | null;
  timeProgress: number | null;
  isOverdue?: boolean;
  isDueToday?: boolean;
};

type TaskWithTracking = Task & { timeTracking?: TimeTracking };

const getTimeStatusColor = (timeTracking?: TimeTracking) => {
  if (!timeTracking) return "text-gray-500";
  
  if (timeTracking.isOverdue) return "text-red-500";
  if (timeTracking.isDueToday) return "text-orange-500";
  if (timeTracking.hoursUntilDue !== null && timeTracking.hoursUntilDue < 24) {
    return "text-orange-500";
  }
  return "text-blue-500";
};

// type ViewMode = "list" | "kanban" | "calendar";
type SortBy = "dueDate" | "priority" | "status" | "createdAt" | "title";

export default function WorkspaceTasksPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspaceSlug as string;

  // const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("dueDate");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch workspace and related data
  const { data: workspace } = useWorkspace(workspaceSlug);
  const { data: projects = [] } = useProjects(workspace?.id);
  const { data: labels = [] } = useLabels(workspace?.id);
  const { data: members = [] } = useTeamMembers(workspace?.id);

  const filters: TaskFilters = useMemo(() => ({
  workspaceId: workspace?.id,
  status: selectedStatus !== "all" ? selectedStatus : undefined,
  priority: selectedPriority !== "all" ? selectedPriority : undefined,
  projectId: selectedProject !== "all" ? selectedProject : undefined,
  assigneeId: selectedAssignee !== "all" ? selectedAssignee : undefined,
  labelIds: selectedLabels.length > 0 ? selectedLabels : undefined,
}), [
  workspace?.id,
  selectedStatus,
  selectedPriority,
  selectedProject,
  selectedAssignee,
  selectedLabels
]);


  const { data: tasks = [], isLoading, isError } = useTasks(filters);
  const { data: stats } = useTaskStats(workspace?.id);

  console.log(stats, "and", tasks)

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo<TaskWithTracking[]>(() => {
    let filtered = tasks as TaskWithTracking[];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort tasks
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "priority":
          const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case "status":
          return a.status.localeCompare(b.status);
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, searchQuery, sortBy]);

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

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev =>
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  const clearFilters = () => {
    setSelectedStatus("all");
    setSelectedPriority("all");
    setSelectedProject("all");
    setSelectedAssignee("all");
    setSelectedLabels([]);
    setSearchQuery("");
  };

  const activeFiltersCount = [
    selectedStatus !== "all",
    selectedPriority !== "all",
    selectedProject !== "all",
    selectedAssignee !== "all",
    selectedLabels.length > 0,
  ].filter(Boolean).length;

  if (!workspace) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage tasks across all projects in {workspace.name}
          </p>
        </div>
        <button
          onClick={() => router.push(`/dashboard/workspaces/${workspaceSlug}/tasks/new-task`)}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.totalTasks || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <ListFilter size={20} className="text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.inProgress || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Clock size={20} className="text-purple-500" />
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
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.completed || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle2 size={20} className="text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due Today</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.dueToday || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Calendar size={20} className="text-orange-500" />
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
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.overdue || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10">
                <AlertCircle size={20} className="text-red-500" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="rounded-xl bg-card border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
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

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
              showFilters || activeFiltersCount > 0
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-foreground hover:bg-accent"
            }`}
          >
            <Filter size={18} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary-foreground text-primary text-xs font-medium">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={18} className="text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-border space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="BLOCKED">Blocked</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Priority
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
                >
                  <option value="all">All Priority</option>
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              {/* Project Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
                >
                  <option value="all">All Projects</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Assignee
                </label>
                <select
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
                >
                  <option value="all">All Assignees</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Labels Filter */}
            {labels.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Tag size={16} className="inline mr-2" />
                  Labels
                </label>
                <div className="flex flex-wrap gap-2">
                  {labels.map((label) => (
                    <button
                      key={label.id}
                      onClick={() => toggleLabel(label.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                        selectedLabels.includes(label.id)
                          ? "opacity-100 ring-2 ring-offset-2"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: `${label.color}20`,
                        color: label.color,
                        border: `1px solid ${label.color}40`,
                      }}
                    >
                      {label.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition flex items-center gap-2"
                >
                  <X size={16} />
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Tasks List */}
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
      ) : filteredAndSortedTasks.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-card border border-border">
          <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchQuery || activeFiltersCount > 0
              ? "No tasks match your filters"
              : "No tasks yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || activeFiltersCount > 0
              ? "Try adjusting your search or filters"
              : "Create your first task to get started"}
          </p>
          {!searchQuery && activeFiltersCount === 0 && (
            <button
              onClick={() => router.push(`/dashboard/workspaces/${workspaceSlug}/tasks/new-task`)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedTasks.map((task, index: number) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Link href={`/dashboard/${workspaceSlug}/tasks/${task.id}`}>
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
                              className="text-xs px-2 py-1 rounded-full font-medium"
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

                        {/* Time Tracking Information */}
                        {task.timeTracking && (
                          <>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Timer size={14} />
                              <span>Created {task.timeTracking.hoursSinceCreation}h ago</span>
                            </div>

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

                            {task.timeTracking.timeProgress !== null && task.estimatedHours && (
                              <div className="flex items-center gap-2">
                                <TrendingUp size={14} className="text-muted-foreground" />
                                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
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
                          {task._count?.comments > 0 && (
                            <span>{task._count.comments} 💬</span>
                          )}
                          {task._count?.subtasks > 0 && (
                            <span>{task._count.subtasks} ✓</span>
                          )}
                          {task._count?.files > 0 && (
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
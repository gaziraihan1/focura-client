"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban,
  Search,
  Filter,
  Grid3x3,
  List,
  Plus,
  Loader2,
  AlertCircle,
  Calendar,
//   Users,
  CheckCircle2,
//   Clock,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

type ViewMode = "grid" | "list";

export default function ProjectsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
  });

  // Fetch all projects
  const { data: projectsData, isLoading, isError } = useProjects();

  // Extract projects from response
  const projects = useMemo(() => {
    if (!projectsData) return [];
    if (Array.isArray(projectsData)) return projectsData;
    return (projectsData as any)?.data || [];
  }, [projectsData]);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project: any) =>
          project.name.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((project: any) => project.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter((project: any) => project.priority === filters.priority);
    }

    return filtered;
  }, [projects, searchQuery, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p: any) => p.status === "ACTIVE").length;
    const completed = projects.filter((p: any) => p.status === "COMPLETED").length;
    const totalTasks = projects.reduce((sum: number, p: any) => sum + (p._count?.tasks || 0), 0);

    return { total, active, completed, totalTasks };
  }, [projects]);

  const activeFiltersCount = [
    filters.status !== "all",
    filters.priority !== "all",
  ].filter(Boolean).length;

  // Status badge color helper
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PLANNING: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      ACTIVE: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      ON_HOLD: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      COMPLETED: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      ARCHIVED: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
    };
    return colors[status] || "bg-gray-500/10 text-gray-500";
  };

  // Priority badge color helper
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      URGENT: "bg-red-500/10 text-red-600 dark:text-red-400",
      HIGH: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      MEDIUM: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      LOW: "bg-green-500/10 text-green-600 dark:text-green-400",
    };
    return colors[priority] || "bg-gray-500/10 text-gray-500";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your projects...</p>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-3">Failed to load projects</h2>
          <p className="text-muted-foreground mb-8">
            Unable to fetch your projects. Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition font-medium"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient background */}
      <div className="">
       
        
        <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-5">
              <div className="p-4 rounded-2xl bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                <FolderKanban className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                  Projects
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  All projects across your workspaces
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/dashboard/workspaces")}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-primary/20 font-medium"
            >
              <Plus size={20} />
              New Project
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
          >
            <StatsCard
              icon={<FolderKanban className="w-5 h-5" />}
              label="Total Projects"
              value={stats.total}
              color="blue"
            />
            <StatsCard
              icon={<Sparkles className="w-5 h-5" />}
              label="Active"
              value={stats.active}
              color="purple"
            />
            <StatsCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              label="Completed"
              value={stats.completed}
              color="green"
            />
            <StatsCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Total Tasks"
              value={stats.totalTasks}
              color="orange"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-5 lg:py-8 space-y-6">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-card border border-border shadow-sm p-5"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by name or description..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary/50 outline-none transition"
              />
            </div>

            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3.5 rounded-xl border transition flex items-center gap-2.5 font-medium ${
                showFilters || activeFiltersCount > 0
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : "border-border text-foreground hover:bg-accent"
              }`}
            >
              <Filter size={18} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary-foreground text-primary text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </motion.button>

            {/* View Toggle */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-muted/50 border border-border/50">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-background shadow-sm border border-border"
                    : "hover:bg-background/50"
                }`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition ${
                  viewMode === "list"
                    ? "bg-background shadow-sm border border-border"
                    : "hover:bg-background/50"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 pt-5 border-t border-border"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, status: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:ring-2 ring-primary/50 outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="PLANNING">Planning</option>
                      <option value="ACTIVE">Active</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Priority
                    </label>
                    <select
                      value={filters.priority}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, priority: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:ring-2 ring-primary/50 outline-none"
                    >
                      <option value="all">All Priority</option>
                      <option value="URGENT">Urgent</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => setFilters({ status: "all", priority: "all" })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border hover:bg-accent text-foreground transition font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20 rounded-2xl bg-card border border-dashed border-border"
          >
            <FolderKanban className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {searchQuery || activeFiltersCount > 0
                ? "No projects match your search"
                : "No projects yet"}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {searchQuery || activeFiltersCount > 0
                ? "Try adjusting your search terms or filters to find what you're looking for"
                : "Get started by joining a workspace or creating your first project"}
            </p>
            {!searchQuery && activeFiltersCount === 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/dashboard/workspaces")}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition shadow-lg shadow-primary/20 font-medium"
              >
                Browse Workspaces
              </motion.button>
            )}
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project: any, index: number) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onNavigate={() => router.push(`/dashboard/projects/${project.id}`)}
                getStatusColor={getStatusColor}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {filteredProjects.map((project: any, index: number) => (
              <ProjectListItem
                key={project.id}
                project={project}
                index={index}
                onNavigate={() => router.push(`/dashboard/projects/${project.id}`)}
                getStatusColor={getStatusColor}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "blue" | "purple" | "green" | "orange";
}) {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-600 dark:text-blue-400",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-600 dark:text-purple-400",
    green: "from-green-500/10 to-green-600/5 border-green-500/20 text-green-600 dark:text-green-400",
    orange: "from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-600 dark:text-orange-400",
  };

  return (
    <div
      className={`p-2 rounded-xl bg-linear-to-br border backdrop-blur-sm ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm opacity-80">{label}</p>
        </div>
      </div>
    </div>
  );
}

// Project Card Component (Grid View)
function ProjectCard({
  project,
  index,
  onNavigate,
  getStatusColor,
  getPriorityColor,
}: {
  project: any;
  index: number;
  onNavigate: () => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onClick={onNavigate}
      className="group cursor-pointer rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
    >
      {/* Color Header */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: project.color || "#667eea" }}
      />

      <div className="p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {project.icon ? (
              <div className="text-3xl">{project.icon}</div>
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: project.color || "#667eea" }}
              >
                {project.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition">
                {project.name}
              </h3>
              {project.workspace && (
                <p className="text-xs text-muted-foreground truncate">
                  {project.workspace.name}
                </p>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {project.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              project.status
            )}`}
          >
            {project.status}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
              project.priority
            )}`}
          >
            {project.priority}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} />
            <span>{project._count?.tasks || 0} tasks</span>
          </div>
          {project.dueDate && (
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <span>{new Date(project.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Project List Item Component (List View)
function ProjectListItem({
  project,
  index,
  onNavigate,
  getStatusColor,
  getPriorityColor,
}: {
  project: any;
  index: number;
  onNavigate: () => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ x: 4 }}
      onClick={onNavigate}
      className="group cursor-pointer rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 p-2 sm:p-4 lg:p-6"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        {project.icon ? (
          <div className="text-2xl">{project.icon}</div>
        ) : (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0"
            style={{ backgroundColor: project.color || "#667eea" }}
          >
            {project.name.charAt(0)}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-muted-foreground truncate">
                  {project.description}
                </p>
              )}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                  project.priority
                )}`}
              >
                {project.priority}
              </span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
            {project.workspace && (
              <div className="flex items-center gap-1.5">
                <FolderKanban size={14} />
                <span>{project.workspace.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>{project._count?.tasks || 0} tasks</span>
            </div>
            {project.dueDate && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    </motion.div>
  );
}
// app/dashboard/projects/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FolderKanban, Plus, Loader2, AlertCircle } from "lucide-react";
import { useAllUserProjects } from "@/hooks/useProjects";
import { slugify } from "@/utils/slugify"; // ✅ Import slugify utility

// Import components
import { ProjectStats } from "@/components/Dashboard/AllProjects/ProjectStats";
import { ProjectFilters } from "@/components/Dashboard/AllProjects/ProjectFilters";
import { ProjectCard } from "@/components/Dashboard/AllProjects/ProjectCard";
import { ProjectListItem } from "@/components/Dashboard/AllProjects/ProjectListItem";
import { EmptyState } from "@/components/Dashboard/AllProjects/EmptyState";
import { WorkspaceQuickFilter } from "@/components/Dashboard/AllProjects/WorkspaceQuickFilter";
import { ViewMode, ProjectFilters as Filters, ProjectData, WorkspaceData } from "@/types/project.types";

export default function ProjectsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    priority: "all",
    workspace: "all",
  });

  // Fetch all user projects
  const { data: projects = [], isLoading, isError } = useAllUserProjects();

  // Get unique workspaces
  const workspaces = useMemo<WorkspaceData[]>(() => {
    const uniqueWorkspaces = new Map<string, WorkspaceData>();
    projects.forEach((project: ProjectData) => {
      if (project.workspace) {
        // ✅ Generate slug from workspace name
        const slug = project.workspace.slug || slugify(project.workspace.name);
        
        uniqueWorkspaces.set(project.workspace.id, {
          id: project.workspace.id,
          name: project.workspace.name,
          slug: slug, // ✅ Use generated slug
        });
      }
    });
    return Array.from(uniqueWorkspaces.values());
  }, [projects]);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project: ProjectData) =>
          project.name.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.workspace?.name.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((project: ProjectData) => project.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter((project: ProjectData) => project.priority === filters.priority);
    }

    // Workspace filter
    if (filters.workspace !== "all") {
      filtered = filtered.filter((project: ProjectData) => project.workspace?.id === filters.workspace);
    }

    return filtered;
  }, [projects, searchQuery, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p: ProjectData) => p.status === "ACTIVE").length;
    const completed = projects.filter((p: ProjectData) => p.status === "COMPLETED").length;
    const totalTasks = projects.reduce(
      (sum: number, p: ProjectData) => sum + (p._count?.tasks || p.stats?.totalTasks || 0),
      0
    );

    return { total, active, completed, totalTasks };
  }, [projects]);

  const activeFiltersCount = [
    filters.status !== "all",
    filters.priority !== "all",
    filters.workspace !== "all",
  ].filter(Boolean).length;

  const hasSearchOrFilters = searchQuery.trim() !== "" || activeFiltersCount > 0;

  // ✅ Navigate with generated slug from workspace name
  const handleProjectClick = (project: ProjectData) => {
    if (project.workspace) {
      // Generate slug from workspace name
      const workspaceSlug = project.workspace.slug || slugify(project.workspace.name) || project.workspace.id;
      router.push(`/dashboard/workspaces/${workspaceSlug}/projects/${project.id}`);
    } else {
      // Fallback if no workspace (personal project)
      router.push(`/dashboard/projects/${project.id}`);
    }
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
        >
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-2xl bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
              <FolderKanban className="lg:w-8 lg:h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
                My Projects
              </h1>
              <p className="text-muted-foreground mt-2 lg:text-lg">
                All projects you&apos;re a member of across workspaces
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/dashboard/workspaces")}
            className="lg:px-6 lg:py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-primary/20 font-medium px-4 py-2"
          >
            <Plus size={20} />
            New Project
          </motion.button>
        </motion.div>

        {/* Stats */}
        <ProjectStats
          total={stats.total}
          active={stats.active}
          completed={stats.completed}
          totalTasks={stats.totalTasks}
        />

        {/* Workspace Quick Filter */}
        <WorkspaceQuickFilter
          workspaces={workspaces}
          selectedWorkspaceId={filters.workspace}
          onSelectWorkspace={(id) => setFilters((prev) => ({ ...prev, workspace: id }))}
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-5 lg:py-8 space-y-6">
        {/* Filters */}
        <ProjectFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filters={filters}
          onFiltersChange={setFilters}
          activeFiltersCount={activeFiltersCount}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          workspaces={workspaces}
        />

        {/* Projects Grid/List or Empty State */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            hasSearchOrFilters={hasSearchOrFilters}
            onBrowseWorkspaces={() => router.push("/dashboard/workspaces")}
          />
        ) : viewMode === "grid" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project: ProjectData, index: number) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onNavigate={() => handleProjectClick(project)}
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
            {filteredProjects.map((project: ProjectData, index: number) => (
              <ProjectListItem
                key={project.id}
                project={project}
                index={index}
                onNavigate={() => handleProjectClick(project)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
"use client";

import { ProjectsPageHeader } from "@/components/dashboard/projects/all-projects/ProjectsPageHeader";
import { ProjectStats } from "@/components/dashboard/projects/all-projects/ProjectStats";
import { WorkspaceQuickFilter } from "@/components/dashboard/projects/all-projects/WorkspaceQuickFilter";
import { ProjectFilters } from "@/components/dashboard/projects/all-projects/ProjectFilters";
import { ProjectsContent } from "@/components/dashboard/projects/all-projects/ProjectsContent";
import { ProjectsLoadingState } from "@/components/dashboard/projects/all-projects/ProjectsLoadingState";
import { ProjectsErrorState } from "@/components/dashboard/projects/all-projects/ProjectsErrorState";
import { useProjectsPage } from "@/hooks/useProjectsPage";

export function ProjectsPageContent() {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    isLoading,
    isError,
    workspaces,
    filteredProjects,
    stats,
    activeFiltersCount,
    hasSearchOrFilters,
    handleProjectClick,
    handleNewProject,
    handleBrowseWorkspaces,
    handleRetry,
    handleCloseAccessDeniedModal,
    showAccessDeniedModal,
  } = useProjectsPage();

  if (isLoading) {
    return <ProjectsLoadingState />;
  }

  if (isError) {
    return <ProjectsErrorState onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <ProjectsPageHeader onNewProject={handleNewProject} />

        <ProjectStats
          total={stats.total}
          active={stats.active}
          completed={stats.completed}
          totalTasks={stats.totalTasks}
        />

        <WorkspaceQuickFilter
          workspaces={workspaces}
          selectedWorkspaceId={filters.workspace}
          onSelectWorkspace={(id) =>
            setFilters((prev) => ({ ...prev, workspace: id }))
          }
        />
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-5 lg:py-8 space-y-6">
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

        <ProjectsContent
          projects={filteredProjects}
          viewMode={viewMode}
          hasSearchOrFilters={hasSearchOrFilters}
          onProjectClick={handleProjectClick}
          onBrowseWorkspaces={handleBrowseWorkspaces}
          onCloseModal={handleCloseAccessDeniedModal}
          showModal={showAccessDeniedModal}
        />
      </div>
    </div>
  );
}

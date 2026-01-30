import { EmptyState } from "@/components/Dashboard/AllProjects/EmptyState";
import { ProjectsGridView } from "./ProjectsGridView";
import { ProjectsListView } from "./ProjectsListView";
import { ViewMode, ProjectData } from "@/types/project.types";

interface ProjectsContentProps {
  projects: ProjectData[];
  viewMode: ViewMode;
  hasSearchOrFilters: boolean;
  onProjectClick: (project: ProjectData) => void;
  onBrowseWorkspaces: () => void;
}

export function ProjectsContent({
  projects,
  viewMode,
  hasSearchOrFilters,
  onProjectClick,
  onBrowseWorkspaces,
}: ProjectsContentProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        hasSearchOrFilters={hasSearchOrFilters}
        onBrowseWorkspaces={onBrowseWorkspaces}
      />
    );
  }

  if (viewMode === "grid") {
    return (
      <ProjectsGridView projects={projects} onProjectClick={onProjectClick} />
    );
  }

  return (
    <ProjectsListView projects={projects} onProjectClick={onProjectClick} />
  );
}
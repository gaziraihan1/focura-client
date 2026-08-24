import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ProjectSectionItem } from "@/hooks/useProjectFeatures";

export interface WorkspaceSection {
  id: string;
  name: string;
  color?: string;
  projectId: string;
  projectName: string;
}

interface ProjectRef {
  id: string;
  name: string;
}

function unwrap<T>(response: any): T {
  if (response && typeof response === "object" && "success" in response && "data" in response) {
    return response.data as T;
  }
  return response as T;
}

/**
 * Loads every section across a workspace's projects so the workspace-level
 * tasks page can filter by section. Sections are stored per project, so this
 * aggregates the per-project section endpoints into one flat, ordered list.
 */
export function useWorkspaceSections(workspaceId?: string, projects: ProjectRef[] = []) {
  const projectIds = projects.map((p) => p.id).join(",");
  const enabled = !!workspaceId && projects.length > 0;

  return useQuery({
    queryKey: ["workspace-sections", workspaceId, projectIds],
    enabled,
    queryFn: async (): Promise<WorkspaceSection[]> => {
      const projectNames = new Map(projects.map((p) => [p.id, p.name]));

      // allSettled: one project's sections endpoint failing (e.g. a project
      // the viewer can't access) must not blank the whole section dropdown.
      const results = await Promise.allSettled(
        projects.map((project) =>
          api
            .get(`/api/v1/projects/${project.id}/sections`, { showErrorToast: false })
            .then((res) => unwrap<ProjectSectionItem[]>(res)),
        ),
      );

      return results
        .flatMap((result, index) => {
          if (result.status === "rejected") return [];
          const project = projects[index];
          return result.value.map((section) => ({
            id: section.id,
            name: section.name,
            color: section.color,
            projectId: project.id,
            projectName: projectNames.get(project.id) ?? project.name,
          }));
        })
        .sort(
          (a, b) =>
            a.projectName.localeCompare(b.projectName) || a.name.localeCompare(b.name),
        );
    },
    // Sections don't change often; a 1-minute stale time keeps the dropdown snappy.
    staleTime: 60 * 1000,
  });
}

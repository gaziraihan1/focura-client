import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ProjectDetails } from "./useProjects";
import { projectKeys } from "./projectKeys";

function unwrap<T>(response: any): T {
  if (response && typeof response === "object" && "success" in response && "data" in response) {
    return response.data as T;
  }
  return response as T;
}

export const useProjects = (workspaceId?: string) => {
  return useQuery({
    queryKey: workspaceId ? projectKeys.list(workspaceId) : ["projects", "list", "disabled"],
    queryFn: async () => {
      const res = await api.get(`/api/v1/projects/workspace/${workspaceId}`);
      return unwrap<ProjectDetails[]>(res);
    },
    enabled: !!workspaceId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAllUserProjects = () => {
  return useQuery({
    queryKey: [...projectKeys.all, "user-projects"],
    queryFn: async () => {
      const res = await api.get("/api/v1/projects/user/all", { showErrorToast: true });
      return unwrap<ProjectDetails[]>(res);
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProjectDetails = (projectId?: string) => {
  return useQuery({
    queryKey: projectKeys.detail(projectId || ""),
    queryFn: async () => {
      const res = await api.get(`/api/v1/projects/${projectId}`);
      return unwrap<ProjectDetails>(res);
    },
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useProjectDetailsBySlug = (slug?: string) => {
  return useQuery({
    queryKey: [...projectKeys.details(), "slug", slug],
    queryFn: async () => {
      const res = await api.get(`/api/v1/projects/slug/${slug}`);
      return unwrap<ProjectDetails>(res);
    },
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev: ProjectDetails | undefined) => prev,
  });
};

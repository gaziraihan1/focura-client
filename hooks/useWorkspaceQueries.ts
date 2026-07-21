import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Workspace, WorkspaceMember, WorkspaceStats, WorkspaceOverview, WorkspaceStorageInfo } from "./useWorkspace";
import { workspaceKeys } from "./workspaceKeys";
import { projectKeys } from "./useProjects";

export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: async () => {
      const response = await api.get<Workspace[]>("/api/v1/workspaces", { showErrorToast: true });
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorkspace(workspaceSlugOrId: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceSlugOrId),
    queryFn: async () => {
      const response = await api.get<Workspace>(`/api/v1/workspaces/${workspaceSlugOrId}`, { showErrorToast: true });
      return response.data;
    },
    enabled: typeof workspaceSlugOrId === "string" && workspaceSlugOrId.length > 0,
    staleTime: 3 * 60 * 1000,
  });
}

export function useWorkspaceOverview(slug: string) {
  const qc = useQueryClient();

  return useQuery({
    queryKey: [...workspaceKeys.detail(slug), "overview"] as const,
    queryFn: async (): Promise<WorkspaceOverview> => {
      const res = await api.get<WorkspaceOverview>(`/api/v1/workspaces/${slug}/overview`, { showErrorToast: true });
      const overview = res.data as WorkspaceOverview;

      qc.setQueryData(workspaceKeys.detail(slug), overview.workspace);
      qc.setQueryData(workspaceKeys.stats(overview.workspace.id), overview.stats);
      qc.setQueryData(workspaceKeys.members(overview.workspace.id), overview.workspace.members);

      const existingProjects = qc.getQueryData(projectKeys.list(overview.workspace.id));
      if (!existingProjects) {
        qc.setQueryData(projectKeys.list(overview.workspace.id), overview.projects);
      }

      return overview;
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useWorkspaceMembers(workspaceId?: string) {
  return useQuery({
    queryKey: workspaceKeys.members(workspaceId ?? ""),
    queryFn: async () => {
      const response = await api.get<WorkspaceMember[]>(`/api/v1/workspaces/${workspaceId}/members`, { showErrorToast: true });
      return response.data || [];
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorkspaceStats(workspaceId: string) {
  return useQuery({
    queryKey: workspaceKeys.stats(workspaceId),
    queryFn: async () => {
      const response = await api.get<WorkspaceStats>(`/api/v1/workspaces/${workspaceId}/stats`, { showErrorToast: true });
      return response.data;
    },
    enabled: !!workspaceId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useWorkspaceStorage(workspaceId: string | undefined) {
  return useQuery({
    queryKey: workspaceId ? workspaceKeys.storage(workspaceId) : ["__disabled__"],
    queryFn: async (): Promise<WorkspaceStorageInfo> => {
      const response = await api.get<WorkspaceStorageInfo>(`/api/v1/workspaces/${workspaceId}/storage`, { showErrorToast: true });
      return response.data as WorkspaceStorageInfo;
    },
    enabled: !!workspaceId,
    staleTime: 0,
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: false,
  });
}

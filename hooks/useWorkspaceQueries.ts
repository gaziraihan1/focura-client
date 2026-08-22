import { QueryClient, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Workspace, WorkspaceMember, WorkspaceStats, WorkspaceOverview, WorkspaceStorageInfo } from "./useWorkspace";
import { workspaceKeys } from "./workspaceKeys";
import { projectKeys } from "./useProjects";

export interface PublicWorkspacesResult {
  items: Workspace[];
  total: number;
  page: number;
  pageSize: number;
}

export function usePublicWorkspaces(params: {
  search?: string;
  pageSize?: number;
  enabled?: boolean;
}) {
  const search = params.search ?? "";
  const pageSize = params.pageSize ?? 12;

  return useInfiniteQuery<PublicWorkspacesResult, Error>({
    queryKey: [...workspaceKeys.all, "public", search, pageSize] as const,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<PublicWorkspacesResult>(
        "/api/v1/workspaces/public",
        {
          showErrorToast: true,
          params: {
            search: search || undefined,
            page: pageParam,
            limit: pageSize,
          },
        },
      );
      // The api wrapper unwraps the { success, data } envelope and can
      // return undefined on failure — fall back to an empty page so the
      // infinite query always yields a well-formed page.
      return (
        response.data ?? {
          items: [],
          total: 0,
          page: pageParam as number,
          pageSize,
        }
      );
    },
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.page * lastPage.pageSize;
      return loaded < lastPage.total ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 60 * 1000,
    enabled: params.enabled,
  });
}

export function useWorkspaces(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: async () => {
      const response = await api.get<Workspace[]>("/api/v1/workspaces", { showErrorToast: true });
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled,
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

/**
 * Fetches the workspace overview payload and seeds the dependent caches
 * (workspace detail, stats, members, projects list) exactly as the
 * overview page expects them. Shared by `useWorkspaceOverview` and the
 * hover-prefetcher so navigation warms every cache the layout reads.
 */
export async function fetchWorkspaceOverview(
  qc: QueryClient,
  slug: string
): Promise<WorkspaceOverview> {
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
}

export function useWorkspaceOverview(slug: string) {
  const qc = useQueryClient();

  return useQuery({
    queryKey: [...workspaceKeys.detail(slug), "overview"] as const,
    queryFn: () => fetchWorkspaceOverview(qc, slug),
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

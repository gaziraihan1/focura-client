import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Task, TaskFilters, TaskSort, TasksResponse, TaskStats, TaskOverview } from "./useTask";
import { taskKeys, taskOverviewKeys, commentKeys, attachmentKeys } from "./taskKeys";
import { Activity, activityKeys } from "./useActivity";
import { Attachment, TaskComment } from "@/types/task.types";

export function useTasks(
  filters?: TaskFilters,
  page: number = 1,
  pageSize: number = 10,
  sort?: TaskSort,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: taskKeys.list(filters, page, pageSize, sort),
    enabled,
    queryFn: async (): Promise<TasksResponse> => {
      const params = new URLSearchParams();

      if (filters?.type && filters.type !== "all") params.append("type", filters.type);
      if (filters?.status && filters.status !== "all") params.append("status", filters.status);
      if (filters?.priority && filters.priority !== "all") params.append("priority", filters.priority);
      if (filters?.projectId) params.append("projectId", filters.projectId);
      if (filters?.workspaceId) params.append("workspaceId", filters.workspaceId);
      if (filters?.assigneeId) params.append("assigneeId", filters.assigneeId);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.labelIds?.length) params.append("labelIds", filters.labelIds.join(","));
      if (filters?.userId) params.append("userId", filters.userId);
      if (filters?.focusRequired) params.append("focusRequired", "true");

      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      if (sort?.sortBy) params.append("sortBy", sort.sortBy);
      if (sort?.sortOrder) params.append("sortOrder", sort.sortOrder);

      const response = await api.get<TasksResponse | Task[]>(
        `/api/v1/tasks?${params.toString()}`,
        { showErrorToast: true },
      );

      if (!response) {
        return { data: [], pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasNext: false, hasPrev: false } };
      }

      if ("data" in response && "pagination" in response) {
        return response as TasksResponse;
      }

      if (Array.isArray(response)) {
        return {
          data: response as Task[],
          pagination: { page, pageSize, totalCount: response.length, totalPages: Math.ceil(response.length / pageSize), hasNext: page < Math.ceil(response.length / pageSize), hasPrev: page > 1 },
        };
      }

      return { data: [], pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasNext: false, hasPrev: false } };
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useTaskOverview(taskId: string) {
  const qc = useQueryClient();

  return useQuery({
    queryKey: taskOverviewKeys.detail(taskId),
    queryFn: async (): Promise<TaskOverview> => {
      const res = await api.get<TaskOverview>(`/api/v1/tasks/${taskId}/overview`, { showErrorToast: true });
      const overview = res?.data as TaskOverview;

      qc.setQueryData(taskKeys.detail(taskId), overview.task);
      qc.setQueryData(commentKeys.byTask(taskId), overview.comments);
      qc.setQueryData(attachmentKeys.byTask(taskId), overview.attachments);

      return overview;
    },
    enabled: !!taskId,
    staleTime: 3 * 60 * 1000,
    retry: 1,
  });
}

export function useTaskStats(
  workspaceId?: string,
  type?: "all" | "personal" | "assigned" | "created",
) {
  return useQuery({
    queryKey: taskKeys.stat(workspaceId, type),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (workspaceId) params.append("workspaceId", workspaceId);
      if (type && type !== "all") params.append("type", type);

      const endpoint = `/api/v1/tasks/stats${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await api.get<TaskStats>(endpoint, { showErrorToast: true });
      return response?.data || null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: async () => {
      const response = await api.get<Task>(`/api/v1/tasks/${taskId}`, { showErrorToast: true });
      return response?.data;
    },
    enabled: !!taskId,
    staleTime: 3 * 60 * 1000,
  });
}

export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: commentKeys.byTask(taskId),
    queryFn: async () => {
      const response = await api.get<TaskComment[]>(`/api/v1/tasks/${taskId}/comments`);
      return response?.data || [];
    },
    enabled: !!taskId,
    staleTime: 3 * 60 * 1000,
  });
}

export function useTaskActivity(taskId: string) {
  return useQuery({
    queryKey: activityKeys.task(taskId),
    queryFn: async () => {
      const response = await api.get<Activity[]>(`/api/v1/tasks/${taskId}/activity`);
      return response?.data || [];
    },
    enabled: !!taskId,
  });
}

export function useTaskAttachments(taskId: string) {
  return useQuery({
    queryKey: attachmentKeys.byTask(taskId),
    queryFn: async () => {
      const response = await api.get<Attachment[]>(`/api/v1/tasks/${taskId}/attachments`);
      return response?.data || [];
    },
    enabled: !!taskId,
    staleTime: 3 * 60 * 1000,
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Attachment, TaskComment } from "@/types/task.types";
import { ProjectDetails, projectKeys } from "./useProjects";
import { Activity, activityKeys } from "./useActivity";

export interface Task {
  id: string;
  title: string;
  description: string;
  status:
    | "TODO"
    | "IN_PROGRESS"
    | "IN_REVIEW"
    | "BLOCKED"
    | "COMPLETED"
    | "CANCELLED";
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  dueDate: string | null;
  startDate?: string;
  estimatedHours?: number;
  createdBy: {
    id: string;
    name: string;
    image?: string;
  };
  assignees: Array<{
    user: {
      id: string;
      name: string;
      image?: string;
    };
  }>;
  project?: {
    id: string;
    slug: string;
    name: string;
    color: string;
    workspace: {
      id: string;
      name: string;
    };
  };
  _count: {
    comments: number;
    subtasks: number;
    files: number;
  };
  createdAt: string;
  updatedAt: string;
  timeTracking?: {
    hoursSinceCreation: number;
    hoursUntilDue: number | null;
    isOverdue: boolean;
    isDueToday: boolean;
    timeProgress: number | null;
  };
}

export interface TaskStats {
  personal: number;
  assigned: number;
  created: number;
  overdue: number;
  dueToday: number;
  byStatus: Record<string, number>;
  totalTasks?: number;
  inProgress?: number;
  completed?: number;
}

export type UserPlan = "FREE" | "PRO";
export type WorkspacePlan = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";

export interface PersonalQuotaInfo {
  plan: UserPlan;
  dailyLimit: number;
  usedToday: number;
  remaining: number;
  resetAt: string; // ISO date string
  perMinuteLimit: number | null;
}

export interface MemberQuotaInfo {
  userId: string;
  name: string | null;
  email: string;
  image: string | null;
  usedToday: number;
  memberLimit: number | null;
  remaining: number | null;
}

export interface WorkspaceQuotaInfo {
  plan: WorkspacePlan;
  dailyWorkspaceLimit: number | null;
  dailyPerMemberLimit: number | null;
  workspaceUsedToday: number;
  workspaceRemaining: number | null;
  perMinuteLimit: number | null;
  isUnlimited: boolean;
  resetAt: string;
  members: MemberQuotaInfo[];
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId?: string | null;
  workspaceId?: string | null;
  status: Task["status"];
  priority: Task["priority"];
  startDate?: string;
  dueDate?: string;
  estimatedHours?: number | null;
  assigneeIds?: string[];
  labelIds?: string[];
  intent?: "EXECUTION" | "PLANNING" | "REVIEW" | "LEARNING" | "COMMUNICATION";
  energyType?: "LOW" | "MEDIUM" | "HIGH";
  focusRequired?: boolean;
}

export interface TaskFilters {
  type?: "all" | "personal" | "assigned" | "created";
  status?: string;
  priority?: string;
  search?: string;
  projectId?: string;
  workspaceId?: string;
  assigneeId?: string;
  labelIds?: string[];
  userId?: string;
}

export interface TaskPagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TaskSort {
  sortBy?: "dueDate" | "priority" | "status" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface TasksResponse {
  data: Task[];
  pagination: TaskPagination;
}

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (
    filters?: TaskFilters,
    page?: number,
    pageSize?: number,
    sort?: TaskSort,
  ) => [...taskKeys.lists(), filters, page, pageSize, sort] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  stats: () => [...taskKeys.all, "stats"] as const,
  stat: (workspaceId?: string, type?: string) =>
    [...taskKeys.stats(), workspaceId || "personal", type || "all"] as const,
  quotas: () => [...taskKeys.all, "quota"] as const,
  personalQuota: () => [...taskKeys.quotas(), "personal"] as const,
  workspaceQuota: (workspaceId: string) =>
    [...taskKeys.quotas(), "workspace", workspaceId] as const,
};

function msUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date();
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

export function useTasks(
  filters?: TaskFilters,
  page: number = 1,
  pageSize: number = 10,
  sort?: TaskSort,
) {
  return useQuery({
    queryKey: taskKeys.list(filters, page, pageSize, sort),
    queryFn: async (): Promise<TasksResponse> => {
      const params = new URLSearchParams();

      if (filters?.type && filters.type !== "all")
        params.append("type", filters.type);
      if (filters?.status && filters.status !== "all")
        params.append("status", filters.status);
      if (filters?.priority && filters.priority !== "all")
        params.append("priority", filters.priority);
      if (filters?.projectId) params.append("projectId", filters.projectId);
      if (filters?.workspaceId)
        params.append("workspaceId", filters.workspaceId);
      if (filters?.assigneeId) params.append("assigneeId", filters.assigneeId);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.labelIds?.length)
        params.append("labelIds", filters.labelIds.join(","));
      if (filters?.userId) params.append("userId", filters.userId);

      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      if (sort?.sortBy) params.append("sortBy", sort.sortBy);
      if (sort?.sortOrder) params.append("sortOrder", sort.sortOrder);

      const response = await api.get<TasksResponse | Task[]>(
        `/api/v1/tasks?${params.toString()}`,
        { showErrorToast: true },
      );

      if (!response) {
        return {
          data: [],
          pagination: {
            page: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      if ("data" in response && "pagination" in response) {
        return response as TasksResponse;
      }

      if (Array.isArray(response)) {
        return {
          data: response as Task[],
          pagination: {
            page,
            pageSize,
            totalCount: response.length,
            totalPages: Math.ceil(response.length / pageSize),
            hasNext: page < Math.ceil(response.length / pageSize),
            hasPrev: page > 1,
          },
        };
      }

      return {
        data: [],
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export interface TaskOverview {
  task: Task;
  comments: TaskComment[];
  attachments: Attachment[];
}

export const taskOverviewKeys = {
  detail: (id: string) => [...taskKeys.details(), id, "overview"] as const,
};

export function useTaskOverview(taskId: string) {
  const qc = useQueryClient();

  return useQuery({
    queryKey: taskOverviewKeys.detail(taskId),
    queryFn:  async (): Promise<TaskOverview> => {
      const res = await api.get<TaskOverview>(
        `/api/v1/tasks/${taskId}/overview`,
        { showErrorToast: true },
      );
      const overview = res?.data as TaskOverview;

      // Seed all child caches from the single response
      qc.setQueryData(taskKeys.detail(taskId),       overview.task);
      qc.setQueryData(commentKeys.byTask(taskId),    overview.comments);
      qc.setQueryData(attachmentKeys.byTask(taskId), overview.attachments);

      return overview;
    },
    enabled:   !!taskId,
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
      const response = await api.get<TaskStats>(endpoint, {
        showErrorToast: true,
      });
      return response?.data || null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: async () => {
      const response = await api.get<Task>(`/api/v1/tasks/${taskId}`, {
        showErrorToast: true,
      });
      return response?.data;
    },
    enabled: !!taskId,
    staleTime: 3 * 60 * 1000,
  });
}

export function usePersonalQuota() {
  const qc = useQueryClient();

  useQuery({
    queryKey: [...taskKeys.personalQuota(), "__midnight_reset__"],
    queryFn: () => null,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchInterval: () => {
      const ms = msUntilMidnight();
      setTimeout(() => {
        qc.invalidateQueries({ queryKey: taskKeys.personalQuota() });
      }, ms);
      return false;
    },
  });

  return useQuery({
    queryKey: taskKeys.personalQuota(),
    queryFn: async (): Promise<PersonalQuotaInfo> => {
      const response = await api.get<PersonalQuotaInfo>(
        "/api/v1/tasks/quota/personal",
        {
          showErrorToast: true,
        },
      );
      return response?.data as PersonalQuotaInfo;
    },
    staleTime: 0,
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: false,
  });
}

export function useWorkspaceQuota(workspaceId: string | undefined) {
  const qc = useQueryClient();

  useQuery({
    queryKey: workspaceId
      ? [...taskKeys.workspaceQuota(workspaceId), "__midnight_reset__"]
      : ["__noop__"],
    queryFn: () => null,
    enabled: !!workspaceId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchInterval: () => {
      if (!workspaceId) return false;
      const ms = msUntilMidnight();
      setTimeout(() => {
        qc.invalidateQueries({
          queryKey: taskKeys.workspaceQuota(workspaceId!),
        });
      }, ms);
      return false;
    },
  });

  return useQuery({
    queryKey: workspaceId
      ? taskKeys.workspaceQuota(workspaceId)
      : ["__disabled__"],
    queryFn: async (): Promise<WorkspaceQuotaInfo> => {
      const response = await api.get<WorkspaceQuotaInfo>(
        `/api/v1/tasks/quota/workspace/${workspaceId}`,
        { showErrorToast: true },
      );
      return response?.data as WorkspaceQuotaInfo;
    },
    enabled: !!workspaceId,
    staleTime: 0,
    refetchInterval: 20 * 1000,
    refetchIntervalInBackground: false,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (newTask: CreateTaskDto) => {
      const response = await api.post<Task>("/api/v1/tasks", newTask, {
        showSuccessToast: true,
      });
      return response?.data;
    },
    onMutate: async (newTask) => {
      if (!newTask.projectId) return;

      await qc.cancelQueries({
        queryKey: projectKeys.detail(newTask.projectId),
      });

      const previous = qc.getQueryData(projectKeys.detail(newTask.projectId));

      // Optimistically append a placeholder task
      qc.setQueryData(projectKeys.detail(newTask.projectId), (old: ProjectDetails | undefined) => {
        if (!old) return old;
        const optimisticTask = {
          id: `optimistic-${Date.now()}`,
          title: newTask.title,
          description: newTask.description ?? null,
          status: newTask.status ?? "TODO",
          priority: newTask.priority ?? "MEDIUM",
          startDate: newTask.startDate ?? null,
          dueDate: newTask.dueDate ?? null,
          createdAt: new Date().toISOString(),
          assignees: [],
          _count: { comments: 0, subtasks: 0, files: 0 },
        };
        return {
          ...old,
          tasks: [...(old.tasks ?? []), optimisticTask],
          _count: { ...old._count, tasks: (old._count?.tasks ?? 0) + 1 },
        };
      });

      return { previous };
    },
    onError: (_err, variables, context) => {
      if (context?.previous && variables.projectId) {
        qc.setQueryData(
          projectKeys.detail(variables.projectId),
          context.previous,
        );
      }
    },
    onSettled: (_data, _err, variables) => {
      qc.invalidateQueries({ queryKey: taskKeys.lists() });
      qc.invalidateQueries({ queryKey: taskKeys.stats() });

      if (variables.projectId) {
        qc.invalidateQueries({
          queryKey: projectKeys.detail(variables.projectId),
        });
        qc.invalidateQueries({
          queryKey: [...projectKeys.details(), "slug"],
        });
      }
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      const response = await api.put<Task>(`/api/v1/tasks/${id}`, data, {
        showSuccessToast: true,
      });
      return response?.data;
    },
    onSuccess: (data) => {
      if (data) {
        qc.setQueryData(taskKeys.detail(data.id), data);
        qc.invalidateQueries({ queryKey: taskKeys.lists() });
        qc.invalidateQueries({ queryKey: taskKeys.stats() });
        setTimeout(() => {
          qc.invalidateQueries({ queryKey: activityKeys.task(data.id) });
        }, 800);
      }
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await api.delete(`/api/v1/tasks/${taskId}`, {
        showSuccessToast: true,
      });
      return response?.data;
    },
    onSuccess: (_, taskId) => {
      qc.removeQueries({ queryKey: taskKeys.detail(taskId) });
      qc.invalidateQueries({ queryKey: taskKeys.lists() });
      qc.invalidateQueries({ queryKey: taskKeys.stats() });
    },
  });
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Task["status"];
    }) => {
      const response = await api.patch<Task>(
        `/api/v1/tasks/${id}/status`,
        { status },
        { showSuccessToast: false },
      );
      return response?.data;
    },

    onMutate: async ({ id, status }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: taskKeys.detail(id) }),
        qc.cancelQueries({ queryKey: taskKeys.lists() }),
        qc.cancelQueries({ queryKey: projectKeys.all }), // ← covers all project caches
      ]);

      const previousTask = qc.getQueryData<Task>(taskKeys.detail(id));

      const projectCacheSnapshots: Array<{
        queryKey: readonly unknown[];
        data: ProjectDetails;
      }> = [];

      qc.getQueriesData<ProjectDetails>({ queryKey: projectKeys.all }).forEach(
        ([queryKey, projectData]) => {
          if (!projectData?.tasks) return;
          const taskExists = projectData.tasks.some((t) => t.id === id);
          if (!taskExists) return;

          projectCacheSnapshots.push({ queryKey, data: projectData });

          qc.setQueryData<ProjectDetails>(queryKey, {
            ...projectData,
            tasks: projectData.tasks.map((t) =>
              t.id === id ? { ...t, status } : t,
            ),
          });
        },
      );

      if (previousTask) {
        qc.setQueryData<Task>(taskKeys.detail(id), { ...previousTask, status });
      }

      return { previousTask, projectCacheSnapshots };
    },

    onError: (_, { id }, context) => {
      if (context?.previousTask) {
        qc.setQueryData(taskKeys.detail(id), context.previousTask);
      }
      context?.projectCacheSnapshots?.forEach(({ queryKey, data }) => {
        qc.setQueryData(queryKey, data);
      });
    },

    onSettled: (data, _, { id }) => {
      if (data) {
        qc.setQueryData<Task>(taskKeys.detail(id), data);
      }

      qc.invalidateQueries({ queryKey: taskKeys.detail(id) });
      qc.invalidateQueries({ queryKey: taskKeys.lists() });
      qc.invalidateQueries({ queryKey: taskKeys.stats() });

      setTimeout(() => {
        qc.invalidateQueries({ queryKey: activityKeys.task(id) });
      }, 800);
    },
  });
}

export const commentKeys = {
  all: ["comments"] as const,
  byTask: (taskId: string) => [...commentKeys.all, taskId] as const,
};

export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: commentKeys.byTask(taskId),
    queryFn: async () => {
      const response = await api.get<TaskComment[]>(
        `/api/v1/tasks/${taskId}/comments`,
      );
      return response?.data || [];
    },
    enabled: !!taskId,
    staleTime: 3 * 60 * 1000, 
  });
}

export function useAddComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      content,
      parentId,
    }: {
      taskId: string;
      content: string;
      parentId?: string | null;
    }) => {
      const response = await api.post<TaskComment>(
        `/api/v1/tasks/${taskId}/comments`,
        { content, parentId: parentId ?? null },
        { showSuccessToast: false },
      );
      return response?.data;
    },
    onSuccess: (newComment, { taskId }) => {
      qc.setQueryData<TaskComment[]>(commentKeys.byTask(taskId), (old) => {
        if (!old) return [newComment!];
        if (old.some((c) => c.id === newComment!.id)) return old;
        return [...old, newComment!];
      });
      qc.invalidateQueries({ queryKey: commentKeys.byTask(taskId) });
      qc.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      setTimeout(() => {
        qc.invalidateQueries({ queryKey: activityKeys.task(taskId) });
      }, 800);
    },
  });
}

export function useTaskActivity(taskId: string) {
  return useQuery({
    queryKey: activityKeys.task(taskId),
    queryFn: async () => {
      const response = await api.get<Activity[]>(
        `/api/v1/tasks/${taskId}/activity`,
      );
      return response?.data || [];
    },
    enabled: !!taskId,
  });
}

export const attachmentKeys = {
  all: ["attachments"] as const,
  byTask: (taskId: string) => [...attachmentKeys.all, taskId] as const,
};

export function useTaskAttachments(taskId: string) {
  return useQuery({
    queryKey: attachmentKeys.byTask(taskId),
    queryFn: async () => {
      const response = await api.get<Attachment[]>(
        `/api/v1/tasks/${taskId}/attachments`,
      );
      return response?.data || [];
    },
    enabled: !!taskId,
    staleTime: 3 * 60 * 1000, 
  });
}

export function useUploadAttachment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, file }: { taskId: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.upload<Attachment>(
        `/api/v1/tasks/${taskId}/attachments`,
        formData,
        { showSuccessToast: true },
      );
      return response?.data;
    },
    onSuccess: (_, { taskId }) => {
      qc.invalidateQueries({ queryKey: attachmentKeys.byTask(taskId) });
      qc.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      setTimeout(() => {
        qc.invalidateQueries({ queryKey: activityKeys.task(taskId) });
      }, 800);
    },
  });
}

export function useDeleteAttachment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      attachmentId,
    }: {
      taskId: string;
      attachmentId: string;
    }) => {
      const response = await api.delete(
        `/api/v1/tasks/${taskId}/attachments/${attachmentId}`,
        { showSuccessToast: true },
      );
      return response?.data;
    },
    onSuccess: (_, { taskId }) => {
      qc.invalidateQueries({ queryKey: attachmentKeys.byTask(taskId) });
      qc.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      setTimeout(() => {
        qc.invalidateQueries({ queryKey: activityKeys.task(taskId) });
      }, 800);
    },
  });
}

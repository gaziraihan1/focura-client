import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Attachment } from '@/types/task.types';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
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


export type UserPlan      = 'FREE' | 'PRO';
export type WorkspacePlan = 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';

export interface PersonalQuotaInfo {
  plan:           UserPlan;
  dailyLimit:     number;
  usedToday:      number;
  remaining:      number;
  resetAt:        string;   // ISO date string
  perMinuteLimit: number | null;
}

export interface MemberQuotaInfo {
  userId:      string;
  name:        string | null;
  email:       string;
  image:       string | null
  usedToday:   number;
  memberLimit: number | null;
  remaining:   number | null;
}

export interface WorkspaceQuotaInfo {
  plan:                WorkspacePlan;
  dailyWorkspaceLimit: number | null;
  dailyPerMemberLimit: number | null;
  workspaceUsedToday:  number;
  workspaceRemaining:  number | null;
  perMinuteLimit:      number | null;
  isUnlimited:         boolean;
  resetAt:             string;   
  members:             MemberQuotaInfo[];  
}


export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId?: string | null;
  workspaceId?: string | null;
  status: Task['status'];
  priority: Task['priority'];
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
  type?: 'all' | 'personal' | 'assigned' | 'created';
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
  sortBy?: 'dueDate' | 'priority' | 'status' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface TasksResponse {
  data: Task[];
  pagination: TaskPagination;
}


export const taskKeys = {
  all:     ['tasks'] as const,
  lists:   () => [...taskKeys.all, 'list'] as const,
  list:    (filters?: TaskFilters, page?: number, pageSize?: number, sort?: TaskSort) =>
             [...taskKeys.lists(), filters, page, pageSize, sort] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail:  (id: string) => [...taskKeys.details(), id] as const,
  stats:   () => [...taskKeys.all, 'stats'] as const,
  stat:    (workspaceId?: string, type?: string) =>
             [...taskKeys.stats(), workspaceId || 'personal', type || 'all'] as const,
  quotas:  () => [...taskKeys.all, 'quota'] as const,
  personalQuota: () => [...taskKeys.quotas(), 'personal'] as const,
  workspaceQuota: (workspaceId: string) => [...taskKeys.quotas(), 'workspace', workspaceId] as const,
};

function msUntilMidnight(): number {
  const now       = new Date();
  const midnight  = new Date();
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
    // enabled: filters !== undefined,
    queryFn: async (): Promise<TasksResponse> => {
      const params = new URLSearchParams();

      if (filters?.type && filters.type !== 'all') params.append('type', filters.type);
      if (filters?.status   && filters.status   !== 'all') params.append('status',   filters.status);
      if (filters?.priority && filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters?.projectId)   params.append('projectId',   filters.projectId);
      if (filters?.workspaceId) params.append('workspaceId', filters.workspaceId);
      if (filters?.assigneeId)  params.append('assigneeId',  filters.assigneeId);
      if (filters?.search)      params.append('search',      filters.search);
      if (filters?.labelIds?.length) params.append('labelIds', filters.labelIds.join(','));
      if (filters?.userId) params.append('userId', filters.userId);

      params.append('page',     page.toString());
      params.append('pageSize', pageSize.toString());

      if (sort?.sortBy)    params.append('sortBy',    sort.sortBy);
      if (sort?.sortOrder) params.append('sortOrder', sort.sortOrder);

      const response = await api.get<TasksResponse | Task[]>(
        `/api/tasks?${params.toString()}`,
        { showErrorToast: true },
      );

      if (!response) {
        return {
          data: [],
          pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasNext: false, hasPrev: false },
        };
      }

      if ('data' in response && 'pagination' in response) {
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
            hasNext:    page < Math.ceil(response.length / pageSize),
            hasPrev:    page > 1,
          },
        };
      }

      return {
        data: [],
        pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasNext: false, hasPrev: false },
      };
    },
    staleTime:       2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useTaskStats(
  workspaceId?: string,
  type?: 'all' | 'personal' | 'assigned' | 'created',
) {
  return useQuery({
    queryKey: taskKeys.stat(workspaceId, type),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (workspaceId) params.append('workspaceId', workspaceId);
      if (type && type !== 'all') params.append('type', type);

      const endpoint = `/api/tasks/stats${params.toString() ? `?${params.toString()}` : ''}`;
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
      const response = await api.get<Task>(`/api/tasks/${taskId}`, {
        showErrorToast: true,
      });
      return response?.data;
    },
    enabled:   !!taskId,
    staleTime: 3 * 60 * 1000,
  });
}

export function usePersonalQuota() {
  const queryClient = useQueryClient();

  useQuery({
    queryKey: [...taskKeys.personalQuota(), '__midnight_reset__'],
    queryFn:  () => null,
    staleTime: Infinity,
    gcTime:    Infinity,
    refetchInterval: () => {
      const ms = msUntilMidnight();
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: taskKeys.personalQuota() });
      }, ms);
      return false; 
    },
  });

  return useQuery({
    queryKey: taskKeys.personalQuota(),
    queryFn: async (): Promise<PersonalQuotaInfo> => {
      const response = await api.get<PersonalQuotaInfo>('/api/tasks/quota/personal', {
        showErrorToast: true,
      });
      return response?.data as PersonalQuotaInfo;
    },
    staleTime:       0,           
    refetchInterval: 30 * 1000,   
    refetchIntervalInBackground: false,
  });
}

export function useWorkspaceQuota(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  useQuery({
    queryKey: workspaceId
      ? [...taskKeys.workspaceQuota(workspaceId), '__midnight_reset__']
      : ['__noop__'],
    queryFn:  () => null,
    enabled:  !!workspaceId,
    staleTime: Infinity,
    gcTime:    Infinity,
    refetchInterval: () => {
      if (!workspaceId) return false;
      const ms = msUntilMidnight();
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: taskKeys.workspaceQuota(workspaceId!) });
      }, ms);
      return false;
    },
  });

  return useQuery({
    queryKey: workspaceId ? taskKeys.workspaceQuota(workspaceId) : ['__disabled__'],
    queryFn: async (): Promise<WorkspaceQuotaInfo> => {
      const response = await api.get<WorkspaceQuotaInfo>(
        `/api/tasks/quota/workspace/${workspaceId}`,
        { showErrorToast: true },
      );
      return response?.data as WorkspaceQuotaInfo;
    },
    enabled:         !!workspaceId,
    staleTime:       0,
    refetchInterval: 20 * 1000,
    refetchIntervalInBackground: false,
  });
}


export function useCreateTask() {
  const queryClient = useQueryClient();
  const router      = useRouter();

  return useMutation({
    mutationFn: async (newTask: CreateTaskDto) => {
      const response = await api.post<Task>('/api/tasks', newTask, {
        showSuccessToast: true,
      });
      return response?.data;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });

      if (task?.project?.workspace?.id) {
        queryClient.invalidateQueries({
          queryKey: taskKeys.workspaceQuota(task.project.workspace.id),
        });
      } else {
        queryClient.invalidateQueries({ queryKey: taskKeys.personalQuota() });
      }

      router.push('/dashboard/tasks');
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      const response = await api.put<Task>(`/api/tasks/${id}`, data, {
        showSuccessToast: true,
      });
      return response?.data;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(taskKeys.detail(data.id), data);
        queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
      }
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await api.delete(`/api/tasks/${taskId}`, {
        showSuccessToast: true,
      });
      return response?.data;
    },
    onSuccess: (_, taskId) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Task['status'] }) => {
      const response = await api.patch<Task>(
        `/api/tasks/${id}/status`,
        { status },
        { showSuccessToast: false },
      );
      return response?.data;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(id) });
      const previousTask = queryClient.getQueryData<Task>(taskKeys.detail(id));
      if (previousTask) {
        queryClient.setQueryData<Task>(taskKeys.detail(id), { ...previousTask, status });
      }
      return { previousTask };
    },
    onError: (_, { id }, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(taskKeys.detail(id), context.previousTask);
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
    },
  });
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

export const commentKeys = {
  all:    ['comments'] as const,
  byTask: (taskId: string) => [...commentKeys.all, taskId] as const,
};

export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: commentKeys.byTask(taskId),
    queryFn: async () => {
      const response = await api.get<Comment[]>(`/api/tasks/${taskId}/comments`);
      return response?.data || [];
    },
    enabled: !!taskId,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, content }: { taskId: string; content: string }) => {
      const response = await api.post<Comment>(
        `/api/tasks/${taskId}/comments`,
        { content },
        { showSuccessToast: false },
      );
      return response?.data;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
  });
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

export const activityKeys = {
  all:    ['activities'] as const,
  byTask: (taskId: string) => [...activityKeys.all, taskId] as const,
};

export function useTaskActivity(taskId: string) {
  return useQuery({
    queryKey: activityKeys.byTask(taskId),
    queryFn: async () => {
      const response = await api.get<Activity[]>(`/api/tasks/${taskId}/activity`);
      return response?.data || [];
    },
    enabled: !!taskId,
  });
}


export const attachmentKeys = {
  all:    ['attachments'] as const,
  byTask: (taskId: string) => [...attachmentKeys.all, taskId] as const,
};

export function useTaskAttachments(taskId: string) {
  return useQuery({
    queryKey: attachmentKeys.byTask(taskId),
    queryFn: async () => {
      const response = await api.get<Attachment[]>(`/api/tasks/${taskId}/attachments`);
      return response?.data || [];
    },
    enabled: !!taskId,
  });
}

export function useUploadAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, file }: { taskId: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.upload<Attachment>(
        `/api/tasks/${taskId}/attachments`,
        formData,
        { showSuccessToast: true },
      );
      return response?.data;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: attachmentKeys.byTask(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, attachmentId }: { taskId: string; attachmentId: string }) => {
      const response = await api.delete(
        `/api/tasks/${taskId}/attachments/${attachmentId}`,
        { showSuccessToast: true },
      );
      return response?.data;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: attachmentKeys.byTask(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
  });
}
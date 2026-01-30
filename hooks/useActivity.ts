import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface Activity {
  id: string;
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'COMPLETED' | 'ASSIGNED' | 'UNASSIGNED' | 'COMMENTED' | 'UPLOADED' | 'MOVED' | 'STATUS_CHANGED' | 'PRIORITY_CHANGED';
  entityType: 'TASK' | 'PROJECT' | 'COMMENT' | 'FILE' | 'WORKSPACE' | 'MEMBER';
  entityId: string;
  userId: string;
  workspaceId: string;
  taskId?: string;
  metadata?: any;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  workspace: {
    id: string;
    name: string;
  };
  task?: {
    id: string;
    title: string;
    status: string;
    priority?: string;
    project?: {
      id: true;
      name: string;
      color: string;
    };
  };
}

export interface ActivityStats {
  total: number;
  today: number;
  byAction: Record<string, number>;
}

export interface ActivityFilters {
  workspaceId?: string;
  entityType?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

// Query keys
export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (filters?: ActivityFilters) => [...activityKeys.lists(), filters] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (id: string) => [...activityKeys.details(), id] as const,
  workspace: (workspaceId: string, filters?: Partial<ActivityFilters>) => 
    [...activityKeys.all, 'workspace', workspaceId, filters] as const,
  task: (taskId: string, filters?: Partial<ActivityFilters>) => 
    [...activityKeys.all, 'task', taskId, filters] as const,
  stats: (workspaceId?: string) => 
    [...activityKeys.all, 'stats', workspaceId || 'all'] as const,
  grouped: (workspaceId?: string, days?: number) => 
    [...activityKeys.all, 'grouped', workspaceId || 'all', days || 7] as const,
};

/**
 * Fetch user activities with filters
 */
export function useActivities(filters?: ActivityFilters) {
  return useQuery({
    queryKey: activityKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters?.workspaceId) {
        params.append('workspaceId', filters.workspaceId);
      }
      if (filters?.entityType) {
        params.append('entityType', filters.entityType);
      }
      if (filters?.action) {
        params.append('action', filters.action);
      }
      if (filters?.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters?.endDate) {
        params.append('endDate', filters.endDate);
      }
      if (filters?.limit) {
        params.append('limit', filters.limit.toString());
      }
      if (filters?.offset) {
        params.append('offset', filters.offset.toString());
      }
      
      const queryString = params.toString();
      const endpoint = `/api/activities${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get<Activity[]>(endpoint, {
        showErrorToast: true,
      });
      return response.data || [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Fetch activities with infinite scroll
 */
export function useInfiniteActivities(filters?: Omit<ActivityFilters, 'offset'>) {
  return useInfiniteQuery({
    queryKey: activityKeys.list(filters),
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      
      if (filters?.workspaceId) {
        params.append('workspaceId', filters.workspaceId);
      }
      if (filters?.entityType) {
        params.append('entityType', filters.entityType);
      }
      if (filters?.action) {
        params.append('action', filters.action);
      }
      if (filters?.limit) {
        params.append('limit', filters.limit.toString());
      }
      params.append('offset', pageParam.toString());
      
      const queryString = params.toString();
      const endpoint = `/api/activities${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get<{ data: Activity[]; meta: any }>(endpoint);
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.meta?.hasMore) {
        return (pages.length * (filters?.limit || 50));
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Fetch workspace activities
 */
export function useWorkspaceActivities(
  workspaceId: string,
  filters?: Partial<ActivityFilters>
) {
  return useQuery({
    queryKey: activityKeys.workspace(workspaceId, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters?.action) {
        params.append('action', filters.action);
      }
      if (filters?.entityType) {
        params.append('entityType', filters.entityType);
      }
      if (filters?.limit) {
        params.append('limit', filters.limit.toString());
      }
      if (filters?.offset) {
        params.append('offset', filters.offset.toString());
      }
      
      const queryString = params.toString();
      const endpoint = `/api/activities/workspace/${workspaceId}${
        queryString ? `?${queryString}` : ''
      }`;
      
      const response = await api.get<Activity[]>(endpoint, {
        showErrorToast: true,
      });
      return response.data || [];
    },
    enabled: !!workspaceId,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Fetch task activities
 */
export function useTaskActivities(
  taskId: string,
  filters?: Partial<ActivityFilters>
) {
  return useQuery({
    queryKey: activityKeys.task(taskId, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters?.limit) {
        params.append('limit', filters.limit.toString());
      }
      if (filters?.offset) {
        params.append('offset', filters.offset.toString());
      }
      
      const queryString = params.toString();
      const endpoint = `/api/activities/task/${taskId}${
        queryString ? `?${queryString}` : ''
      }`;
      
      const response = await api.get<Activity[]>(endpoint, {
        showErrorToast: true,
      });
      return response.data || [];
    },
    enabled: !!taskId,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Fetch activity statistics
 */
export function useActivityStats(workspaceId?: string) {
  return useQuery({
    queryKey: activityKeys.stats(workspaceId),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (workspaceId) {
        params.append('workspaceId', workspaceId);
      }
      
      const queryString = params.toString();
      const endpoint = `/api/activities/stats${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get<ActivityStats>(endpoint);
      return response.data || { total: 0, today: 0, byAction: {} };
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Delete an activity
 */
export function useDeleteActivity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activityId: string) => {
      const response = await api.delete(`/api/activities/${activityId}`, {
        showSuccessToast: true,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all activity queries
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

/**
 * Clear activities with optional filters
 */
export function useClearActivities() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (filters?: { workspaceId?: string; before?: string }) => {
      const params = new URLSearchParams();
      
      if (filters?.workspaceId) {
        params.append('workspaceId', filters.workspaceId);
      }
      if (filters?.before) {
        params.append('before', filters.before);
      }
      
      const queryString = params.toString();
      const endpoint = `/api/activities/clear/all${
        queryString ? `?${queryString}` : ''
      }`;
      
      const response = await api.delete(endpoint, {
        showSuccessToast: true,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all activity queries
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}
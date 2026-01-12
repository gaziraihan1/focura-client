import { api, axiosInstance } from '@/lib/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ============================================
// TYPES
// ============================================

export interface Label {
  id: string;
  name: string;
  color: string;
  description?: string | null;
  workspaceId?: string | null;
  createdById: string;
  workspace?: {
    id: string;
    name: string;
  } | null;
  createdBy?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
  _count?: {
    tasks: number;
  };
}

export interface CreateLabelDto {
  name: string;
  color: string;
  description?: string;
  createdAt: Date;
  workspaceId?: string;
}

export interface UpdateLabelDto {
  name?: string;
  color?: string;
  description?: string | null;
}

export interface LabelWithTasks extends Label {
  tasks: {
    task: {
      id: string;
      title: string;
      status: string;
      priority: string;
    };
  }[];
}

// ============================================
// QUERY KEYS
// ============================================

export const labelKeys = {
  all: ['labels'] as const,
  lists: () => [...labelKeys.all, 'list'] as const,
  list: (filters: { workspaceId?: string }) => [...labelKeys.lists(), filters] as const,
  details: () => [...labelKeys.all, 'detail'] as const,
  detail: (id: string) => [...labelKeys.details(), id] as const,
  popular: (workspaceId?: string) => [...labelKeys.all, 'popular', workspaceId] as const,
};

// ============================================
// QUERIES
// ============================================

/**
 * Get all labels for workspace or user
 */
export function useLabels(workspaceId?: string) {
  return useQuery({
    queryKey: labelKeys.list({ workspaceId }),
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (workspaceId) {
          params.append('workspaceId', workspaceId);
        }
        
        const endpoint = `/api/labels${params.toString() ? `?${params.toString()}` : ''}`;
        
        // Using axiosInstance directly to get raw response
        const response = await axiosInstance.get(endpoint);
        
        console.log('📥 Labels response:', response.data);
        
        // Backend returns array directly, not wrapped in ApiResponse
        const labels = response.data;
        
        if (!labels) {
          console.warn('No data in labels response');
          return [];
        }
        
        if (!Array.isArray(labels)) {
          console.warn('Labels is not an array:', labels);
          return [];
        }
        
        return labels;
      } catch (error) {
        console.error('Error fetching labels:', error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get single label by ID with tasks
 */
export function useLabel(id: string) {
  return useQuery({
    queryKey: labelKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<LabelWithTasks>(`/api/labels/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get most used labels
 */
export function usePopularLabels(workspaceId?: string, limit: number = 10) {
  return useQuery({
    queryKey: labelKeys.popular(workspaceId),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (workspaceId) params.append('workspaceId', workspaceId);
      params.append('limit', limit.toString());
      
      const response = await api.get<Label[]>(`/api/labels/popular?${params.toString()}`);
      return response.data || [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Create a new label
 */
export function useCreateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLabelDto) => {
      const response = await api.post<Label>('/api/labels', data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate all label queries to refetch
      queryClient.invalidateQueries({ queryKey: labelKeys.all });
      
      // Also invalidate specific workspace labels
      if (data?.workspaceId || variables.workspaceId) {
        queryClient.invalidateQueries({ 
          queryKey: labelKeys.list({ workspaceId: data?.workspaceId || variables.workspaceId }) 
        });
      }
    },
    onError: (error) => {
      console.error('Error creating label:', error);
    },
  });
}

/**
 * Update a label
 */
export function useUpdateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLabelDto }) => {
      const response = await api.patch<Label>(`/api/labels/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Update cache for this specific label if data exists
      if (data) {
        queryClient.setQueryData(labelKeys.detail(data.id), data);
      }
      
      // Invalidate all label lists to refetch
      queryClient.invalidateQueries({ queryKey: labelKeys.all });
    },
    onError: (error) => {
      console.error('Error updating label:', error);
    },
  });
}

/**
 * Delete a label
 */
export function useDeleteLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<{ message: string; tasksAffected: number }>(`/api/labels/${id}`);
      return { ...response.data, id }; // Include the ID in the response
    },
    onSuccess: (data, deletedId) => {
      queryClient.removeQueries({ queryKey: labelKeys.detail(deletedId) });
      
      queryClient.invalidateQueries({ queryKey: labelKeys.all });
      
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Error deleting label:', error);
    },
  });
}

/**
 * Add label to task
 */
export function useAddLabelToTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ labelId, taskId }: { labelId: string; taskId: string }) => {
      const response = await api.post(`/api/labels/${labelId}/tasks/${taskId}`);
      return response.data;
    },
    onSuccess: (_, { labelId, taskId }) => {
      // Invalidate label detail (task count changed)
      queryClient.invalidateQueries({ queryKey: labelKeys.detail(labelId) });
      
      // Invalidate task (it now has this label)
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Remove label from task
 */
export function useRemoveLabelFromTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ labelId, taskId }: { labelId: string; taskId: string }) => {
      const response = await api.delete(`/api/labels/${labelId}/tasks/${taskId}`);
      return response.data;
    },
    onSuccess: (_, { labelId, taskId }) => {
      // Invalidate label detail (task count changed)
      queryClient.invalidateQueries({ queryKey: labelKeys.detail(labelId) });
      
      // Invalidate task (label removed)
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// ============================================
// HELPER HOOKS
// ============================================

/**
 * Get labels as select options
 */
export function useLabelOptions(workspaceId?: string) {
  const { data: labels = [], isLoading } = useLabels(workspaceId);

  const options = labels.map((label) => ({
    value: label.id,
    label: label.name,
    color: label.color,
  }));

  return { options, isLoading };
}

/**
 * Check if label name exists
 */
export function useLabelNameExists(workspaceId?: string) {
  const { data: labels = [] } = useLabels(workspaceId);

  return (name: string, excludeId?: string) => {
    return labels.some(
      (label) => 
        label.name.toLowerCase() === name.toLowerCase() && 
        label.id !== excludeId
    );
  };
}
'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useWorkspace } from '@/hooks/useWorkspace';


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


export const labelKeys = {
  all: ['labels'] as const,
  lists: () => [...labelKeys.all, 'list'] as const,
  list: (filters: { workspaceId?: string }) => [...labelKeys.lists(), filters] as const,
  details: () => [...labelKeys.all, 'detail'] as const,
  detail: (id: string) => [...labelKeys.details(), id] as const,
  popular: (workspaceId?: string) => [...labelKeys.all, 'popular', workspaceId] as const,
};


export function useLabels() {
  const params = useParams<{ workspaceSlug: string }>();
  const workspaceSlug = params?.workspaceSlug;

  const { data: workspace } = useWorkspace(workspaceSlug || '');
  const workspaceId = workspace?.id;

  return useQuery({
    queryKey: labelKeys.list({ workspaceId }),
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (workspaceId) {
          params.append('workspaceId', workspaceId);
        }

        const endpoint = `/api/labels${params.toString() ? `?${params.toString()}` : ''}`;
        
        const response = await api.get<Label[]>(endpoint);
        
        const labels = response?.data;

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
    enabled: !!workspaceId, // don't fire until workspace is resolved
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

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

export function usePopularLabels(limit: number = 10) {
  const params = useParams<{ workspaceSlug: string }>();
  const workspaceSlug = params?.workspaceSlug;

  const { data: workspace } = useWorkspace(workspaceSlug || '');
  const workspaceId = workspace?.id;

  return useQuery({
    queryKey: labelKeys.popular(workspaceId),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (workspaceId) params.append('workspaceId', workspaceId);
      params.append('limit', limit.toString());

      const response = await api.get<Label[]>(`/api/labels/popular?${params.toString()}`);
      return response.data || [];
    },
    enabled: !!workspaceId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useCreateLabel() {
  const queryClient = useQueryClient();
  const params = useParams<{ workspaceSlug: string }>();
  const workspaceSlug = params?.workspaceSlug;
  const { data: workspace } = useWorkspace(workspaceSlug || '');
  const workspaceId = workspace?.id;

  return useMutation({
    mutationFn: async (data: CreateLabelDto) => {
      // If workspaceId isn't in the DTO, inject it from the current workspace
      const payload = { ...data };
      if (!payload.workspaceId && workspaceId) {
        payload.workspaceId = workspaceId;
      }
      const response = await api.post<Label>('/api/labels', payload, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: labelKeys.all });

      if (data?.workspaceId || variables.workspaceId) {
        queryClient.invalidateQueries({
          queryKey: labelKeys.list({ workspaceId: data?.workspaceId || variables.workspaceId }),
        });
      }
    },
    onError: (error) => {
      console.error('Error creating label:', error);
    },
  });
}

export function useUpdateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLabelDto }) => {
      const response = await api.patch<Label>(`/api/labels/${id}`, data, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(labelKeys.detail(data.id), data);
      }
      queryClient.invalidateQueries({ queryKey: labelKeys.all });
    },
    onError: (error) => {
      console.error('Error updating label:', error);
    },
  });
}

export function useDeleteLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<{ message: string; tasksAffected: number }>(
        `/api/labels/${id}`,
        {
          showSuccessToast: true,
          showErrorToast: true,
        }
      );
      return { ...response.data, id };
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

export function useAddLabelToTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ labelId, taskId }: { labelId: string; taskId: string }) => {
      const response = await api.post(`/api/labels/${labelId}/tasks/${taskId}`);
      return response.data;
    },
    onSuccess: (_, { labelId, taskId }) => {
      queryClient.invalidateQueries({ queryKey: labelKeys.detail(labelId) });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useRemoveLabelFromTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ labelId, taskId }: { labelId: string; taskId: string }) => {
      const response = await api.delete(`/api/labels/${labelId}/tasks/${taskId}`);
      return response.data;
    },
    onSuccess: (_, { labelId, taskId }) => {
      queryClient.invalidateQueries({ queryKey: labelKeys.detail(labelId) });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useLabelOptions() {
  const { data: labels = [], isLoading } = useLabels();

  const options = labels.map((label) => ({
    value: label.id,
    label: label.name,
    color: label.color,
  }));

  return { options, isLoading };
}

export function useLabelNameExists() {
  const { data: labels = [] } = useLabels();

  return (name: string, excludeId?: string) => {
    return labels.some(
      (label) => label.name.toLowerCase() === name.toLowerCase() && label.id !== excludeId
    );
  };
}
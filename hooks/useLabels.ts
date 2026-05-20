'use client';

import { useParams }                        from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api }                              from '@/lib/axios';
import { useWorkspace }                     from '@/hooks/useWorkspace';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Label {
  id:          string;
  name:        string;
  color:       string;
  description?: string | null;
  workspaceId?: string | null;
  createdById: string;
  workspace?: {
    id:   string;
    name: string;
    slug: string;
  } | null;
  createdBy?: {
    id:    string;
    name:  string | null;
    image: string | null;
  };
  createdAt: Date;
  _count: { tasks: number };
}

export interface CreateLabelDto {
  name:        string;
  color:       string;
  description?: string;
  workspaceId?: string;
}

export interface UpdateLabelDto {
  name?:        string;
  color?:       string;
  description?: string | null;
}

export interface LabelWithTasks extends Label {
  tasks: {
    task: {
      id:       string;
      title:    string;
      status:   string;
      priority: string;
      workspace: { id: string; name: string; slug: string };
      project:   { id: string; name: string; slug: string };
    };
  }[];
}

export interface PaginationMeta {
  page:        number;
  limit:       number;
  total:       number;
  totalPages:  number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success:    boolean;
  data:       T[];
  pagination: PaginationMeta;
}

export interface LabelTasksFilters {
  status?:   'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
  priority?: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
}

// ─── Query key factory ────────────────────────────────────────────────────────

export const labelKeys = {
  all:     ['labels'] as const,
  lists:   () => [...labelKeys.all, 'list'] as const,
  list:    (filters: { workspaceId?: string; page?: number; limit?: number }) =>
             [...labelKeys.lists(), filters] as const,
  details: () => [...labelKeys.all, 'detail'] as const,
  detail:  (id: string) => [...labelKeys.details(), id] as const,
  tasks:   (id: string, filters?: LabelTasksFilters & { page?: number; limit?: number }) =>
             [...labelKeys.detail(id), 'tasks', filters] as const,
  popular: (workspaceId?: string, page?: number) =>
             [...labelKeys.all, 'popular', workspaceId, page] as const,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildQuery(params: Record<string, string | number | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && String(val) !== '') qs.set(key, String(val));
  }
  const str = qs.toString();
  return str ? `?${str}` : '';
}

// ─── useLabels — paginated list ───────────────────────────────────────────────

// ─── useLabels — paginated list ───────────────────────────────────────────────

export interface UseLabelsParams {
  page?:  number;
  limit?: number;
}

// Add response type for labels list
export interface LabelsResponse {
  success: boolean;
  data: Label[];
  pagination: PaginationMeta;
}

// ─── useLabels — paginated list ───────────────────────────────────────────────

export function useLabels(params: UseLabelsParams = {}) {
  const { page = 1, limit = 20 } = params;

  const routeParams   = useParams<{ workspaceSlug: string }>();
  const workspaceSlug = routeParams?.workspaceSlug;
  const { data: workspace } = useWorkspace(workspaceSlug || '');
  const workspaceId = workspace?.id;

  return useQuery<LabelsResponse>({
    queryKey: labelKeys.list({ workspaceId, page, limit }),
    queryFn: async () => {
      try {
        const qs = buildQuery({ workspaceId, page, limit });
        const response = await api.get(`/api/v1/labels${qs}`) as LabelsResponse;
        return {
          ...response,
          data: Array.isArray(response?.data) ? response.data : [],
        };
      } catch {
        return {
          success: false,
          data: [],
          pagination: {
            page, limit, total: 0, totalPages: 0,
            hasNextPage: false, hasPrevPage: false,
          },
        };
      }
    },
    enabled:         !!workspaceId,
    staleTime:       10 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}
// ─── useLabel — single label metadata ────────────────────────────────────────

export interface LabelResponse {
  success: boolean;
  data: LabelWithTasks;
}

export function useLabel(id: string) {
  return useQuery<LabelResponse>({
    queryKey: labelKeys.detail(id),
    queryFn:  async () => {
      const response = await api.get(`/api/v1/labels/${id}`);
      return response as LabelResponse;
    },
    enabled:   !!id,
    staleTime: 5 * 60 * 1000,
  });
}
// ─── useLabelTasks — paginated tasks for a label ──────────────────────────────

export interface UseLabelTasksParams extends LabelTasksFilters {
  page?:  number;
  limit?: number;
}


// ─── useLabelTasks — paginated tasks for a label ──────────────────────────────

export interface UseLabelTasksParams extends LabelTasksFilters {
  page?:  number;
  limit?: number;
}

// Define the response type that matches what the backend actually sends
export interface LabelTasksResponse {
  success: boolean;
  data: LabelWithTasks['tasks'];
  pagination: PaginationMeta;
}

export function useLabelTasks(id: string, params: UseLabelTasksParams = {}) {
  const { page = 1, limit = 20, status, priority } = params;

  return useQuery<LabelTasksResponse>({
    queryKey: labelKeys.tasks(id, { page, limit, status, priority }),
    queryFn:  async () => {
      const qs = buildQuery({ page, limit, status, priority });
      // Don't pass a generic type to api.get, let it return the raw response
      const response = await api.get(`/api/v1/labels/${id}/tasks${qs}`);
      // Cast the response to our expected type
      return response as LabelTasksResponse;
    },
    enabled:         !!id,
    staleTime:       5 * 60 * 1000,
    gcTime: 15 * 60 * 1000, // 15 minutes
    placeholderData: (prev) => prev,
  });
}
// ─── usePopularLabels — paginated popular labels ──────────────────────────────

export interface UsePopularLabelsParams {
  page?:  number;
  limit?: number;
}

export function usePopularLabels(params: UsePopularLabelsParams = {}) {
  const { page = 1, limit = 10 } = params;

  const routeParams = useParams<{ workspaceSlug: string }>();
  const workspaceSlug = routeParams?.workspaceSlug;
  const { data: workspace } = useWorkspace(workspaceSlug || '');
  const workspaceId = workspace?.id;

  return useQuery<Label[]>({
    queryKey: labelKeys.popular(workspaceId, page),

    queryFn: async () => {
      const qs = buildQuery({ workspaceId, page, limit });

      const res = await api.get<PaginatedResponse<Label>>(
        `/api/v1/labels/popular${qs}`
      );

      // IMPORTANT: api.get already returns ApiResponse<T>
      const data = res?.data;

      if (!data) return [];

      return Array.isArray(data) ? data : data.data ?? [];
    },

    enabled: !!workspaceId,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: (prev) => prev,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateLabel() {
  const qc            = useQueryClient();
  const routeParams   = useParams<{ workspaceSlug: string }>();
  const workspaceSlug = routeParams?.workspaceSlug;
  const { data: workspace } = useWorkspace(workspaceSlug || '');
  const workspaceId = workspace?.id;

  return useMutation({
    mutationFn: async (data: CreateLabelDto) => {
      const payload = { ...data };
      if (!payload.workspaceId && workspaceId) payload.workspaceId = workspaceId;
      const response = await api.post<Label>('/api/v1/labels', payload, {
        showSuccessToast: true,
        showErrorToast:   true,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: labelKeys.all });
      if (data?.workspaceId || variables.workspaceId) {
        qc.invalidateQueries({
          queryKey: labelKeys.list({ workspaceId: data?.workspaceId || variables.workspaceId }),
        });
      }
    },
  });
}

export function useUpdateLabel() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLabelDto }) => {
      const response = await api.patch<Label>(`/api/v1/labels/${id}`, data, {
        showSuccessToast: true,
        showErrorToast:   true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data) qc.setQueryData(labelKeys.detail(data.id), data);
      qc.invalidateQueries({ queryKey: labelKeys.all });
    },
  });
}

export function useDeleteLabel() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<{ message: string; tasksAffected: number }>(
        `/api/v1/labels/${id}`,
        { showSuccessToast: true, showErrorToast: true },
      );
      return { ...response.data, id };
    },
    onSuccess: (data, deletedId) => {
      qc.removeQueries({ queryKey: labelKeys.detail(deletedId) });
      qc.invalidateQueries({ queryKey: labelKeys.all });
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useAddLabelToTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ labelId, taskId }: { labelId: string; taskId: string }) => {
      const response = await api.post(`/api/v1/labels/${labelId}/tasks/${taskId}`);
      return response.data;
    },
    onSuccess: (_, { labelId, taskId }) => {
      qc.invalidateQueries({ queryKey: labelKeys.detail(labelId) });
      qc.invalidateQueries({ queryKey: labelKeys.tasks(labelId) });
      qc.invalidateQueries({ queryKey: ['tasks', taskId] });
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useRemoveLabelFromTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ labelId, taskId }: { labelId: string; taskId: string }) => {
      const response = await api.delete(`/api/v1/labels/${labelId}/tasks/${taskId}`);
      return response.data;
    },
    onSuccess: (_, { labelId, taskId }) => {
      qc.invalidateQueries({ queryKey: labelKeys.detail(labelId) });
      qc.invalidateQueries({ queryKey: labelKeys.tasks(labelId) });
      qc.invalidateQueries({ queryKey: ['tasks', taskId] });
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// ─── Derived helpers ──────────────────────────────────────────────────────────

export function useLabelOptions() {
  const { data } = useLabels();
  const labels   = data?.data ?? [];

  return {
    options:   labels.map((label) => ({ value: label.id, label: label.name, color: label.color })),
    isLoading: !data,
  };
}

export function useLabelNameExists() {
  const { data } = useLabels();
  const labels   = data?.data ?? [];

  return (name: string, excludeId?: string) =>
    labels.some(
      (label) => label.name.toLowerCase() === name.toLowerCase() && label.id !== excludeId,
    );
}
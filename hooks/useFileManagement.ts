'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

// ==================== TYPES ====================

export interface FileWithDetails {
  id: string;
  name: string;
  originalName: string;
  size: number;
  sizeMB: number;
  mimeType: string;
  url: string;
  uploadedAt: Date;
  folder: string | null;
  uploadedBy: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  task: {
    id: string;
    title: string;
  } | null;
  project: {
    id: string;
    name: string;
  } | null;
}

export interface FileFilters {
  search?: string;
  fileType?: string;
  uploadedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'name' | 'size' | 'date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface FilesResponse {
  files: FileWithDetails[];
  total: number;
  hasMore: boolean;
  isAdmin: boolean;
}

export interface FileTypeStat {
  type: string;
  count: number;
  sizeMB: number;
}

export interface Uploader {
  id: string;
  name: string | null;
  email: string;
  fileCount: number;
}

// ==================== QUERY KEYS ====================

export const fileManagementKeys = {
  all: (workspaceId: string) => ['file-management', workspaceId] as const,
  files: (workspaceId: string, filters?: FileFilters) =>
    [...fileManagementKeys.all(workspaceId), 'files', filters] as const,
  stats: (workspaceId: string) =>
    [...fileManagementKeys.all(workspaceId), 'stats'] as const,
  uploaders: (workspaceId: string) =>
    [...fileManagementKeys.all(workspaceId), 'uploaders'] as const,
};

// ==================== HOOKS ====================

export function useFiles(workspaceId: string, filters?: FileFilters) {
  return useQuery({
    queryKey: fileManagementKeys.files(workspaceId, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.fileType) params.append('fileType', filters.fileType);
      if (filters?.uploadedBy) params.append('uploadedBy', filters.uploadedBy);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get<FilesResponse>(
        `/api/file-management/${workspaceId}/files?${params.toString()}`
      );
      return response?.data as FilesResponse;
    },
    enabled: !!workspaceId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useFileStats(workspaceId: string) {
  return useQuery({
    queryKey: fileManagementKeys.stats(workspaceId),
    queryFn: async () => {
      const response = await api.get<FileTypeStat[]>(
        `/api/file-management/${workspaceId}/stats`
      );
      return response?.data as FileTypeStat[];
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUploaders(workspaceId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: fileManagementKeys.uploaders(workspaceId),
    queryFn: async () => {
      const response = await api.get<Uploader[]>(
        `/api/file-management/${workspaceId}/uploaders`
      );
      return response?.data as Uploader[];
    },
    enabled: !!workspaceId && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeleteFile(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      const response = await api.delete(
        `/api/file-management/${workspaceId}/files/${fileId}`,
        {
          showSuccessToast: true,
          showErrorToast: true,
        }
      );
      return response;
    },
    onSuccess: () => {
      // Invalidate all file queries for this workspace
      queryClient.invalidateQueries({
        queryKey: fileManagementKeys.all(workspaceId),
      });
    },
  });
}
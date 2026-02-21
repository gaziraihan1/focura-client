"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

// Types
export interface StorageInfo {
  usedMB: number;
  totalMB: number;
  remainingMB: number;
  percentage: number;
  plan: string;
  workspaceId: string;
  workspaceName: string;
}

export interface UserContribution {
  userId: string;
  userName: string | null;
  userEmail: string;
  usageMB: number;
  fileCount: number;
  percentage: number;
}

export interface MyContribution {
  usageMB: number;
  fileCount: number;
  percentage: number;
}

export interface StorageBreakdown {
  attachments: number;
  workspaceFiles: number;
  projectFiles: number;
  total: number;
}

export interface LargestFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  sizeMB: number;
  mimeType: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: {
    id: string;
    name: string | null;
    email: string;
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

export interface StorageTrend {
  date: Date;
  usageMB: number;
}

export interface FileTypeBreakdown {
  mimeType: string;
  category: string;
  count: number;
  sizeMB: number;
}

export interface WorkspaceSummary {
  workspaceId: string;
  workspaceName: string;
  plan: string;
  usageMB: number;
  totalMB: number;
  remainingMB: number;
  percentage: number;
  role: string;
  fileCount: number;
}

export interface WorkspaceStorageOverview {
  storageInfo: StorageInfo;
  breakdown: StorageBreakdown;
  largestFiles: LargestFile[];
  trend: StorageTrend[];
  fileTypes: FileTypeBreakdown[];
  myContribution: MyContribution;
  userContributions: UserContribution[] | null;
  isAdmin: boolean;
}

// Query keys
export const storageKeys = {
  all: ["storage"] as const,
  workspaces: () => [...storageKeys.all, "workspaces"] as const,
  workspace: (workspaceId: string) =>
    [...storageKeys.all, "workspace", workspaceId] as const,
  overview: (workspaceId: string) =>
    [...storageKeys.workspace(workspaceId), "overview"] as const,
  info: (workspaceId: string) =>
    [...storageKeys.workspace(workspaceId), "info"] as const,
  myContribution: (workspaceId: string) =>
    [...storageKeys.workspace(workspaceId), "my-contribution"] as const,
  userContributions: (workspaceId: string) =>
    [...storageKeys.workspace(workspaceId), "user-contributions"] as const,
  largestFiles: (workspaceId: string, limit?: number) =>
    [...storageKeys.workspace(workspaceId), "largest", limit] as const,
};

// Hooks

// Get all workspaces summary for user
export function useWorkspacesSummary() {
  return useQuery({
    queryKey: storageKeys.workspaces(),
    queryFn: async () => {
      const response = await api.get<WorkspaceSummary[]>(
        "/api/storage/workspaces",
      );
      return response?.data as WorkspaceSummary[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Get complete workspace storage overview
export function useWorkspaceStorageOverview(workspaceId: string) {
  return useQuery({
    queryKey: storageKeys.overview(workspaceId),
    queryFn: async () => {
      const response = await api.get<WorkspaceStorageOverview>(
        `/api/storage/${workspaceId}/overview`,
      );
      return response?.data as WorkspaceStorageOverview;
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
}

// Get workspace storage info
export function useWorkspaceStorageInfo(workspaceId: string) {
  return useQuery({
    queryKey: storageKeys.info(workspaceId),
    queryFn: async () => {
      const response = await api.get<StorageInfo>(
        `/api/storage/${workspaceId}/info`,
      );
      return response?.data as StorageInfo;
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
}

// Get my contribution to workspace
export function useMyContribution(workspaceId: string) {
  return useQuery({
    queryKey: storageKeys.myContribution(workspaceId),
    queryFn: async () => {
      const response = await api.get<MyContribution>(
        `/api/storage/${workspaceId}/my-contribution`,
      );
      return response?.data as MyContribution;
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
}

// Get user contributions (admin only)
export function useUserContributions(
  workspaceId: string,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: storageKeys.userContributions(workspaceId),
    queryFn: async () => {
      const response = await api.get<UserContribution[]>(
        `/api/storage/${workspaceId}/user-contributions`,
      );
      return response?.data as UserContribution[];
    },
    enabled: !!workspaceId && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

// Get largest files
export function useLargestFiles(workspaceId: string, limit: number = 10) {
  return useQuery({
    queryKey: storageKeys.largestFiles(workspaceId, limit),
    queryFn: async () => {
      const response = await api.get<LargestFile[]>(
        `/api/storage/${workspaceId}/largest-files?limit=${limit}`,
      );
      return response?.data as LargestFile[];
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutations

// Bulk delete files
export function useBulkDeleteFiles(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileIds: string[]) => {
      const response = await api.post<{
        deletedCount: number;
        freedMB: number;
      }>(
        `/api/storage/${workspaceId}/bulk-delete`,
        { fileIds },
        {
          showSuccessToast: true,
          showErrorToast: true,
        },
      );
      return response?.data as { deletedCount: number; freedMB: number };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: storageKeys.workspace(workspaceId),
      });
      queryClient.invalidateQueries({ queryKey: storageKeys.workspaces() });
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

// Delete single file
export function useDeleteFile(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      const response = await api.delete<{ freedMB: number }>(
              `/api/storage/files/${fileId}`,
        {
          showSuccessToast: true,
          showErrorToast: true,
        },
      );
      return response?.data as { freedMB: number };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: storageKeys.workspace(workspaceId),
      });
      queryClient.invalidateQueries({ queryKey: storageKeys.workspaces() });
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

// Check if file can be uploaded
export function useCheckUpload(workspaceId: string) {
  return useMutation({
    mutationFn: async (fileSize: number) => {
      const response = await api.post<{ allowed: boolean; reason?: string }>(
        `/api/storage/${workspaceId}/check-upload`,
        { fileSize },
        { showErrorToast: true },
      );
      return response?.data as { allowed: boolean; reason?: string };
    },
  });
}

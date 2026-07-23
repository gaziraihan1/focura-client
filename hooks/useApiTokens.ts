/**
 * hooks/useApiTokens.ts
 *
 * React Query hooks for API token management.
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiToken {
  id: string;
  name: string;
  prefix: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateApiTokenResponse extends ApiToken {
  token: string; // Only returned on creation
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const apiTokenKeys = {
  all: ["api-tokens"] as const,
  list: () => [...apiTokenKeys.all, "list"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Fetch all API tokens for the current user.
 */
export function useApiTokens() {
  return useQuery({
    queryKey: apiTokenKeys.list(),
    queryFn: async () => {
      const result = await api.get<ApiToken[]>("/api/v1/api-keys", {
        showErrorToast: false,
      });
      return result?.data ?? [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Create a new API token.
 */
export function useCreateApiToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; expiresInDays?: number }) => {
      const result = await api.post<CreateApiTokenResponse>("/api/v1/api-keys", data, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return result?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiTokenKeys.list() });
    },
  });
}

/**
 * Toggle API token active status.
 */
export function useToggleApiToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tokenId: string) => {
      const result = await api.patch<ApiToken>(
        `/api/v1/api-keys/${tokenId}/toggle`,
        undefined,
        { showSuccessToast: true, showErrorToast: true }
      );
      return result?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiTokenKeys.list() });
    },
  });
}

/**
 * Delete an API token.
 */
export function useDeleteApiToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tokenId: string) => {
      await api.delete(`/api/v1/api-keys/${tokenId}`, {
        showSuccessToast: true,
        showErrorToast: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiTokenKeys.list() });
    },
  });
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Integration {
  id: string;
  name: string;
  provider: string;
  active: boolean;
  connectedAt?: string;
  config?: IntegrationConfig;
  syncStatus?: SyncStatus;
  webhookUrl?: string;
}

export interface IntegrationConfig {
  workspaceId?: string;
  syncDirection?: 'one-way' | 'two-way';
  autoSync?: boolean;
  syncInterval?: number;
  notifications?: boolean;
  selectedChannels?: string[];
  selectedRepos?: string[];
}

export interface SyncStatus {
  lastSyncAt?: string;
  lastSyncStatus?: 'success' | 'failed' | 'pending';
  syncCount?: number;
  error?: string;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const integrationKeys = {
  all: ['integrations'] as const,
  lists: () => [...integrationKeys.all, 'list'] as const,
  list: () => [...integrationKeys.lists()] as const,
  details: () => [...integrationKeys.all, 'detail'] as const,
  detail: (id: string) => [...integrationKeys.details(), id] as const,
  byProvider: (provider: string) =>
    [...integrationKeys.all, 'provider', provider] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetch all user integrations
 */
export function useIntegrations() {
  return useQuery({
    queryKey: integrationKeys.list(),
    queryFn: async () => {
      const result = await api.get<Integration[]>('/api/v1/user/integrations', {
        showErrorToast: false,
      });
      return result?.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get a specific integration by provider
 */
export function useIntegration(provider: string) {
  const { data: integrations, ...rest } = useIntegrations();
  const integration = integrations?.find((i) => i.provider === provider);
  return { integration, ...rest };
}

/**
 * Check if a provider is connected
 */
export function useIsConnected(provider: string) {
  const { integration } = useIntegration(provider);
  return integration?.active === true;
}

/**
 * Initiate OAuth connection to a provider
 */
export function useConnectIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (provider: string) => {
      // Try to get OAuth URL first
      const result = await api.post<{ authUrl: string }>(
        '/api/v1/user/integrations/auth',
        { provider },
      );

      if (result?.success && result.data?.authUrl) {
        // Redirect to OAuth consent screen
        window.location.href = result.data.authUrl;
        return { redirected: true };
      }

      // Fallback: direct POST (for backward compatibility)
      await api.post('/api/v1/user/integrations', { provider });
      return { redirected: false };
    },
    onSuccess: (_, provider) => {
      // Only invalidate if not redirected (redirect will cause page reload)
      queryClient.invalidateQueries({ queryKey: integrationKeys.list() });
      if (!window.location.href.includes('authUrl')) {
        toast.success(`${provider} connected successfully`);
      }
    },
    onError: (_, provider) => {
      toast.error(`Failed to connect ${provider}`);
    },
  });
}

/**
 * Disconnect an integration
 */
export function useDisconnectIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, provider }: { id: string; provider: string }) => {
      await api.delete(`/api/v1/user/integrations/${id}`);
      return { id, provider };
    },
    onSuccess: (_, { provider }) => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.list() });
      toast.success(`${provider} disconnected`);
    },
    onError: (_, { provider }) => {
      toast.error(`Failed to disconnect ${provider}`);
    },
  });
}

/**
 * Update integration configuration
 */
export function useUpdateIntegrationConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      config,
    }: {
      id: string;
      config: IntegrationConfig;
    }) => {
      await api.put(`/api/v1/user/integrations/${id}/config`, { config });
      return { id, config };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.list() });
      toast.success('Configuration saved');
    },
    onError: () => {
      toast.error('Failed to save configuration');
    },
  });
}

/**
 * Trigger manual sync for an integration
 */
export function useSyncIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await api.post<{
        syncId: string;
        status: string;
      }>(`/api/v1/user/integrations/${id}/sync`);
      return result?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.list() });
      toast.success('Sync started');
    },
    onError: () => {
      toast.error('Failed to start sync');
    },
  });
}

/**
 * Get integration statistics
 */
export function useIntegrationStats() {
  const { data: integrations, isLoading } = useIntegrations();

  if (isLoading || !integrations) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      needsAttention: 0,
      isLoading,
    };
  }

  return {
    total: integrations.length,
    active: integrations.filter((i) => i.active).length,
    inactive: integrations.filter((i) => !i.active).length,
    needsAttention: integrations.filter(
      (i) => i.syncStatus?.lastSyncStatus === 'failed',
    ).length,
    isLoading,
  };
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

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

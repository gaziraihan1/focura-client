'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const slackKeys = {
  all: ['slack-integration'] as const,
  status: () => [...slackKeys.all, 'status'] as const,
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Integration {
  id: string;
  provider: string;
  active: boolean;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Check if Slack integration is connected and active
 */
export function useSlackIntegration() {
  const { data, isLoading, error } = useQuery({
    queryKey: slackKeys.status(),
    queryFn: async () => {
      const result = await api.get<Integration[]>('/api/v1/user/integrations', {
        showErrorToast: false,
      });
      const integrations = result?.data || [];
      const slackIntegration = integrations.find(
        (i) => i.provider === 'slack',
      );
      return {
        integration: slackIntegration || null,
        isConnected: slackIntegration?.active === true,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    integration: data?.integration || null,
    isConnected: data?.isConnected || false,
    loading: isLoading,
    error,
  };
}

/**
 * Get workspace Slack integration
 */
export function useWorkspaceSlackIntegration(workspaceSlug: string) {
  const { data, isLoading } = useQuery({
    queryKey: [...slackKeys.all, 'workspace', workspaceSlug],
    queryFn: async () => {
      const result = await api.get<Integration[]>(
        `/api/v1/workspace-integrations/${workspaceSlug}`,
        { showErrorToast: false },
      );
      const integrations = result?.data || [];
      const slackIntegration = integrations.find(
        (i) => i.provider === 'slack',
      );
      return {
        integration: slackIntegration || null,
        isConnected: slackIntegration?.active === true,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    integration: data?.integration || null,
    isConnected: data?.isConnected || false,
    loading: isLoading,
  };
}

/**
 * Check if a specific task has a Slack link
 */
export function hasSlackLink(task: {
  slackChannelId?: string | null;
  slackMessageTs?: string | null;
}): boolean {
  return !!(task.slackChannelId && task.slackMessageTs);
}

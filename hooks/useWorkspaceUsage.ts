// hooks/useWorkspaceUsage.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { WorkspaceUsageData } from '@/types/workspace-usage.types';

interface UseWorkspaceUsageOptions {
  enabled?: boolean;
}

export function useWorkspaceUsage(
  workspaceId: string | undefined,
  options: UseWorkspaceUsageOptions = {}
) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['workspace-usage', workspaceId],
    queryFn: async () => {
      if (!workspaceId) throw new Error('Workspace ID is required');

      const response = await api.get<WorkspaceUsageData>(
        `/api/workspace-usage/${workspaceId}/usage`
      );

      return response.data;
    },
    enabled: !!workspaceId && enabled, // ← both conditions must be true
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
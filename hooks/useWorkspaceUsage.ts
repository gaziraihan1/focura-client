// hooks/useWorkspaceUsage.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { WorkspaceUsageData } from '@/types/workspace-usage.types';

export function useWorkspaceUsage(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['workspace-usage', workspaceId],
    queryFn: async () => {
      if (!workspaceId) throw new Error('Workspace ID is required');
      
      const response = await api.get<WorkspaceUsageData>(
        `/api/workspace-usage/${workspaceId}/usage`
      );
      
      return response.data;
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
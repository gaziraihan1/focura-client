import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface Label {
  id: string;
  name: string;
  color: string;
}

export const labelKeys = {
  all: ['labels'] as const,
  lists: () => [...labelKeys.all, 'list'] as const,
  byWorkspace: (workspaceId?: string) => [...labelKeys.lists(), workspaceId] as const,
};

export function useLabels(workspaceId?: string) {
  return useQuery({
    queryKey: labelKeys.byWorkspace(workspaceId),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (workspaceId) params.append('workspaceId', workspaceId);

      const endpoint = `/api/labels${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<Label[]>(endpoint);
      return response.data || [];
    },
    enabled: workspaceId !== undefined,
    staleTime: 10 * 60 * 1000, 
  });
}
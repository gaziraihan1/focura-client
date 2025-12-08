import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

export const teamKeys = {
  all: ['team'] as const,
  members: (workspaceId?: string) => [...teamKeys.all, 'members', workspaceId] as const,
};

export function useTeamMembers(workspaceId?: string) {
  return useQuery({
    queryKey: teamKeys.members(workspaceId),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (workspaceId) params.append('workspaceId', workspaceId);

      const endpoint = `/api/user/workspace-members${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<TeamMember[]>(endpoint);
      return response.data || [];
    },
    enabled: workspaceId !== undefined,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
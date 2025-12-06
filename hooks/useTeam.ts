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
  members: () => [...teamKeys.all, 'members'] as const,
};

export function useTeamMembers() {
  return useQuery({
    queryKey: teamKeys.members(),
    queryFn: async () => {
      const response = await api.get<TeamMember[]>('/api/user/workspace-members');
      return response.data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
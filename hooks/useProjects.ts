import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface Project {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async () => {
      const response = await api.get<Project[]>('/api/projects');
      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000, 
  });
}

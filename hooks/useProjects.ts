import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface ProjectMember {
  user: {
    id: string;
    name: string;
    image?: string;
  };
  role?: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  description?: string;
  status?: string;
  priority?: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  startDate?: string | null;
  dueDate?: string | null;
  createdAt?: string;
  workspaceId?: string;
  isMember?: boolean;
  _count?: {
    tasks?: number;
    members?: number;
  };
  members?: ProjectMember[];
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  priority?: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  startDate?: string;
  dueDate?: string;
  workspaceId: string;
}

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  byWorkspace: (workspaceId?: string) => [...projectKeys.lists(), workspaceId] as const,
};

export const useProjects = (workspaceId?: string) => {
  return useQuery<Project[]>({
    queryKey: projectKeys.byWorkspace(workspaceId),
    queryFn: async () => {
      const res = await api.get<Project[]>(`/api/projects/${workspaceId}`);
      return res.data || [];
    },
    enabled: !!workspaceId,  // ⬅ only run when workspaceId exists
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateProjectDto) => {
      const res = await api.post<Project>('/api/projects', payload, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return res.data;
    },
    onSuccess: (project) => {
      if (project?.workspaceId) {
        queryClient.invalidateQueries({ queryKey: projectKeys.byWorkspace(project.workspaceId) });
      } else {
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      }
    },
  });
};


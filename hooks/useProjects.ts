// hooks/useProjects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

// ========================================================
// TYPES
// ========================================================

export interface ProjectMember {
  id: string;
  userId: string;
  role: 'MANAGER' | 'COLLABORATOR' | 'VIEWER';
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate?: string;
  createdAt: string;
  assignees: {
    user: {
      id: string;
      name: string;
      image?: string;
    };
  }[];
  _count: {
    comments: number;
  };
}

export interface ProjectDetails {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  status: string;
  priority: string;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  workspace?: {
    id: string;
    name: string;
    ownerId: string;
  };
  members: ProjectMember[];
  tasks: Task[];
  stats: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    totalMembers: number;
    projectDays: number;
    topPerformer?: {
      id: string;
      name: string;
      image?: string;
    };
  };
  isAdmin: boolean;
}

// DTO for creating a project
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

// DTO for updating a project
export interface UpdateProjectDto {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  priority?: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  startDate?: string;
  dueDate?: string;
}

// DTO for adding a project member
export interface AddProjectMemberDto {
  userId: string;
  role?: 'MANAGER' | 'COLLABORATOR' | 'VIEWER';
}

// ========================================================
// QUERY KEYS
// ========================================================

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...projectKeys.lists(), workspaceId] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// ========================================================
// QUERIES
// ========================================================

// Get projects by workspace
export const useProjects = (workspaceId?: string) => {
  return useQuery({
    queryKey: projectKeys.list(workspaceId || ''),
    queryFn: async () => {
      const res = await api.get(`/api/projects/workspace/${workspaceId}`);
      return res.data as any[];
    },
    enabled: !!workspaceId,
  });
};

// Get project details
export const useProjectDetails = (projectId?: string) => {
  return useQuery({
    queryKey: projectKeys.detail(projectId || ''),
    queryFn: async () => {
      const res = await api.get(`/api/projects/${projectId}`);
      return res.data as ProjectDetails;
    },
    enabled: !!projectId,
  });
};

// ========================================================
// MUTATIONS
// ========================================================

// Create project
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProjectDto) => {
      const res = await api.post('/api/projects', data, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.list(variables.workspaceId),
      });
    },
  });
};

// Update project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, data }: { projectId: string; data: UpdateProjectDto }) => {
      const res = await api.patch(`/api/projects/${projectId}`, data, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.projectId),
      });
    },
  });
};

// Delete project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string) => {
      const res = await api.delete(`/api/projects/${projectId}`, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.lists(),
      });
    },
  });
};

// ========================================================
// PROJECT MEMBER MUTATIONS
// ========================================================

// Add project member
export const useAddProjectMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, data }: { projectId: string; data: AddProjectMemberDto }) => {
      const res = await api.post(`/api/projects/${projectId}/members`, data, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.projectId),
      });
    },
  });
};

// Update project member role
export const useUpdateProjectMemberRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      memberId,
      role,
    }: {
      projectId: string;
      memberId: string;
      role: 'MANAGER' | 'COLLABORATOR' | 'VIEWER';
    }) => {
      const res = await api.patch(
        `/api/projects/${projectId}/members/${memberId}`,
        { role },
        {
          showSuccessToast: true,
          showErrorToast: true,
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.projectId),
      });
    },
  });
};

// Remove project member
export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, memberId }: { projectId: string; memberId: string }) => {
      const res = await api.delete(`/api/projects/${projectId}/members/${memberId}`, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.projectId),
      });
    },
  });
};
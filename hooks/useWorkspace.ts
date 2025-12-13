// hooks/use-workspaces.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';

// Types
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  // Keep optional alias for older API responses if any
  workspaceSlug?: string;
  description?: string;
  logo?: string;
  color?: string;
  isPublic: boolean;
  allowInvites: boolean;
  plan: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
  maxMembers: number;
  maxStorage: number;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  members: WorkspaceMember[];
  _count: {
    projects: number;
    members: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
  joinedAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  color?: string;
  logo?: string;
  isPublic?: boolean;
  plan?: Workspace['plan'];
}

export interface WorkspaceStats {
  totalProjects: number;
  totalTasks: number;
  totalMembers: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
}

// Query Keys
export const workspaceKeys = {
  all: ['workspaces'] as const,
  lists: () => [...workspaceKeys.all, 'list'] as const,
  details: () => [...workspaceKeys.all, 'detail'] as const,
  detail: (slug: string) => [...workspaceKeys.details(), slug] as const,
  members: (id: string) => [...workspaceKeys.all, id, 'members'] as const,
  stats: (id: string) => [...workspaceKeys.all, id, 'stats'] as const,
};

// ============================================
// GET - Fetch all user workspaces
export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: async () => {
      const response = await api.get<Workspace[]>('/api/workspaces', {
        showErrorToast: true,
      });
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================
// GET - Fetch single workspace by slug
export function useWorkspace(workspaceSlug: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceSlug),
    queryFn: async () => {
      const response = await api.get<Workspace>(`/api/workspaces/${workspaceSlug}`, {
        showErrorToast: true,
      });
      return response.data;
    },
    enabled: typeof workspaceSlug === "string" && workspaceSlug.length > 0,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

// ============================================
// POST - Create workspace
export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<Workspace, unknown, CreateWorkspaceDto>({
    mutationFn: async (data: CreateWorkspaceDto): Promise<Workspace> => {
      const response = await api.post<Workspace>('/api/workspaces', data, {
        showErrorToast: true, // Let axios interceptor handle all errors
        showSuccessToast: true,
      });
      return response.data as Workspace;
    },
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      
      const slug = workspace?.workspaceSlug ?? workspace?.slug;
      if (slug) {
        router.push(`/dashboard/workspaces/${slug}`);
      }
    },
  });
}

// ============================================
// PUT - Update workspace
export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  
  return useMutation<Workspace, unknown, { id: string; data: Partial<CreateWorkspaceDto> }>({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateWorkspaceDto> }): Promise<Workspace> => {
      const response = await api.put<Workspace>(`/api/workspaces/${id}`, data, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return response.data as Workspace;
    },
    onSuccess: (workspace) => {
      // Update cache
      const slug = workspace.workspaceSlug ?? workspace.slug;
      if (slug) {
        queryClient.setQueryData(workspaceKeys.detail(slug), workspace);
      }
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}

// ============================================
// DELETE - Delete workspace
export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/workspaces/${id}`, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      router.push('/dashboard/workspaces');
    },
  });
}

// ============================================
// GET - Fetch workspace members
export function useWorkspaceMembers(workspaceId?: string) {
  const key = workspaceId ?? '';
  return useQuery({
    queryKey: workspaceKeys.members(key),
    queryFn: async () => {
      const response = await api.get<WorkspaceMember[]>(
        `/api/workspaces/${workspaceId}/members`,
        {
          showErrorToast: true,
        }
      );
      return response.data || [];
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================
// POST - Invite member
export function useInviteMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      workspaceId, 
      email, 
      role 
    }: { 
      workspaceId: string; 
      email: string; 
      role: 'ADMIN' | 'MEMBER' | 'GUEST' 
    }) => {
      const response = await api.post(
        `/api/workspaces/${workspaceId}/invite`,
        { email, role },
        { 
          showSuccessToast: true,
          showErrorToast: true,
        }
      );
      return response.data;
    },
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) });
    },
  });
}

// ============================================
// DELETE - Remove member
export function useRemoveMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      workspaceId, 
      memberId 
    }: { 
      workspaceId: string; 
      memberId: string 
    }) => {
      const response = await api.delete(
        `/api/workspaces/${workspaceId}/members/${memberId}`,
        { 
          showSuccessToast: true,
          showErrorToast: true,
        }
      );
      return response.data;
    },
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) });
    },
  });
}

// ============================================
// PUT - Update member role
export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      workspaceId, 
      memberId, 
      role 
    }: { 
      workspaceId: string; 
      memberId: string; 
      role: 'ADMIN' | 'MEMBER' | 'GUEST' 
    }) => {
      const response = await api.put(
        `/api/workspaces/${workspaceId}/members/${memberId}/role`,
        { role },
        { 
          showSuccessToast: true,
          showErrorToast: true,
        }
      );
      return response.data;
    },
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) });
    },
  });
}

// ============================================
// GET - Workspace statistics
export function useWorkspaceStats(workspaceId: string) {
  return useQuery({
    queryKey: workspaceKeys.stats(workspaceId),
    queryFn: async () => {
      const response = await api.get<WorkspaceStats>(
        `/api/workspaces/${workspaceId}/stats`,
        {
          showErrorToast: true,
        }
      );
      return response.data;
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ============================================
// POST - Accept invitation
export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<Workspace, unknown, string>({
    mutationFn: async (token: string): Promise<Workspace> => {
      const response = await api.post<Workspace>(
        `/api/workspaces/invitations/${token}/accept`,
        {},
        { 
          showSuccessToast: true,
          showErrorToast: true,
        }
      );
      return response.data as Workspace;
    },
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      const slug = workspace.workspaceSlug ?? workspace.slug;
      if (slug) {
        router.push(`/dashboard/${slug}`);
      }
    },
  });
}

// ============================================
// POST - Leave workspace
export function useLeaveWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await api.post(
        `/api/workspaces/${workspaceId}/leave`,
        {},
        { 
          showSuccessToast: true,
          showErrorToast: true,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      router.push('/dashboard/workspaces');
    },
  });
}
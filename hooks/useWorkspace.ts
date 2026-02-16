import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

// Types
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  // Keep optional alias for older API responses if any
  // workspaceSlug?: string;
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

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';

export interface WorkspaceRoleResult {
  role: WorkspaceRole | null;
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
  isGuest: boolean;
  
  // Permission checks
  canManageWorkspace: boolean;  
  canManageMembers: boolean;    
  canCreateProjects: boolean;    
  
  canEditProjects: boolean;      
  
  canDeleteProjects: boolean;   
  canInviteMembers: boolean;    
  canRemoveMembers: boolean;    
  canEditSettings: boolean;     
  canDeleteWorkspace: boolean;  
  canViewContent: boolean;     
  
  currentMember: WorkspaceMember | null;
  userId: string | null;
  
  isLoading: boolean;
  hasAccess: boolean;
}

export const workspaceKeys = {
  all: ['workspaces'] as const,
  lists: () => [...workspaceKeys.all, 'list'] as const,
  details: () => [...workspaceKeys.all, 'detail'] as const,
  detail: (slug: string) => [...workspaceKeys.details(), slug] as const,
  members: (id: string) => [...workspaceKeys.all, id, 'members'] as const,
  stats: (id: string) => [...workspaceKeys.all, id, 'stats'] as const,
};

export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: async () => {
      const response = await api.get<Workspace[]>('/api/workspaces', {
        showErrorToast: true,
      });
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, 
  });
}

// In hooks/use-workspaces.ts
export function useWorkspace(workspaceSlugOrId: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceSlugOrId),
    queryFn: async () => {
      const response = await api.get<Workspace>(`/api/workspaces/${workspaceSlugOrId}`, {
        showErrorToast: true,
      });
      return response.data;
    },
    enabled: typeof workspaceSlugOrId === "string" && workspaceSlugOrId.length > 0,
    staleTime: 3 * 60 * 1000, 
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<Workspace, unknown, CreateWorkspaceDto>({
    mutationFn: async (data: CreateWorkspaceDto): Promise<Workspace> => {
      const response = await api.post<Workspace>('/api/workspaces', data, {
        showErrorToast: true,
        showSuccessToast: true,
      });
      return response.data as Workspace;
    },
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      
      const slug = workspace?.slug;
      if (slug) {
        router.push(`/dashboard/workspaces/${slug}`);
      }
    },
  });
}

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
      const slug =  workspace.slug;
      if (slug) {
        queryClient.setQueryData(workspaceKeys.detail(slug), workspace);
      }
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}

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
      role:'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST' 
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
      role:'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST' 
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
    staleTime: 2 * 60 * 1000, 
  });
}

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
      const slug =  workspace.slug;
      if (slug) {
        router.push(`/dashboard/${slug}`);
      }
    },
  });
}

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


export function useWorkspaceRole(workspaceId?: string | null): WorkspaceRoleResult {
  const { data: session } = useSession();
  const { data: members = [], isLoading: isMembersLoading } = useWorkspaceMembers(
    workspaceId || undefined
  );

  const userId = session?.user?.id;

  const result = useMemo(() => {
    if (!workspaceId || !userId) {
      return {
        role: null,
        isOwner: false,
        isAdmin: false,
        isMember: false,
        isGuest: false,
        canManageWorkspace: false,
        canManageMembers: false,
        canCreateProjects: false,
        canEditProjects: false,
        canDeleteProjects: false,
        canInviteMembers: false,
        canRemoveMembers: false,
        canEditSettings: false,
        canDeleteWorkspace: false,
        canViewContent: false,
        currentMember: null,
        userId: userId || null,
        isLoading: isMembersLoading,
        hasAccess: false,
      };
    }

    const currentMember = members.find((m) => m.user.id === userId) || null; 

    const role = currentMember?.role as WorkspaceRole | null;

    const isOwner = role === 'OWNER';
    const isAdmin = role === 'ADMIN';
    const isMember = role === 'MEMBER';
    const isGuest = role === 'GUEST';

    const canManageWorkspace = isOwner || isAdmin;
    const canManageMembers = isOwner || isAdmin;
    const canCreateProjects = isOwner || isAdmin ;
    const canEditProjects = isOwner || isAdmin ;
    const canDeleteProjects = isOwner || isAdmin;
    const canInviteMembers = isOwner || isAdmin;
    const canRemoveMembers = isOwner || isAdmin;
    const canEditSettings = isOwner;
    const canDeleteWorkspace = isOwner;
    const canViewContent = isOwner || isAdmin || isMember || isGuest;

    return {
      role,
      isOwner,
      isAdmin,
      isMember,
      isGuest,
      canManageWorkspace,
      canManageMembers,
      canCreateProjects,
      canEditProjects,
      canDeleteProjects,
      canInviteMembers,
      canRemoveMembers,
      canEditSettings,
      canDeleteWorkspace,
      canViewContent,
      currentMember, 
      userId: userId,
      isLoading: isMembersLoading,
      hasAccess: !!currentMember,
    };
  }, [workspaceId, userId, members, isMembersLoading]);

  return result;
}

export function useWorkspacePermission(
  workspaceId?: string | null,
  permission?: keyof Omit<WorkspaceRoleResult, 'role' | 'currentMember' | 'userId' | 'isLoading' | 'hasAccess'>
): boolean {
  const roleData = useWorkspaceRole(workspaceId);
  
  if (!permission) return false;
  
  return roleData[permission] as boolean;
}

export function useWorkspaceRoleCheck(workspaceId?: string | null) {
  const { isOwner, isAdmin, isMember, isGuest, role, hasAccess } = useWorkspaceRole(workspaceId);
  
  return {
    isOwner,
    isAdmin,
    isMember,
    isGuest,
    role,
    hasAccess,
    isOwnerOrAdmin: isOwner || isAdmin,
    canManage: isOwner || isAdmin,
  };
}
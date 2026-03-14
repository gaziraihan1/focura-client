import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  slug: string;
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

// ─── Storage Types ────────────────────────────────────────────────────────────

export interface StorageLimitInfo {
  maxFileSizeMB:    number;
  maxDailyUploads:  number | null;
  uploadsPerMinute: number | null;
  uploadsPerHour:   number | null;
}

export interface WorkspaceStorageInfo {
  plan:            Workspace['plan'];
  usedBytes:       number;
  maxBytes:        number | null;
  remainingBytes:  number | null;
  usedPct:         number | null;      // 0–100
  usedFormatted:   string;             // e.g. "3.2 GB"
  maxFormatted:    string | null;      // e.g. "10 GB"
  isNearLimit:     boolean;            // >= 80 %
  isFull:          boolean;            // >= 100 %
  limits:          StorageLimitInfo;
}
// ─── Query Keys ───────────────────────────────────────────────────────────────

export const workspaceKeys = {
  all:     ['workspaces'] as const,
  lists:   () => [...workspaceKeys.all, 'list'] as const,
  details: () => [...workspaceKeys.all, 'detail'] as const,
  detail:  (slug: string) => [...workspaceKeys.details(), slug] as const,
  members: (id: string)   => [...workspaceKeys.all, id, 'members'] as const,
  stats:   (id: string)   => [...workspaceKeys.all, id, 'stats'] as const,
  storage: (id: string)   => [...workspaceKeys.all, id, 'storage'] as const,
};

// ─── Workspace Hooks ──────────────────────────────────────────────────────────

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

export function useWorkspace(workspaceSlugOrId: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceSlugOrId),
    queryFn: async () => {
      const response = await api.get<Workspace>(`/api/workspaces/${workspaceSlugOrId}`, {
        showErrorToast: true,
      });
      return response.data;
    },
    enabled:   typeof workspaceSlugOrId === 'string' && workspaceSlugOrId.length > 0,
    staleTime: 3 * 60 * 1000,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const router      = useRouter();

  return useMutation<Workspace, unknown, CreateWorkspaceDto>({
    mutationFn: async (data): Promise<Workspace> => {
      const response = await api.post<Workspace>('/api/workspaces', data, {
        showErrorToast:  true,
        showSuccessToast: true,
      });
      return response.data as Workspace;
    },
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      if (workspace?.slug) router.push(`/dashboard/workspaces/${workspace.slug}`);
    },
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation<Workspace, unknown, { id: string; data: Partial<CreateWorkspaceDto> }>({
    mutationFn: async ({ id, data }): Promise<Workspace> => {
      const response = await api.put<Workspace>(`/api/workspaces/${id}`, data, {
        showSuccessToast: true,
        showErrorToast:   true,
      });
      return response.data as Workspace;
    },
    onSuccess: (workspace) => {
      if (workspace.slug) {
        queryClient.setQueryData(workspaceKeys.detail(workspace.slug), workspace);
      }
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const router      = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/workspaces/${id}`, {
        showSuccessToast: true,
        showErrorToast:   true,
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
  return useQuery({
    queryKey: workspaceKeys.members(workspaceId ?? ''),
    queryFn: async () => {
      const response = await api.get<WorkspaceMember[]>(
        `/api/workspaces/${workspaceId}/members`,
        { showErrorToast: true },
      );
      return response.data || [];
    },
    enabled:   !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId, email, role,
    }: {
      workspaceId: string;
      email:       string;
      role:        'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
    }) => {
      const response = await api.post(
        `/api/workspaces/${workspaceId}/invite`,
        { email, role },
        { showSuccessToast: true, showErrorToast: true },
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
      workspaceId, memberId,
    }: {
      workspaceId: string;
      memberId:    string;
    }) => {
      const response = await api.delete(
        `/api/workspaces/${workspaceId}/members/${memberId}`,
        { showSuccessToast: true, showErrorToast: true },
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
      workspaceId, memberId, role,
    }: {
      workspaceId: string;
      memberId:    string;
      role:        'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
    }) => {
      const response = await api.put(
        `/api/workspaces/${workspaceId}/members/${memberId}/role`,
        { role },
        { showSuccessToast: true, showErrorToast: true },
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
        { showErrorToast: true },
      );
      return response.data;
    },
    enabled:   !!workspaceId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  const router      = useRouter();

  return useMutation<Workspace, unknown, string>({
    mutationFn: async (token): Promise<Workspace> => {
      const response = await api.post<Workspace>(
        `/api/workspaces/invitations/${token}/accept`,
        {},
        { showSuccessToast: true, showErrorToast: true },
      );
      return response.data as Workspace;
    },
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      if (workspace.slug) router.push(`/dashboard/${workspace.slug}`);
    },
  });
}

export function useLeaveWorkspace() {
  const queryClient = useQueryClient();
  const router      = useRouter();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await api.post(
        `/api/workspaces/${workspaceId}/leave`,
        {},
        { showSuccessToast: true, showErrorToast: true },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      router.push('/dashboard/workspaces');
    },
  });
}

// ─── Storage Hooks ────────────────────────────────────────────────────────────

/**
 * Real-time workspace storage usage.
 * - Polls every 30 s so the bar stays accurate while teammates upload/delete.
 * - `staleTime: 0` ensures a fresh fetch on every mount/focus.
 * - Invalidated immediately after any upload or delete mutation succeeds.
 */
export function useWorkspaceStorage(workspaceId: string | undefined) {
  return useQuery({
    queryKey: workspaceId ? workspaceKeys.storage(workspaceId) : ['__disabled__'],
    queryFn: async (): Promise<WorkspaceStorageInfo> => {
      const response = await api.get<WorkspaceStorageInfo>(
        `/api/workspaces/${workspaceId}/storage`,
        { showErrorToast: true },
      );
      return response.data as WorkspaceStorageInfo;
    },
    enabled:                     !!workspaceId,
    staleTime:                   0,
    refetchInterval:             30 * 1000,
    refetchIntervalInBackground: false,
  });
}


// ─── Role / Permission Hooks ──────────────────────────────────────────────────

export function useWorkspaceRole(workspaceId?: string | null): WorkspaceRoleResult {
  const { data: session }                              = useSession();
  const { data: members = [], isLoading: isMembersLoading } = useWorkspaceMembers(
    workspaceId || undefined,
  );

  const userId = session?.user?.id;

  return useMemo(() => {
    if (!workspaceId || !userId) {
      return {
        role: null,
        isOwner: false, isAdmin: false, isMember: false, isGuest: false,
        canManageWorkspace: false, canManageMembers: false,
        canCreateProjects: false, canEditProjects: false, canDeleteProjects: false,
        canInviteMembers: false, canRemoveMembers: false,
        canEditSettings: false, canDeleteWorkspace: false, canViewContent: false,
        currentMember: null,
        userId: userId || null,
        isLoading: isMembersLoading,
        hasAccess: false,
      };
    }

    const currentMember = members.find((m) => m.user.id === userId) || null;
    const role          = currentMember?.role as WorkspaceRole | null;

    const isOwner  = role === 'OWNER';
    const isAdmin  = role === 'ADMIN';
    const isMember = role === 'MEMBER';
    const isGuest  = role === 'GUEST';

    return {
      role,
      isOwner, isAdmin, isMember, isGuest,
      canManageWorkspace:  isOwner || isAdmin,
      canManageMembers:    isOwner || isAdmin,
      canCreateProjects:   isOwner || isAdmin,
      canEditProjects:     isOwner || isAdmin,
      canDeleteProjects:   isOwner || isAdmin,
      canInviteMembers:    isOwner || isAdmin,
      canRemoveMembers:    isOwner || isAdmin,
      canEditSettings:     isOwner,
      canDeleteWorkspace:  isOwner,
      canViewContent:      isOwner || isAdmin || isMember || isGuest,
      currentMember,
      userId,
      isLoading: isMembersLoading,
      hasAccess: !!currentMember,
    };
  }, [workspaceId, userId, members, isMembersLoading]);
}

export function useWorkspacePermission(
  workspaceId?: string | null,
  permission?: keyof Omit<
    WorkspaceRoleResult,
    'role' | 'currentMember' | 'userId' | 'isLoading' | 'hasAccess'
  >,
): boolean {
  const roleData = useWorkspaceRole(workspaceId);
  if (!permission) return false;
  return roleData[permission] as boolean;
}

export function useWorkspaceRoleCheck(workspaceId?: string | null) {
  const { isOwner, isAdmin, isMember, isGuest, role, hasAccess } =
    useWorkspaceRole(workspaceId);

  return {
    isOwner, isAdmin, isMember, isGuest, role, hasAccess,
    isOwnerOrAdmin: isOwner || isAdmin,
    canManage:      isOwner || isAdmin,
  };
}
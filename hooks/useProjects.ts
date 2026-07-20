import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { Task } from '@/types/task.types';
import { Announcement } from '@/types/announcement.types';


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

export interface ProjectDetails {
  id: string;
  slug: string;
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
    slug: string
    ownerId: string;
  };
  members: ProjectMember[];
  tasks: Task[];
  announcement: Announcement[]
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
    totalAnnouncement: number;
    inProgressTasks: number;
  };
  isAdmin: boolean;
  workspaceId: string;
  _count: {
    tasks: number;
    members: number;
    announcement: number
  }
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

export interface AddProjectMemberDto {
  userId: string;
  role?: 'MANAGER' | 'COLLABORATOR' | 'VIEWER';
}

export type ProjectRole = 'MANAGER' | 'COLLABORATOR' | 'VIEWER';

export interface ProjectRoleResult {
  role: ProjectRole | null;
  isManager: boolean;
  isCollaborator: boolean;
  isViewer: boolean;
  
  canManageProject: boolean;     
  canEditProject: boolean;       
  canDeleteProject: boolean;     
  canManageMembers: boolean;     
  canAddMembers: boolean;        
  canRemoveMembers: boolean;     
  canUpdateMemberRoles: boolean; 
  canCreateTasks: boolean;        
  canEditTasks: boolean;          
  canDeleteTasks: boolean;        
  canCommentOnTasks: boolean;     
  canViewProject: boolean;        
  canViewTasks: boolean;          
  
  currentMember: ProjectMember | null;
  userId: string | null;
  
  isLoading: boolean;
  hasAccess: boolean;
  
  isWorkspaceAdmin: boolean;
}




// The backend wraps every response as { success, data, message } but some
// responses/older behaviour return the payload directly. Normalize so the
// hooks always receive the inner payload regardless of which shape arrives.
function unwrap<T>(response: any): T {
  if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
    return response.data as T;
  }
  return response as T;
}

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...projectKeys.lists(), workspaceId] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};




export const useProjects = (workspaceId?: string) => {
  return useQuery({
    queryKey: workspaceId
  ? projectKeys.list(workspaceId)
  : ['projects', 'list', 'disabled'],
    queryFn: async () => {
      const res = await api.get(`/api/v1/projects/workspace/${workspaceId}`);
      return unwrap<ProjectDetails[]>(res);
    },
    enabled: !!workspaceId,
        staleTime: 3 * 60 * 1000, // reads from overview-seeded cache for 3 min
        gcTime: 10 * 60 * 1000

  });
};

export const useAllUserProjects = () => {
  return useQuery({
    queryKey: [...projectKeys.all, 'user-projects'],
    queryFn: async () => {
      const res = await api.get('/api/v1/projects/user/all', {
        showErrorToast: true,
      });
      return unwrap<ProjectDetails[]>(res);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 5 minutes
  });
};

export const useProjectDetails = (projectId?: string) => {
  return useQuery({
    queryKey: projectKeys.detail(projectId || ''),
    queryFn: async () => {
      const res = await api.get(`/api/v1/projects/${projectId}`);
      return unwrap<ProjectDetails>(res);
    },
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 5 minutes
  });
};

export const useProjectDetailsBySlug = (slug?: string) => {
  return useQuery({
    queryKey: [...projectKeys.details(), 'slug', slug],
    queryFn: async () => {
      const res = await api.get(`/api/v1/projects/slug/${slug}`);
      return unwrap<ProjectDetails>(res);
    },
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev: ProjectDetails | undefined) => prev,
  });
};
 

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProjectDto) => {
      const res = await api.post<ProjectDetails>('/api/v1/projects', data, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return unwrap<ProjectDetails>(res);
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: projectKeys.list(variables.workspaceId),
      });
    },
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, data }: { projectId: string; data: UpdateProjectDto }) => {
      const res = await api.patch<ProjectDetails>(`/api/v1/projects/${projectId}`, data, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return unwrap<ProjectDetails>(res);
    },
    onSuccess: (updatedProject) => {
      // 1. Directly update slug-based cache (used by overview / settings / layout)
      if (updatedProject.slug) {
        qc.setQueryData<ProjectDetails>(
          [...projectKeys.details(), 'slug', updatedProject.slug],
          (old) => (old ? { ...old, ...updatedProject } : updatedProject),
        );
      }
      // 2. Directly update ID-based cache (used by useProjectDetails)
      qc.setQueryData<ProjectDetails>(
        projectKeys.detail(updatedProject.id),
        (old) => (old ? { ...old, ...updatedProject } : updatedProject),
      );
      // 3. Update project-list caches (sidebar / cards)
      qc.setQueriesData<ProjectDetails[]>(
        { queryKey: projectKeys.lists(), exact: false },
        (old) => {
          if (!old) return old;
          return old.map((p) => (p.id === updatedProject.id ? { ...p, ...updatedProject } : p));
        },
      );
      // 4. Background refetch – won't delay the UI update above
      qc.invalidateQueries({ queryKey: projectKeys.details() });
      qc.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string) => {
      const res = await api.delete(`/api/v1/projects/${projectId}`, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return unwrap(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: projectKeys.lists(),
      });
    },
  });
};
export const useAddProjectMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, data }: { projectId: string; data: AddProjectMemberDto }) => {
      const res = await api.post<ProjectMember>(`/api/v1/projects/${projectId}/members`, data, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return unwrap<ProjectMember>(res);
    },
    onSuccess: (newMember, variables) => {
      // Update all cached detail entries (id-keyed + slug-keyed) in one pass
      qc.setQueriesData<ProjectDetails>(
        { queryKey: projectKeys.details(), exact: false },
        (old) => {
          if (!old || old.id !== variables.projectId) return old;
          // Guard against duplicate if optimistic update already ran
          const alreadyAdded = old.members.some((m) => m.userId === newMember?.userId);
          if (alreadyAdded) return old;
          return {
            ...old,
            members: [...old.members, newMember],
            stats: {
              ...old.stats,
              totalMembers: old.stats.totalMembers + 1,
            },
            _count: {
              ...old._count,
              members: old._count.members + 1,
            },
          };
        },
      );
      // Refresh lists (sidebar/project cards)
      qc.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};
export const useUpdateProjectMemberRole = () => {
  const qc = useQueryClient();
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
      const res = await api.patch<ProjectMember>(
        `/api/v1/projects/${projectId}/members/${memberId}`,
        { role },
        { showSuccessToast: true, showErrorToast: true }
      );
      return unwrap<ProjectMember>(res);
    },
    onSuccess: (updatedMember, variables) => {
      // Optimistically update member role inside the cached project
      const updater = (old: ProjectDetails | undefined) => {
        if (!old) return old;
        return {
          ...old,
          members: old.members.map((m) =>
            m.userId === variables.memberId
              ? { ...m, role: variables.role }
              : m
          ),
        };
      };

      qc.setQueriesData<ProjectDetails>(
        { queryKey: projectKeys.details() },
        updater,
      );
    },
  });
};


export const useRemoveProjectMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, memberId }: { projectId: string; memberId: string }) => {
      const res = await api.delete(`/api/v1/projects/${projectId}/members/${memberId}`, {
        showSuccessToast: true,
        showErrorToast: true,
      });
      return unwrap(res);
    },
    onSuccess: (_, variables) => {
      // Optimistically remove the member from all cached project queries
      const updater = (old: ProjectDetails | undefined) => {
        if (!old) return old;
        return {
          ...old,
          members: old.members.filter((m) => m.userId !== variables.memberId),
          stats: {
            ...old.stats,
            totalMembers: Math.max(0, old.stats.totalMembers - 1),
          },
          _count: {
            ...old._count,
            members: Math.max(0, old._count.members - 1),
          },
        };
      };

      qc.setQueriesData<ProjectDetails>(
        { queryKey: projectKeys.details() },
        updater,
      );
    },
  });
};
export function useProjectRole(
  projectId?: string | null,
  project?: ProjectDetails | null
): ProjectRoleResult {
  const { data: session } = useSession();
  
  const { data: fetchedProject, isLoading: projectLoading } = useProjectDetails(
    !project && projectId ? projectId : undefined
  );
  
  const projectData = project || fetchedProject;
  
  const userId = session?.user?.id;

  const result = useMemo(() => {
    if (!projectData || !userId) {
      return {
        role: null,
        isManager: false,
        isCollaborator: false,
        isViewer: false,
        canManageProject: false,
        canEditProject: false,
        canDeleteProject: false,
        canManageMembers: false,
        canAddMembers: false,
        canRemoveMembers: false,
        canUpdateMemberRoles: false,
        canCreateTasks: false,
        canEditTasks: false,
        canDeleteTasks: false,
        canCommentOnTasks: false,
        canViewProject: false,
        canViewTasks: false,
        currentMember: null,
        userId: userId || null,
        isLoading: projectLoading,
        hasAccess: false,
        isWorkspaceAdmin: false,
      };
    }

    const currentMember = projectData.members?.find((m) => m.user.id === userId) || null;
    const role = currentMember?.role as ProjectRole | null;

    const isWorkspaceAdmin = projectData.workspace
      ? userId === projectData.workspace.ownerId || projectData.isAdmin
      : false;

    const isManager = role === 'MANAGER';
    const isCollaborator = role === 'COLLABORATOR';
    const isViewer = role === 'VIEWER';

    const hasManagerPerms = isManager || isWorkspaceAdmin;
    const hasCollaboratorPerms = isManager || isCollaborator || isWorkspaceAdmin;

    const canManageProject = hasManagerPerms;
    const canEditProject = hasManagerPerms;
    const canDeleteProject = hasManagerPerms;
    const canManageMembers = hasManagerPerms;
    const canAddMembers = hasManagerPerms;
    const canRemoveMembers = hasManagerPerms;
    const canUpdateMemberRoles = hasManagerPerms;
    const canCreateTasks = hasCollaboratorPerms;
    const canEditTasks = hasCollaboratorPerms;
    const canDeleteTasks = hasCollaboratorPerms;
    const canCommentOnTasks = isManager || isCollaborator || isViewer || isWorkspaceAdmin;
    const canViewProject = isManager || isCollaborator || isViewer || isWorkspaceAdmin;
    const canViewTasks = isManager || isCollaborator || isViewer || isWorkspaceAdmin;

    return {
      role,
      isManager,
      isCollaborator,
      isViewer,
      canManageProject,
      canEditProject,
      canDeleteProject,
      canManageMembers,
      canAddMembers,
      canRemoveMembers,
      canUpdateMemberRoles,
      canCreateTasks,
      canEditTasks,
      canDeleteTasks,
      canCommentOnTasks,
      canViewProject,
      canViewTasks,
      currentMember,
      userId: userId,
      isLoading: projectLoading,
      hasAccess: !!currentMember || isWorkspaceAdmin,
      isWorkspaceAdmin,
    };
  }, [projectData, userId, projectLoading]);

  return result;
}


export function useProjectPermission(
  projectId?: string | null,
  permission?: keyof Omit<ProjectRoleResult, 'role' | 'currentMember' | 'userId' | 'isLoading' | 'hasAccess' | 'isWorkspaceAdmin'>,
  project?: ProjectDetails | null
): boolean {
  const roleData = useProjectRole(projectId, project);
  
  if (!permission) return false;
  
  return roleData[permission] as boolean;
}

export function useProjectRoleCheck(
  projectId?: string | null,
  project?: ProjectDetails | null
) {
  const { 
    isManager, 
    isCollaborator, 
    isViewer, 
    role, 
    hasAccess,
    isWorkspaceAdmin,
  } = useProjectRole(projectId, project);
  
  return {
    isManager,
    isCollaborator,
    isViewer,
    role,
    hasAccess,
    isWorkspaceAdmin,
    isManagerOrAdmin: isManager || isWorkspaceAdmin,
    canEdit: isManager || isWorkspaceAdmin,
    canContribute: isManager || isCollaborator || isWorkspaceAdmin,
  };
}
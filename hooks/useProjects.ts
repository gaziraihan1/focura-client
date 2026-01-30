import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';


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
  workspaceId: string
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




export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...projectKeys.lists(), workspaceId] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};




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

export const useAllUserProjects = () => {
  return useQuery({
    queryKey: [...projectKeys.all, 'user-projects'],
    queryFn: async () => {
      const res = await api.get('/api/projects/user/all', {
        showErrorToast: true,
      });
      return res.data as ProjectDetails[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

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
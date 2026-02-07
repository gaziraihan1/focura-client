'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { UseMutationResult } from '@tanstack/react-query';
import {
  useProjects,
  useUpdateProjectMemberRole,
} from '@/hooks/useProjects';
import {
  useWorkspace,
  useWorkspaceMembers,
  useWorkspaceRole,
  useUpdateMemberRole,
  WorkspaceMember,
} from '@/hooks/useWorkspace';


export interface WorkspaceMemberRow extends WorkspaceMember {
  displayName: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  status: string;
  priority: string;
  memberCount: number;
  taskCount: number;
  completedTasks: number;
}

export interface TeamPageStats {
  totalMembers: number;
  totalProjects: number;
  adminCount: number;
  managerCount: number;
}

export interface UpdateWorkspaceMemberRoleArgs {
  workspaceId: string;
  memberId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
}

export interface UpdateProjectMemberRoleArgs {
  projectId: string;
  memberId: string;
  role: 'MANAGER' | 'COLLABORATOR' | 'VIEWER';
}

export interface UseTeamPageReturn {
  isLoading: boolean;
  canManageWorkspace: boolean;
  canManageProjects: boolean;

  workspaceId: string;       
  workspaceName: string;     

  stats: TeamPageStats;

  members: WorkspaceMemberRow[];
  updateWorkspaceMemberRole: UseMutationResult<unknown, unknown, UpdateWorkspaceMemberRoleArgs>;

  projects: ProjectSummary[];
  updateProjectMemberRole: UseMutationResult<unknown, unknown, UpdateProjectMemberRoleArgs>;
}


export function useTeamPage(): UseTeamPageReturn {
  const params = useParams<{ workspaceSlug: string }>();
  const workspaceSlug = params.workspaceSlug;

  const { data: workspace, isLoading: workspaceLoading } =
    useWorkspace(workspaceSlug);

  const workspaceId = workspace?.id ?? '';

  const { data: members = [], isLoading: membersLoading } =
    useWorkspaceMembers(workspaceId || undefined);

  const { canManageWorkspace, isOwner, isAdmin } =
    useWorkspaceRole(workspaceId || undefined);

  const updateWorkspaceMemberRole = useUpdateMemberRole();

  const { data: projects = [], isLoading: projectsLoading } =
    useProjects(workspaceId || undefined);

  const updateProjectMemberRole = useUpdateProjectMemberRole();

  const memberRows: WorkspaceMemberRow[] = useMemo(
    () =>
      members.map((m) => ({
        ...m,
        displayName: m.user.name || m.user.email,
      })),
    [members]
  );
  const projectSummaries: ProjectSummary[] = useMemo(
    () =>
      projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        color: p.color,
        icon: p.icon,
        status: p.status,
        priority: p.priority,
        memberCount: p._count?.members ?? 0,
        taskCount: p._count?.tasks ?? 0,
        completedTasks: p.stats?.completedTasks ?? 0,
      })),
    [projects]
  );

  const stats: TeamPageStats = useMemo(() => {
    const adminCount = members.filter(
      (m) => m.role === 'OWNER' || m.role === 'ADMIN'
    ).length;

    const managerCount = 0;

    return {
      totalMembers: members.length,
      totalProjects: projects.length,
      adminCount,
      managerCount,
    };
  }, [members, projects]);

  return {
    isLoading: workspaceLoading || membersLoading || projectsLoading,
    canManageWorkspace,
    canManageProjects: isOwner || isAdmin,

    workspaceId,
    workspaceName: workspace?.name ?? '',

    stats,
    members: memberRows,
    updateWorkspaceMemberRole,
    projects: projectSummaries,
    updateProjectMemberRole,
  };
}
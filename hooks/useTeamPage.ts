'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { UseMutationResult } from '@tanstack/react-query';
import {
  useProjects,
  ProjectDetails,
  ProjectMember,
  useUpdateProjectMemberRole,
} from '@/hooks/useProjects';
import {
  useWorkspace,
  useWorkspaceMembers,
  useWorkspaceRole,
  useUpdateMemberRole,
  WorkspaceMember,
} from '@/hooks/useWorkspace';

// ─── Derived types ──────────────────────────────────────────────────────────

export interface WorkspaceMemberRow extends WorkspaceMember {
  /** pre-computed display name (falls back to email) */
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

/** Args shape consumed by useUpdateMemberRole.mutate() */
export interface UpdateWorkspaceMemberRoleArgs {
  workspaceId: string;
  memberId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
}

/** Args shape consumed by useUpdateProjectMemberRole.mutate() */
export interface UpdateProjectMemberRoleArgs {
  projectId: string;
  memberId: string;
  role: 'MANAGER' | 'COLLABORATOR' | 'VIEWER';
}

export interface UseTeamPageReturn {
  // ── loading / permission ──
  isLoading: boolean;
  canManageWorkspace: boolean;
  canManageProjects: boolean;

  // ── workspace context (resolved internally) ──
  workspaceId: string;       // the DB id — used by every mutation
  workspaceName: string;     // display name for the page title

  // ── header stats ──
  stats: TeamPageStats;

  // ── members tab ──
  members: WorkspaceMemberRow[];
  updateWorkspaceMemberRole: UseMutationResult<unknown, unknown, UpdateWorkspaceMemberRoleArgs>;

  // ── projects tab ──
  projects: ProjectSummary[];
  projectDetails: Record<string, ProjectDetails>;
  updateProjectMemberRole: UseMutationResult<unknown, unknown, UpdateProjectMemberRoleArgs>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTeamPage(): UseTeamPageReturn {
  // ── 1. slug from URL → workspace object → id ─────────────────────────────
  const params = useParams<{ workspaceSlug: string }>();
  const workspaceSlug = params.workspaceSlug;

  const { data: workspace, isLoading: workspaceLoading } =
    useWorkspace(workspaceSlug);

  // The real DB id that every downstream hook / mutation needs.
  // Falls back to empty string while the workspace query is in-flight;
  // all child hooks are guarded by `enabled: !!id` internally so they
  // simply won't fire until this resolves.
  const workspaceId = workspace?.id ?? '';

  // ── 2. workspace-level data ───────────────────────────────────────────────
  const { data: members = [], isLoading: membersLoading } =
    useWorkspaceMembers(workspaceId || undefined);

  const { canManageWorkspace, isOwner, isAdmin } =
    useWorkspaceRole(workspaceId || undefined);

  const updateWorkspaceMemberRole = useUpdateMemberRole();

  // ── 3. project-level data ─────────────────────────────────────────────────
  const { data: projects = [], isLoading: projectsLoading } =
    useProjects(workspaceId || undefined);

  const updateProjectMemberRole = useUpdateProjectMemberRole();

  // ── 4. derived: member rows ───────────────────────────────────────────────
  const memberRows: WorkspaceMemberRow[] = useMemo(
    () =>
      members.map((m) => ({
        ...m,
        displayName: m.user.name || m.user.email,
      })),
    [members]
  );

  // ── 5. derived: project summaries ─────────────────────────────────────────
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
        memberCount: p.members?.length ?? p._count?.members ?? 0,
        taskCount: p._count?.tasks ?? p.tasks?.length ?? 0,
        completedTasks: p.stats?.completedTasks ?? 0,
      })),
    [projects]
  );

  // ── 6. derived: stats ─────────────────────────────────────────────────────
  const stats: TeamPageStats = useMemo(() => {
    const adminCount = members.filter(
      (m) => m.role === 'OWNER' || m.role === 'ADMIN'
    ).length;

    const managerIds = new Set<string>();
    projects.forEach((p) => {
      (p.members || []).forEach((pm: ProjectMember) => {
        if (pm.role === 'MANAGER') managerIds.add(pm.userId);
      });
    });

    return {
      totalMembers: members.length,
      totalProjects: projects.length,
      adminCount,
      managerCount: managerIds.size,
    };
  }, [members, projects]);

  // ── 7. project details map ────────────────────────────────────────────────
  const projectDetails: Record<string, ProjectDetails> = useMemo(() => {
    const map: Record<string, ProjectDetails> = {};
    projects.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [projects]);

  // ── 8. return ─────────────────────────────────────────────────────────────
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
    projectDetails,
    updateProjectMemberRole,
  };
}
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { WorkspaceRoleResult, WorkspaceRole, WorkspaceMember } from "./useWorkspace";
import { useWorkspaceMembers } from "./useWorkspaceQueries";
import { useWorkspace } from "./useWorkspaceQueries";

export function useWorkspaceRole(workspaceId?: string | null): WorkspaceRoleResult {
  const { data: session } = useSession();
  const { data: members = [], isLoading: isMembersLoading } = useWorkspaceMembers(workspaceId || undefined);
  const userId = session?.user?.id;

  return useMemo(() => {
    if (!workspaceId || !userId) {
      return {
        role: null, isOwner: false, isAdmin: false, isMember: false, isGuest: false,
        canManageWorkspace: false, canManageMembers: false, canCreateProjects: false,
        canEditProjects: false, canDeleteProjects: false, canInviteMembers: false,
        canRemoveMembers: false, canEditSettings: false, canDeleteWorkspace: false,
        canViewContent: false, currentMember: null, userId: userId || null,
        isLoading: isMembersLoading, hasAccess: false,
      };
    }

    const currentMember = members.find((m) => m.user.id === userId) || null;
    const role = currentMember?.role as WorkspaceRole | null;
    const isOwner = role === "OWNER";
    const isAdmin = role === "ADMIN";
    const isMember = role === "MEMBER";
    const isGuest = role === "GUEST";

    return {
      role, isOwner, isAdmin, isMember, isGuest,
      canManageWorkspace: isOwner || isAdmin, canManageMembers: isOwner || isAdmin,
      canCreateProjects: isOwner || isAdmin, canEditProjects: isOwner || isAdmin,
      canDeleteProjects: isOwner || isAdmin, canInviteMembers: isOwner || isAdmin,
      canRemoveMembers: isOwner || isAdmin, canEditSettings: isOwner,
      canDeleteWorkspace: isOwner, canViewContent: isOwner || isAdmin || isMember || isGuest,
      currentMember, userId, isLoading: isMembersLoading, hasAccess: !!currentMember,
    };
  }, [workspaceId, userId, members, isMembersLoading]);
}

export function useWorkspacePermission(
  workspaceId?: string | null,
  permission?: keyof Omit<WorkspaceRoleResult, "role" | "currentMember" | "userId" | "isLoading" | "hasAccess">,
): boolean {
  const roleData = useWorkspaceRole(workspaceId);
  if (!permission) return false;
  return roleData[permission] as boolean;
}

export function useWorkspaceRoleCheck(workspaceId?: string | null) {
  const { isOwner, isAdmin, isMember, isGuest, role, hasAccess } = useWorkspaceRole(workspaceId);
  return { isOwner, isAdmin, isMember, isGuest, role, hasAccess, isOwnerOrAdmin: isOwner || isAdmin, canManage: isOwner || isAdmin };
}

export function useWorkspaceRoleFromWorkspace(workspaceSlug: string): WorkspaceRoleResult {
  const { data: session } = useSession();
  const { data: workspace, isLoading } = useWorkspace(workspaceSlug);
  const userId = session?.user?.id;

  return useMemo(() => {
    const empty = {
      role: null, isOwner: false, isAdmin: false, isMember: false, isGuest: false,
      canManageWorkspace: false, canManageMembers: false, canCreateProjects: false,
      canEditProjects: false, canDeleteProjects: false, canInviteMembers: false,
      canRemoveMembers: false, canEditSettings: false, canDeleteWorkspace: false,
      canViewContent: false, currentMember: null, userId: userId || null,
      isLoading, hasAccess: false,
    };

    if (!workspace || !userId) return empty;

    const currentMember = workspace.members.find((m) => m.user.id === userId) || null;
    const role = currentMember?.role as WorkspaceRole | null;
    const isOwner = role === "OWNER";
    const isAdmin = role === "ADMIN";
    const isMember = role === "MEMBER";
    const isGuest = role === "GUEST";

    return {
      role, isOwner, isAdmin, isMember, isGuest,
      canManageWorkspace: isOwner || isAdmin, canManageMembers: isOwner || isAdmin,
      canCreateProjects: isOwner || isAdmin, canEditProjects: isOwner || isAdmin,
      canDeleteProjects: isOwner || isAdmin, canInviteMembers: isOwner || isAdmin,
      canRemoveMembers: isOwner || isAdmin, canEditSettings: isOwner,
      canDeleteWorkspace: isOwner, canViewContent: isOwner || isAdmin || isMember || isGuest,
      currentMember, userId, isLoading, hasAccess: !!currentMember,
    };
  }, [workspace, userId, isLoading]);
}

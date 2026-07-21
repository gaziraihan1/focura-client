import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { ProjectDetails, ProjectRole, ProjectRoleResult } from "./useProjects";
import { useProjectDetails } from "./useProjectQueries";

export function useProjectRole(
  projectId?: string | null,
  project?: ProjectDetails | null,
): ProjectRoleResult {
  const { data: session } = useSession();
  const { data: fetchedProject, isLoading: projectLoading } = useProjectDetails(!project && projectId ? projectId : undefined);
  const projectData = project || fetchedProject;
  const userId = session?.user?.id;

  const result = useMemo(() => {
    if (!projectData || !userId) {
      return {
        role: null, isManager: false, isCollaborator: false, isViewer: false,
        canManageProject: false, canEditProject: false, canDeleteProject: false,
        canManageMembers: false, canAddMembers: false, canRemoveMembers: false,
        canUpdateMemberRoles: false, canCreateTasks: false, canEditTasks: false,
        canDeleteTasks: false, canCommentOnTasks: false, canViewProject: false,
        canViewTasks: false, currentMember: null, userId: userId || null,
        isLoading: projectLoading, hasAccess: false, isWorkspaceAdmin: false,
      };
    }

    const currentMember = projectData.members?.find((m) => m.user.id === userId) || null;
    const role = currentMember?.role as ProjectRole | null;
    const isWorkspaceAdmin = projectData.workspace ? userId === projectData.workspace.ownerId || projectData.isAdmin : false;
    const isManager = role === "MANAGER";
    const isCollaborator = role === "COLLABORATOR";
    const isViewer = role === "VIEWER";
    const hasManagerPerms = isManager || isWorkspaceAdmin;
    const hasCollaboratorPerms = isManager || isCollaborator || isWorkspaceAdmin;

    return {
      role, isManager, isCollaborator, isViewer,
      canManageProject: hasManagerPerms, canEditProject: hasManagerPerms,
      canDeleteProject: hasManagerPerms, canManageMembers: hasManagerPerms,
      canAddMembers: hasManagerPerms, canRemoveMembers: hasManagerPerms,
      canUpdateMemberRoles: hasManagerPerms, canCreateTasks: hasCollaboratorPerms,
      canEditTasks: hasCollaboratorPerms, canDeleteTasks: hasCollaboratorPerms,
      canCommentOnTasks: isManager || isCollaborator || isViewer || isWorkspaceAdmin,
      canViewProject: isManager || isCollaborator || isViewer || isWorkspaceAdmin,
      canViewTasks: isManager || isCollaborator || isViewer || isWorkspaceAdmin,
      currentMember, userId, isLoading: projectLoading,
      hasAccess: !!currentMember || isWorkspaceAdmin, isWorkspaceAdmin,
    };
  }, [projectData, userId, projectLoading]);

  return result;
}

export function useProjectPermission(
  projectId?: string | null,
  permission?: keyof Omit<ProjectRoleResult, "role" | "currentMember" | "userId" | "isLoading" | "hasAccess" | "isWorkspaceAdmin">,
  project?: ProjectDetails | null,
): boolean {
  const roleData = useProjectRole(projectId, project);
  if (!permission) return false;
  return roleData[permission] as boolean;
}

export function useProjectRoleCheck(
  projectId?: string | null,
  project?: ProjectDetails | null,
) {
  const { isManager, isCollaborator, isViewer, role, hasAccess, isWorkspaceAdmin } = useProjectRole(projectId, project);
  return {
    isManager, isCollaborator, isViewer, role, hasAccess, isWorkspaceAdmin,
    isManagerOrAdmin: isManager || isWorkspaceAdmin,
    canEdit: isManager || isWorkspaceAdmin,
    canContribute: isManager || isCollaborator || isWorkspaceAdmin,
  };
}

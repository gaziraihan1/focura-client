import { useMemo } from 'react';
import { Task } from '@/types/task.types';
import { useProjectRole } from './useProjects';
import { useWorkspaceRole } from './useWorkspace';
import { useUserId } from './useUser';

export interface TaskPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canChangeStatus: boolean;
  canComment: boolean;
  canView: boolean;
  isOwner: boolean;
  isAssignee: boolean;
  isLoading: boolean;
  reason?: string;
}

export function useTaskPermissions(task?: Task | null): TaskPermissions {
  const userId = useUserId();

  const projectRole = useProjectRole(task?.project?.id || null, null);
  const workspaceRole = useWorkspaceRole(task?.project?.workspace?.id || null);

  return useMemo(() => {
    if (!task || !userId) {
      return {
        canEdit: false,
        canDelete: false,
        canChangeStatus: false,
        canComment: false,
        canView: false,
        isOwner: false,
        isAssignee: false,
        isLoading: projectRole.isLoading || workspaceRole.isLoading,
        reason: 'Not authenticated',
      };
    }

    const isOwner    = task.createdBy.id === userId;
    const isAssignee = task.assignees?.some((a) => a.user.id === userId) ?? false;
    const isPersonalTask = !task.projectId;

    if (projectRole.isLoading || workspaceRole.isLoading) {
      return {
        canEdit: false,
        canDelete: false,
        canChangeStatus: false,
        canComment: false,
        canView: false,
        isOwner,
        isAssignee,
        isLoading: true,
        reason: 'Loading permissions...',
      };
    }

    // ── Personal task — owner only
    if (isPersonalTask) {
      return {
        canEdit:         isOwner,
        canDelete:       isOwner,
        canChangeStatus: isOwner,
        canComment:      isOwner,
        canView:         isOwner,
        isOwner,
        isAssignee,
        isLoading: false,
        reason: isOwner ? undefined : 'Only task owner can access personal tasks',
      };
    }

    // ── Project task
    const isProjectManager  = projectRole.isManager;
    const isWorkspaceOwner  = workspaceRole.isOwner;
    const isWorkspaceAdmin  = workspaceRole.isAdmin;

    // Anyone with a stake in the task can view and comment
    const hasTaskStake = isOwner || isAssignee || isProjectManager || isWorkspaceOwner || isWorkspaceAdmin;

    const canView    = hasTaskStake || projectRole.canViewTasks;
    const canComment = hasTaskStake || projectRole.canCommentOnTasks;

    // Only creator can edit/delete
    const canEdit   = isOwner;
    const canDelete = isOwner;

    // Creator, assignees, managers, admins/owners can change status
    const canChangeStatus = isOwner || isAssignee || isProjectManager || isWorkspaceOwner || isWorkspaceAdmin;

    let reason: string | undefined;
    if (!canView) {
      reason = "You don't have access to this task";
    } else if (!canEdit) {
      reason = 'Only the task creator can edit or delete this task';
    }

    return {
      canEdit,
      canDelete,
      canChangeStatus,
      canComment,
      canView,
      isOwner,
      isAssignee,
      isLoading: false,
      reason,
    };
  }, [task, userId, projectRole, workspaceRole]);
}
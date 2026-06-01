import { useMemo } from 'react';
import { Task } from '@/types/task.types';
import { useProjectRole } from './useProjects';
import { useWorkspaceRole } from './useWorkspace';
import { useUserId } from './useUser';
import { TaskPermissionsState } from '@/types/taskDetails.types';

export function useTaskPermissions(task?: Task | null): TaskPermissionsState {
  const userId = useUserId();
  const isArchived = task?.project?.status === 'ARCHIVED';

  const projectRole  = useProjectRole(task?.project?.id || null, null);
  const workspaceRole = useWorkspaceRole(task?.project?.workspace?.id || null);

  return useMemo(() => {
    if (!task || !userId || projectRole.isLoading || workspaceRole.isLoading) {
      return {
        canEdit:         false,
        canDelete:       false,
        canChangeStatus: false,
        canComment:      false,
        canView:         null,
        isOwner:         false,
        isAssignee:      false,
        isLoading:       true,
        reason:          'Loading permissions...',
      };
    }

    const isOwner       = task.createdBy.id === userId;
    const isAssignee    = task.assignees?.some((a) => a.user.id === userId) ?? false;
    const isPersonalTask = !task.projectId;

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

    const isProjectManager = projectRole.isManager;
    const isWorkspaceOwner = workspaceRole.isOwner;
    const isWorkspaceAdmin = workspaceRole.isAdmin;

    const hasTaskStake = isOwner || isAssignee || isProjectManager || isWorkspaceOwner || isWorkspaceAdmin;

    const canView    = hasTaskStake || projectRole.canViewTasks;
    const canComment = !isArchived && (hasTaskStake || projectRole.canCommentOnTasks);
    const canEdit    = !isArchived && isOwner;
    const canDelete  = !isArchived && isOwner;
    const canChangeStatus = !isArchived && (
      isOwner || isAssignee || isProjectManager || isWorkspaceOwner || isWorkspaceAdmin
    );

    const reason = !canView
      ? "You don't have access to this task"
      : isArchived
      ? 'This project is archived. Tasks are read-only.'
      : !canEdit
      ? 'Only the task creator can edit or delete this task'
      : undefined;

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
  }, [task, userId, projectRole, workspaceRole, isArchived]);
}
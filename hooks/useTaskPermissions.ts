import { useMemo } from 'react';
import { Task } from '@/types/task.types';
import { useProjectRole } from './useProjects';
import { useWorkspaceRole } from './useWorkspace';
import { useUserId } from './useUser'; // UPDATED: Use custom hook

export interface TaskPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canChangeStatus: boolean;
  canComment: boolean;
  canView: boolean;
  isOwner: boolean;
  isLoading: boolean;
  reason?: string;
}


export function useTaskPermissions(task?: Task | null): TaskPermissions {
  const userId = useUserId(); // UPDATED: Use custom hook

  // Get project permissions if task belongs to a project
  const projectRole = useProjectRole(
    task?.project?.id || null,
    null
  );
  
  // Get workspace permissions if task belongs to a workspace
  const workspaceRole = useWorkspaceRole(
    task?.project?.workspace?.id || null
  );

  return useMemo(() => {
    // Not authenticated
    if (!task || !userId) {
      return {
        canEdit: false,
        canDelete: false,
        canChangeStatus: false,
        canComment: false,
        canView: false,
        isOwner: false,
        isLoading: projectRole.isLoading || workspaceRole.isLoading,
        reason: 'Not authenticated',
      };
    }

    const isOwner = task.createdBy.id === userId;
    const isPersonalTask = !task.projectId;

    // Still loading permissions
    if (projectRole.isLoading || workspaceRole.isLoading) {
      return {
        canEdit: false,
        canDelete: false,
        canChangeStatus: false,
        canComment: false,
        canView: false,
        isOwner,
        isLoading: true,
        reason: 'Loading permissions...',
      };
    }

    // Personal task permissions - only owner can do everything
    if (isPersonalTask) {
      return {
        canEdit: isOwner,
        canDelete: isOwner,
        canChangeStatus: isOwner,
        canComment: isOwner,
        canView: isOwner,
        isOwner,
        isLoading: false,
        reason: isOwner ? undefined : 'Only task owner can access personal tasks',
      };
    }

    // Project task permissions
    const isProjectManager = projectRole.isManager;
    const isWorkspaceOwner = workspaceRole.isOwner;
    const isWorkspaceAdmin = workspaceRole.isAdmin;
    
    // IMPORTANT: Only task creator can edit/delete
    const canEdit = isOwner;
    const canDelete = isOwner;
    
    // Task creator OR Project Manager OR Workspace Admin/Owner can change status
    const canChangeStatus = isOwner || isProjectManager || isWorkspaceOwner || isWorkspaceAdmin;
    
    // Anyone with project access can comment
    const canComment = projectRole.canCommentOnTasks;
    
    // Anyone with project access can view
    const canView = projectRole.canViewTasks;

    let reason: string | undefined;
    if (!canEdit) {
      if (!projectRole.hasAccess) {
        reason = "You don't have access to this project";
      } else {
        reason = 'Only the task creator can edit or delete this task';
      }
    }

    return {
      canEdit,
      canDelete,
      canChangeStatus,
      canComment,
      canView,
      isOwner,
      isLoading: false,
      reason,
    };
  }, [task, userId, projectRole, workspaceRole]);
}
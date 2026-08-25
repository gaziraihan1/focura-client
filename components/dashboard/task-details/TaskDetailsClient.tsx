"use client";

import { useTaskOverview } from "@/hooks/useTask";
import { useTaskDetailsController } from "@/hooks/useTaskDetailsController";

import TaskEmpty from "@/components/dashboard/task-details/TaskEmpty";
import TaskDetailsPermission from "@/components/dashboard/task-details/TaskDetailsPermission";
import TaskDetailsView from "@/components/dashboard/task-details/TaskDetailsView";
import TaskDetailsSkeleton from "./TaskDetailsSkeleton";

interface Props {
  id: string;
  workspaceSlug: string;
}

export function TaskDetailsClient({ id, workspaceSlug }: Props) {
  // ── 1. Overview fetch (seeds cache)
  const {
    isLoading,
    isError,
    data: overview,
  } = useTaskOverview(id);

  // ── 2. Controller (reads from cache)
  const controller = useTaskDetailsController(id, workspaceSlug);

  const { task, permissions } = controller;

  // ── 3. HARD LOADING GATE (NO PARTIAL STATE BEYOND THIS POINT)
  const isLoadingState =
    isLoading ||
    !overview ||
    controller.taskQuery?.isLoading ||
    permissions.isLoading;

  if (isLoadingState) {
    return <TaskDetailsSkeleton />;
  }

  // ── 4. ERROR STATE
  if (isError && !overview) {
    return <TaskEmpty />;
  }

  // ── 5. EMPTY STATE
  if (!task) {
    return <TaskEmpty />;
  }

  // ── 6. PERMISSION DENIED STATE
  if (permissions.canView === false) {
    return <TaskDetailsPermission />;
  }

  // ── 7. SUCCESS STATE (FULLY RESOLVED DATA ONLY)
  return (
    <TaskDetailsView
      task={task}
      permissions={permissions}   // already resolved upstream
      workspaceSlug={workspaceSlug}
      isEditing={controller.isEditing}
      editData={controller.editData}
      setIsEditing={controller.setIsEditing}
      setEditData={controller.setEditData}
      comments={controller.comments}
      attachments={controller.attachments}
      handlers={controller.handlers}
      mutations={controller.mutations}
      sections={controller.sections}
      sprints={controller.sprints}
      milestones={controller.milestones}
    />
  );
}
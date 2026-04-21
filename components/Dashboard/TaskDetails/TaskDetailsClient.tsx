"use client";

import { useTaskOverview }          from "@/hooks/useTask";
import { useTaskDetailsController } from "@/hooks/useTaskDetailsController";
import TaskEmpty                    from "@/components/Dashboard/TaskDetails/TaskEmpty";
import TaskDetailsPermission        from "@/components/Dashboard/TaskDetails/TaskDetailsPermission";
import TaskDetailsView              from "@/components/Dashboard/TaskDetails/TaskDetailsView";
import TaskDetailsSkeleton from "./TaskDetailsSkeleton";

interface Props {
  id:             string;
  workspaceSlug:  string;
}

export function TaskDetailsClient({ id, workspaceSlug }: Props) {
  // Single fetch — seeds task/comment/attachment caches
  const { isLoading, isError, data: overview } = useTaskOverview(id);

  // Controller reads task from the cache seeded above (no extra fetch)
  const controller = useTaskDetailsController(id, workspaceSlug);

  // Show skeleton only on the very first load (no cached data yet)
  if (isLoading && !overview) return <TaskDetailsSkeleton />;

  // Real error (not just "undefined while loading")
  if (isError && !overview) return <TaskEmpty />;

  if (!controller.task)              return <TaskEmpty />;
  if (!controller.permissions.canView) return <TaskDetailsPermission />;

  return (
    <TaskDetailsView
      {...controller}
      task={controller.task}
      id={id}
      workspaceSlug={workspaceSlug}
    />
  );
}
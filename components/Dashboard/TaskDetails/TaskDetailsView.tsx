"use client";

import { User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Task } from "@/types/task.types";
import { TaskHeader } from "@/components/Dashboard/TaskDetails/TaskHeader";
import { TimeTrackingCard } from "@/components/Dashboard/TaskDetails/TimeTrackingCard";
import { FocusRequirementsCard } from "@/components/Dashboard/TaskDetails/FocusRequirementsCard";
import { IntentBadge } from "@/components/Dashboard/TaskDetails/IntentBadge";

import {
  useUpdateTask,
  useDeleteTask,
  useUpdateTaskStatus,
  useAddComment,
  useUploadAttachment,
  useDeleteAttachment,
} from "@/hooks/useTask";
import { useUpdateComment, useDeleteComment } from "@/hooks/useComment";
import TaskDetailsMainLayout from "./TaskDetailsMainLayout";
import { TaskHandlers, TaskPermissions } from "@/types/taskDetails.types";

export interface TaskMutations {
  addComment: ReturnType<typeof useAddComment>;
  updateComment: ReturnType<typeof useUpdateComment>;
  deleteComment: ReturnType<typeof useDeleteComment>;
  uploadAttachment: ReturnType<typeof useUploadAttachment>;
  deleteAttachment: ReturnType<typeof useDeleteAttachment>;
  updateTask: ReturnType<typeof useUpdateTask>;
  deleteTask: ReturnType<typeof useDeleteTask>;
  updateStatus: ReturnType<typeof useUpdateTaskStatus>;
}

interface TaskDetailsViewProps {
  task: Task;
  permissions: TaskPermissions;
  isEditing: boolean;
  handlers: TaskHandlers;
  mutations: TaskMutations;
  id: string;
}

export default function TaskDetailsView({
  task,
  permissions,
  isEditing,
  handlers,
  mutations,
  id,
}: TaskDetailsViewProps) {
  const router = useRouter();
  const isPersonalTask = !task.projectId;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <TaskHeader
        isEditing={isEditing}
        onBack={() => router.back()}
        onEdit={handlers.handleEditClick}
        onDelete={handlers.handleDelete}
        isDeleting={mutations.deleteTask.isPending}
        canEdit={permissions.canEdit}
        canDelete={permissions.canDelete}
      />

      {!permissions.canEdit && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2">
          <Lock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-500">
            {permissions.reason || "You have read-only access to this task"}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {isPersonalTask && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-medium">
            <User size={12} />
            Personal
          </div>
        )}

        <IntentBadge intent={task.intent} size="sm" showLabel />
      </div>

      {task.timeTracking && (
        <TimeTrackingCard
          timeTracking={task.timeTracking}
          estimatedHours={task.estimatedHours}
        />
      )}

      {task.focusRequired && (
        <FocusRequirementsCard
          focusLevel={task.focusLevel}
          energyType={task.energyType}
          distractionCost={task.distractionCost}
        />
      )}

      <TaskDetailsMainLayout
        id={id}
        task={task}
        isPersonalTask={isPersonalTask}
      />
    </div>
  );
}

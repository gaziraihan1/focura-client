"use client";

import { User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

import { Task, TaskComment, Attachment } from "@/types/task.types";
import { TaskHeader } from "@/components/Dashboard/TaskDetails/TaskHeader";
import { TimeTrackingCard } from "@/components/Dashboard/TaskDetails/TimeTrackingCard";
import { FocusRequirementsCard } from "@/components/Dashboard/TaskDetails/FocusRequirementsCard";
import { FocusSessionCard } from "@/components/Dashboard/TaskDetails/FocusSessionCard";
import { TimeEntryCard } from "@/components/Dashboard/TaskDetails/TimeEntryCard";
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

import { EditTaskData, TaskHandlers, TaskPermissionsState } from "@/types/taskDetails.types";

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
  permissions: TaskPermissionsState; 
  isEditing: boolean;
  editData: EditTaskData;
  setIsEditing: (isEditing: boolean) => void;
  setEditData: (data: EditTaskData) => void;
  comments: TaskComment[];
  attachments: Attachment[];
  handlers: TaskHandlers;
  mutations: TaskMutations;
  workspaceSlug: string;
  sections?: Array<{ id: string; name: string; status?: string }>;
  sprints?: Array<{ id: string; name: string }>;
  milestones?: Array<{ id: string; title: string }>;
}

export default function TaskDetailsView({
  task,
  permissions,
  isEditing,
  editData,
  setIsEditing,
  setEditData,
  comments,
  attachments,
  handlers,
  mutations,
  workspaceSlug,
  sections,
  sprints,
  milestones,
}: TaskDetailsViewProps) {
  const router = useRouter();
  const isArchived = task.project?.status === "ARCHIVED"

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

      
      {isArchived && (
  <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2">
    <Lock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
    <p className="text-sm text-amber-500 font-medium">
      This project is archived. Tasks are read-only — editing, deleting and commenting are disabled.
    </p>
  </div>
)}

{!isArchived && permissions.canView && !permissions.canEdit && (
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

      
      <FocusSessionCard taskId={task.id} />

      <TimeEntryCard taskId={task.id} workspaceId={task.workspaceId} />

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
        task={task}
        isPersonalTask={isPersonalTask}
        workspaceSlug={workspaceSlug}
        isEditing={isEditing}
        editData={editData}
        setIsEditing={setIsEditing}
        setEditData={setEditData}
        comments={comments}
        attachments={attachments}
        permissions={permissions}
        handlers={handlers}
        mutations={mutations}
        sections={sections}
        sprints={sprints}
        milestones={milestones}
      />
    </div>
  );
}
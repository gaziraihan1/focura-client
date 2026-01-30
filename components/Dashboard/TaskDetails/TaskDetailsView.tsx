"use client";

import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

import { Task, TaskComment, Attachment } from "@/types/task.types";
import { TaskHeader } from "@/components/Dashboard/TaskDetails/TaskHeader";
import { TimeTrackingCard } from "@/components/Dashboard/TaskDetails/TimeTrackingCard";
import { FocusRequirementsCard } from "@/components/Dashboard/TaskDetails/FocusRequirementsCard";
import { TaskDetailsForm } from "@/components/Dashboard/TaskDetails/TaskDetailsForm";
import { TaskSidebar } from "@/components/Dashboard/TaskDetails/TaskSidebar";
import { TaskTabs } from "@/components/Dashboard/TaskDetails/TaskTab";
import { IntentBadge } from "@/components/Dashboard/TaskDetails/IntentBadge";

interface EditTaskData {
  title: string;
  description: string;
  priority: string;
  status: string;
  estimatedHours: string;
}

interface TaskPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canChangeStatus: boolean;
  canComment: boolean;
  reason?: string;
}

interface TaskHandlers {
  handleEditClick: () => void;
  handleSaveEdit: () => void;
  handleDelete: () => void;
  handleStatusChange: (status: Task["status"]) => void;
}

import {
  useUpdateTask,
  useDeleteTask,
  useUpdateTaskStatus,
  useAddComment,
  useUploadAttachment,
  useDeleteAttachment,
} from "@/hooks/useTask";
import { useUpdateComment, useDeleteComment } from "@/hooks/useComment";

interface TaskMutations {
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
  comments: TaskComment[];
  attachments: Attachment[];

  permissions: TaskPermissions;

  isEditing: boolean;
  editData: EditTaskData;

  setEditData: React.Dispatch<React.SetStateAction<EditTaskData>>;
  setIsEditing: (v: boolean) => void;

  handlers: TaskHandlers;
  mutations: TaskMutations;
}

/* -------------------------------- component -------------------------------- */

export default function TaskDetailsView({
  task,
  comments,
  attachments,
  permissions,
  isEditing,
  editData,
  setEditData,
  setIsEditing,
  handlers,
  mutations,
}: TaskDetailsViewProps) {
  const router = useRouter();
  const isPersonalTask = !task.projectId;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <TaskHeader
        isEditing={isEditing}
        onBack={() => router.back()}
        onEdit={handlers.handleEditClick}
        onDelete={handlers.handleDelete}
        isDeleting={mutations.deleteTask.isPending}
        canEdit={permissions.canEdit}
        canDelete={permissions.canDelete}
      />

      {/* Read-only warning */}
      {!permissions.canEdit && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2">
          <Lock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-500">
            {permissions.reason || "You have read-only access to this task"}
          </p>
        </div>
      )}

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {isPersonalTask && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-medium">
            <User size={12} />
            Personal
          </div>
        )}

        <IntentBadge intent={task.intent} size="sm" showLabel />
      </div>

      {/* Optional cards */}
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

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-card border border-border p-6"
          >
            {isEditing ? (
              <TaskDetailsForm
                editData={editData}
                isUpdating={mutations.updateTask.isPending}
                onEditDataChange={setEditData}
                onSave={handlers.handleSaveEdit}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <>
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {task.title}
                </h1>

                {task.description ? (
                  <p className="text-foreground/80 whitespace-pre-wrap">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    No description provided
                  </p>
                )}
              </>
            )}
          </motion.div>

          <TaskTabs
            taskId={task.id}
            task={task}
            comments={comments}
            attachments={attachments}
            addComment={mutations.addComment}
            updateComment={mutations.updateComment}
            deleteComment={mutations.deleteComment}
            uploadAttachment={mutations.uploadAttachment}
            deleteAttachment={mutations.deleteAttachment}
            canComment={permissions.canComment}
          />
        </div>

        {/* Sidebar */}
        <TaskSidebar
          task={task}
          isPersonalTask={isPersonalTask}
          isUpdatingStatus={mutations.updateStatus.isPending}
          onStatusChange={handlers.handleStatusChange}
          canChangeStatus={permissions.canChangeStatus}
        />
      </div>
    </div>
  );
}
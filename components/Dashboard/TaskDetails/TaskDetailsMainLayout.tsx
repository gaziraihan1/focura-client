"use client";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { TaskDetailsForm } from "./TaskDetailsForm";
import { TaskTabs } from "./TaskTab";
import { TaskSidebar } from "./TaskSidebar";
import { Task, TaskComment, Attachment } from "@/types/task.types";
import { SubtaskSection } from "./SubtasksSection/SubtaskSection";
import { TaskSectionBadge } from "@/components/Dashboard/ProjectDetails/TaskSectionBadge";
import { EditTaskData, TaskHandlers, TaskMutations, TaskPermissionsState } from "@/types/taskDetails.types";

interface TaskDetailsMainLayoutProps {
  isPersonalTask: boolean;
  task: Task;
  workspaceSlug: string;
  isEditing: boolean;
  editData: EditTaskData;
  setIsEditing: (isEditing: boolean) => void;
  setEditData: (data: EditTaskData) => void;
  comments: TaskComment[];
  attachments: Attachment[];
  permissions: TaskPermissionsState;
  handlers: TaskHandlers;
  mutations: TaskMutations;
}

export default function TaskDetailsMainLayout({
  isPersonalTask,
  task,
  workspaceSlug,
  isEditing,
  editData,
  setIsEditing,
  setEditData,
  comments,
  attachments,
  permissions,
  handlers,
  mutations,
}: TaskDetailsMainLayoutProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ?? "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-foreground">
                  {task.title}
                </h1>
                {!isPersonalTask && <TaskSectionBadge task={task} />}
              </div>
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

        {currentUserId && (
          <SubtaskSection
            parentTaskId={task.id}
            currentUserId={currentUserId}
            isAssignee={permissions.isAssignee || permissions.isOwner}
          />
        )}

        {!isPersonalTask && (
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
            workspaceSlug={workspaceSlug}
          />
        )}
      </div>

      <TaskSidebar
        task={task}
        isPersonalTask={isPersonalTask}
        isUpdatingStatus={mutations.updateStatus.isPending}
        onStatusChange={handlers.handleStatusChange}
        canChangeStatus={permissions.canChangeStatus}
        onTaskUpdated={handlers.handleTaskUpdated}
      />
    </div>
  );
}
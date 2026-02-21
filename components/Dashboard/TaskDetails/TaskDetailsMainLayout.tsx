"use client";
import React from "react";
import { motion } from "framer-motion";
import { TaskDetailsForm } from "./TaskDetailsForm";
import { TaskTabs } from "./TaskTab";
import { TaskSidebar } from "./TaskSidebar";
import { useTaskDetailsController } from "@/hooks/useTaskDetailsController";
import { Task } from "@/types/task.types";

interface TaskDetailsMainLayoutProps {
  id: string;
  isPersonalTask: boolean;
  task: Task;
}

export default function TaskDetailsMainLayout({
  id,
  isPersonalTask,
  task,
}: TaskDetailsMainLayoutProps) {
  const {
    isEditing,
    editData,
    mutations,
    handlers,
    setIsEditing,
    setEditData,
    comments,
    attachments,
    permissions,
  } = useTaskDetailsController(id as string);
  const controller = useTaskDetailsController(id as string);
  console.log(controller)

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

{
  !isPersonalTask && (

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
  )
}
      </div>

      <TaskSidebar
        task={task}
        isPersonalTask={isPersonalTask}
        isUpdatingStatus={mutations.updateStatus.isPending}
        onStatusChange={handlers.handleStatusChange}
        canChangeStatus={permissions.canChangeStatus}
      />
    </div>
  );
}

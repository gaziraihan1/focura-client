import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  useTask,            // reads from cache seeded by useTaskOverview
  useUpdateTask,
  useDeleteTask,
  useUpdateTaskStatus,
  useTaskComments,    // reads from cache seeded by useTaskOverview
  useTaskAttachments, // reads from cache seeded by useTaskOverview
  useAddComment,
  useUploadAttachment,
  useDeleteAttachment,
} from "@/hooks/useTask";
import { useUpdateComment, useDeleteComment } from "@/hooks/useComment";
import { useTaskPermissions } from "@/hooks/useTaskPermissions";
import { Task } from "@/types/task.types";

export function useTaskDetailsController(taskId: string, workspaceSlug: string | undefined) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    estimatedHours: "",
  });

  const taskQuery       = useTask(taskId);
  const task            = taskQuery.data as Task | undefined;
  const commentsQuery   = useTaskComments(taskId);
  const attachmentsQuery = useTaskAttachments(taskId);

  const permissions = useTaskPermissions(task);

  const updateTask       = useUpdateTask();
  const deleteTask       = useDeleteTask();
  const updateStatus     = useUpdateTaskStatus();
  const addComment       = useAddComment();
  const updateComment    = useUpdateComment();
  const deleteComment    = useDeleteComment();
  const uploadAttachment = useUploadAttachment();
  const deleteAttachment = useDeleteAttachment();

  const handleEditClick = () => {
    if (!task || !permissions.canEdit) return;
    setEditData({
      title:          task.title,
      description:    task.description || "",
      priority:       task.priority,
      status:         task.status,
      estimatedHours: task.estimatedHours?.toString() || "",
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!task || !permissions.canEdit) return;
    await updateTask.mutateAsync({
      id:   task.id,
      data: {
        title:          editData.title,
        description:    editData.description,
        priority:       editData.priority as Task["priority"],
        status:         editData.status   as Task["status"],
        estimatedHours: editData.estimatedHours
          ? parseFloat(editData.estimatedHours)
          : undefined,
      },
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!task || !permissions.canDelete) return;
    if (!confirm("Are you sure you want to delete this task?")) return;
    await deleteTask.mutateAsync(task.id);
    router.push(
      workspaceSlug
        ? `/dashboard/workspaces/${workspaceSlug}/tasks`
        : "/dashboard/tasks",
    );
  };

  return {
    task,
    taskQuery,
    comments:    commentsQuery.data    ?? [],
    attachments: attachmentsQuery.data ?? [],
    permissions,
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    handlers: {
      handleEditClick,
      handleSaveEdit,
      handleDelete,
      handleStatusChange: (status: Task["status"]) =>
        updateStatus.mutateAsync({ id: taskId, status }),
    },
    mutations: {
      addComment,
      updateComment,
      deleteComment,
      uploadAttachment,
      deleteAttachment,
      updateTask,
      deleteTask,
      updateStatus,
    },
  };
}
import {
  useAddComment,
  useDeleteAttachment,
  useDeleteTask,
  useUpdateTask,
  useUpdateTaskStatus,
  useUploadAttachment,
} from "@/hooks/useTask";
import { Task } from "./task.types";
import { useDeleteComment, useUpdateComment } from "@/hooks/useComment";

export interface EditTaskData {
  title: string;
  description: string;
  priority: string;
  status: string;
  estimatedHours: string;
}

export interface TaskPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canChangeStatus: boolean;
  canComment: boolean;
  reason?: string;
}

export interface TaskHandlers {
  handleEditClick: () => void;
  handleSaveEdit: () => void;
  handleDelete: () => void;
  handleStatusChange: (status: Task["status"]) => void;
}

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

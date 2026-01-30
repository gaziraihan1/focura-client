import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Task, TaskComment, Attachment } from "@/types/task.types";
import { useSession } from "next-auth/react";
import { useTaskActivities } from "@/hooks/useActivity";
import { TaskActivityList } from "@/components/Dashboard/TaskDetails/TaskActivityList";
import TaskTabHeader from "./TaskTab/TaskTabHeader";
import { CommentsTab } from "./TaskTab/CommentsTab";
import { AttachmentsTab } from "./TaskTab/AttachmentsTab";
import {
  useAddComment,
  useUploadAttachment,
  useDeleteAttachment,
} from "@/hooks/useTask";
import { useUpdateComment, useDeleteComment } from "@/hooks/useComment";

interface TaskTabsProps {
  taskId: string;
  comments: TaskComment[];
  attachments: Attachment[];
  task: Task;
  addComment: ReturnType<typeof useAddComment>;
  updateComment: ReturnType<typeof useUpdateComment>;
  deleteComment: ReturnType<typeof useDeleteComment>;
  uploadAttachment: ReturnType<typeof useUploadAttachment>;
  deleteAttachment: ReturnType<typeof useDeleteAttachment>;
  canComment?: boolean;
}

export type TabCounts = {
  comments: number;
  activity: number;
  attachments: number;
};

export const TaskTabs = ({
  taskId,
  comments,
  attachments,
  task,
  addComment,
  updateComment,
  deleteComment,
  uploadAttachment,
  deleteAttachment,
  canComment = true,
}: TaskTabsProps) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const { data: activities = [], isLoading: activitiesLoading } =
    useTaskActivities(taskId);

  const [activeTab, setActiveTab] = useState<
    "comments" | "activity" | "attachments"
  >("comments");
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleAddComment = async () => {
    if (!commentText.trim() || !canComment) return;

    try {
      await addComment.mutateAsync({
        taskId,
        content: commentText,
      });
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const counts: TabCounts = {
    comments: comments.length,
    activity: activities.length,
    attachments: attachments.length,
  };

  const handleEdit = (comment: TaskComment) => {
    if (comment.user.id !== currentUserId) return;
    setEditingId(comment.id);
    setEditText(comment.content);
  };

  const handleUpdate = async (commentId: string) => {
    if (!editText.trim()) return;
    await updateComment.mutateAsync({ commentId, content: editText, taskId });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleCommentDelete = async (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      await deleteComment.mutateAsync({ commentId, taskId });
    }
  };

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <TaskTabHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
      />
      <div className="p-4 sm:p-6">
        {activeTab === "comments" && (
          <CommentsTab
            taskId={taskId}
            comments={comments}
            task={task}
            canComment={canComment}
            currentUserId={currentUserId}
            commentText={commentText}
            setCommentText={setCommentText}
            editingId={editingId}
            editText={editText}
            onAddComment={handleAddComment}
            onEdit={handleEdit}
            onUpdate={handleUpdate}
            onEditTextChange={setEditText}
            onCancelEdit={handleCancel}
            onDelete={handleCommentDelete}
            addCommentLoading={addComment.isPending}
          />
        )}
        {activeTab === "activity" && (
          <div>
            {activitiesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <TaskActivityList activities={activities} />
            )}
          </div>
        )}
        {activeTab === "attachments" && (
          <AttachmentsTab
            taskId={taskId}
            attachments={attachments}
            currentUserId={currentUserId}
            canComment={canComment}
            uploadAttachment={uploadAttachment}
            deleteAttachment={deleteAttachment}
          />
        )}
      </div>
    </div>
  );
};
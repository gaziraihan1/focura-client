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
  workspaceSlug: string;
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
  deleteComment,
  uploadAttachment,
  deleteAttachment,
  canComment = true,
  workspaceSlug = ""
}: TaskTabsProps) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const { data: activities = [], isLoading: activitiesLoading } =
    useTaskActivities(taskId);

  const [activeTab, setActiveTab] = useState<
    "comments" | "activity" | "attachments"
  >("comments");
  const [commentText, setCommentText] = useState("");

  const handleAddComment = async (parentId: string | null) => {
    if (!commentText.trim() || !canComment) return;

    try {
      await addComment.mutateAsync({
        taskId,
        content: commentText,
        parentId,
        workspaceSlug,
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
          // TaskTabs.tsx — fixed CommentsTab call
  <CommentsTab
    taskId={taskId}
    comments={comments}
    task={task}
    canComment={canComment}
    currentUserId={currentUserId}
    currentUserName={session?.user?.name ?? undefined}
    currentUserImage={session?.user?.image ?? undefined}
    mentionableUsers={task.assignees?.map((a) => ({
      id: a.user.id,
      name: a.user.name,
      image: a.user.image ?? null,
      role: a.role,
    })) ?? []}
    commentText={commentText}
    setCommentText={setCommentText}
    onAddComment={handleAddComment}
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
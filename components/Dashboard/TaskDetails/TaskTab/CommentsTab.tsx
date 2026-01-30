import { Task, TaskComment } from "@/types/task.types";
import { CommentEditor } from "./CommentEditor";
import { CommentsList } from "./CommentsList";

interface CommentsTabProps {
  taskId: string;
  comments: TaskComment[];
  task: Task;
  canComment: boolean;
  currentUserId?: string;

  commentText: string;
  setCommentText: (v: string) => void;
  editingId: string | null;
  editText: string;
  onEditTextChange: (value: string) => void;

  onAddComment: () => void;
  onEdit: (comment: TaskComment) => void;
  onUpdate: (commentId: string) => void;
  onCancelEdit: () => void;
  onDelete: (commentId: string) => void;

  addCommentLoading: boolean;
}

export const CommentsTab = ({
//   taskId,
  comments,
  task,
  canComment,
  currentUserId,
  commentText,
  setCommentText,
  editingId,
  editText,
  onAddComment,
  onEditTextChange,
  onEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
  addCommentLoading,
}: CommentsTabProps) => {
  return (
    <>
      <CommentEditor
        task={task}
        canComment={canComment}
        value={commentText}
        onChange={setCommentText}
        onSubmit={onAddComment}
        loading={addCommentLoading}
      />

      <CommentsList
  comments={comments}
  currentUserId={currentUserId}
  editingId={editingId}
  editText={editText}
  onEditStart={onEdit}
  onEditTextChange={onEditTextChange}
  onUpdate={onUpdate}
  onCancelEdit={onCancelEdit}
  onDelete={onDelete}
/>

    </>
  );
};

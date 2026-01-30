import { TaskComment } from "@/types/task.types";
import { Edit2, Trash2, Check, X } from "lucide-react";
import Image from "next/image";

interface CommentsListProps {
  comments: TaskComment[];
  currentUserId?: string;
  editingId: string | null;
  editText: string;

  onEditStart: (comment: TaskComment) => void;
  onEditTextChange: (value: string) => void;
  onUpdate: (commentId: string) => void;
  onCancelEdit: () => void;
  onDelete: (commentId: string) => void;
}

export const CommentsList = ({
  comments,
  currentUserId,
  editingId,
  editText,
  onEditStart,
  onEditTextChange,
  onUpdate,
  onCancelEdit,
  onDelete,
}: CommentsListProps) => {
  if (comments.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const isOwnComment = comment.user.id === currentUserId;
        const isEditing = editingId === comment.id;

        return (
          <div key={comment.id} className="flex gap-3">
            {comment.user.image ? (
              <Image
                src={comment.user.image}
                alt={comment.user.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium shrink-0">
                {comment.user.name.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>

                {isOwnComment && !isEditing && (
                  <div className="flex gap-2">
                    <Edit2
                      size={16}
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => onEditStart(comment)}
                    />
                    <Trash2
                      size={16}
                      className="cursor-pointer text-red-500 hover:text-red-600"
                      onClick={() => onDelete(comment.id)}
                    />
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="flex gap-2 items-center">
                  <input
                    value={editText}
                    onChange={(e) => onEditTextChange(e.target.value)}
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    autoFocus
                  />

                  <Check
                    size={16}
                    className="cursor-pointer text-green-500"
                    onClick={() => onUpdate(comment.id)}
                  />

                  <X
                    size={16}
                    className="cursor-pointer text-red-500"
                    onClick={onCancelEdit}
                  />
                </div>
              ) : (
                <p className="text-foreground/80 wrap-break-word">
                  {comment.content}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

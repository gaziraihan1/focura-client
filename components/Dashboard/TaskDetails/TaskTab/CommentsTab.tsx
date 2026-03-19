"use client";

import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Task, TaskComment } from "@/types/task.types";
import { CommentEditor } from "./CommentEditor";
import { CommentsList } from "./CommentsList";
import { MentionUser } from "@/types/comment.types";

interface CommentsTabProps {
  taskId: string;
  comments: TaskComment[];
  task: Task;
  canComment: boolean;
  currentUserId?: string;
  currentUserName?: string;
  currentUserImage?: string | null;
  mentionableUsers?: MentionUser[];

  commentText: string;
  setCommentText: (v: string) => void;

  onAddComment: (parentId: string | null) => void;
  onDelete: (commentId: string) => void;

  addCommentLoading: boolean;
}

export const CommentsTab = ({
  comments,
  task,
  canComment,
  currentUserId,
  currentUserName,
  currentUserImage,
  mentionableUsers = [],
  commentText,
  setCommentText,
  onAddComment,
  onDelete,
  addCommentLoading,
}: CommentsTabProps) => {
  const [replyingTo, setReplyingTo] = useState<TaskComment | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleReply = (comment: TaskComment) => {
    setReplyingTo(comment);
    // Auto-scroll editor into view and focus
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleSubmit = () => {
    onAddComment(replyingTo?.id ?? null);
    setReplyingTo(null);
  };

  return (
    <div className="space-y-6">
      {/* Comment list */}
      <CommentsList
        comments={comments}
        currentUserId={currentUserId}
        onDelete={onDelete}
        onReply={canComment ? handleReply : () => {}}
      />

      {/* Editor — always at bottom */}
      <div ref={editorRef}>
        <AnimatePresence>
          <CommentEditor
            task={task}
            canComment={canComment}
            value={commentText}
            onChange={setCommentText}
            onSubmit={handleSubmit}
            loading={addCommentLoading}
            userImage={currentUserImage}
            currentUserName={currentUserName}
            mentionableUsers={mentionableUsers}
            replyingTo={replyingTo}
            onCancelReply={handleCancelReply}
            autoFocus={!!replyingTo}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};
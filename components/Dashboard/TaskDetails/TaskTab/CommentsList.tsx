// components/CommentsList/CommentsList.tsx
'use client';

import { AnimatePresence } from 'framer-motion';
import { EmptyComments } from './CommentsList/EmptyComments';
import { CommentItem } from './CommentsList/CommentItem';
import { buildCommentTree } from '@/utils/comments.utils';
import type { CommentsListProps } from '@/types/comment.types';

export const CommentsList = ({
  taskId,
  comments,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
}: CommentsListProps) => {
  const tree = buildCommentTree(comments);

  if (tree.length === 0) {
    return <EmptyComments />;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tree.map((comment) => (
          <CommentItem
            key={comment.id}
            taskId={taskId}
            comment={comment}
            currentUserId={currentUserId}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={onReply}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
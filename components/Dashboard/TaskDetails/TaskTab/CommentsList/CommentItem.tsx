// components/CommentsList/CommentItem.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  CornerDownRight,
  MessageSquare,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/Shared/Avatar';
import { CommentContent } from './CommentContent';
import { RelativeTime } from './RelativeTime';
import type { CommentItemProps } from '@/types/comment.types';

export function CommentItem({
  comment,
  currentUserId,
  onDelete,
  onReply,
  isReply = false,
}: CommentItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const isOwn = comment.user.id === currentUserId;
  const replies = comment.replies ?? [];
  const hasReplies = replies.length > 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12, transition: { duration: 0.18 } }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <div
        className={cn(
          'group relative flex gap-3',
          isReply && 'ml-10 pl-3 border-l-2 border-border/40'
        )}
      >
        <Avatar
          name={comment.user.name}
          image={comment.user.image}
          size={isReply ? 'sm' : 'md'}
        />

        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground leading-none">
              {comment.user.name}
            </span>
            <RelativeTime date={comment.createdAt} />
            {comment.edited && (
              <span className="text-[10px] text-muted-foreground/50 italic">
                edited
              </span>
            )}
          </div>

          {/* Body */}
          <div
            className={cn(
              'px-3.5 py-2.5 rounded-xl rounded-tl-sm',
              'bg-muted/50 border border-border/40',
              'transition-colors duration-150',
              isOwn && 'bg-primary/5 border-primary/15'
            )}
          >
            <CommentContent content={comment.content} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 px-1">
            {!isReply && (
              <button
                onClick={() => onReply(comment)}
                className={cn(
                  'flex items-center gap-1 text-[11px] font-medium',
                  'text-muted-foreground hover:text-primary transition-colors'
                )}
              >
                <CornerDownRight className="w-3 h-3" />
                Reply
              </button>
            )}

            {hasReplies && !isReply && (
              <button
                onClick={() => setShowReplies((v) => !v)}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                <motion.span
                  animate={{ rotate: showReplies ? 0 : -90 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronDown className="w-3 h-3" />
                </motion.span>
              </button>
            )}

            {isOwn && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={cn(
                  'flex items-center gap-1 text-[11px] font-medium ml-auto',
                  'text-muted-foreground/50 hover:text-destructive transition-colors',
                  'opacity-0 group-hover:opacity-100'
                )}
              >
                {isDeleting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Threaded replies */}
      {hasReplies && !isReply && (
        <AnimatePresence>
          {showReplies && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-3">
                <AnimatePresence mode="popLayout">
                  {replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      currentUserId={currentUserId}
                      onDelete={onDelete}
                      onReply={onReply}
                      isReply
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
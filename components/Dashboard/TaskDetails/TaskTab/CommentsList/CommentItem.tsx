import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CornerDownRight, MessageSquare, ChevronDown, Loader2, Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/Shared/Avatar';
import { CommentContent } from './CommentContent';
import { RelativeTime } from './RelativeTime';
import type { CommentItemProps } from '@/types/comment.types';

interface ExtendedCommentItemProps extends CommentItemProps {
  onEdit: (commentId: string, taskId: string, newContent: string) => Promise<void>;
  taskId: string;
}

export function CommentItem({
  comment,
  currentUserId,
  onDelete,
  onReply,
  onEdit,
  taskId,
  isReply = false,
}: ExtendedCommentItemProps) {
  const [isDeleting, setIsDeleting]   = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [isEditing, setIsEditing]     = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSaving, setIsSaving]       = useState(false);

  const isOwn    = comment.user.id === currentUserId;
  const replies  = comment.replies ?? [];
  const hasReplies = replies.length > 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try { await onDelete(comment.id); }
    finally { setIsDeleting(false); }
  };

  const handleEditSave = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onEdit(comment.id, taskId, editContent);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12, transition: { duration: 0.18 } }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <div className={cn('group relative flex gap-3', isReply && 'ml-10 pl-3 border-l-2 border-border/40')}>
        <Avatar name={comment.user.name} image={comment.user.image} size={isReply ? 'sm' : 'md'} />

        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground leading-none">{comment.user.name}</span>
            <RelativeTime date={comment.createdAt} />
            {comment.edited && (
              <span className="text-[10px] text-muted-foreground/50 italic">edited</span>
            )}
          </div>

          {/* Body — switches between view and edit mode */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-primary/40 bg-muted/50 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEditSave}
                  disabled={isSaving}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition"
                >
                  {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Save
                </button>
                <button
                  onClick={handleEditCancel}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className={cn(
              'px-3.5 py-2.5 rounded-xl rounded-tl-sm',
              'bg-muted/50 border border-border/40 transition-colors duration-150',
              isOwn && 'bg-primary/5 border-primary/15'
            )}>
              <CommentContent content={comment.content} />
            </div>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-3 px-1">
              {!isReply && (
                <button
                  onClick={() => onReply(comment)}
                  className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
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
                  <motion.span animate={{ rotate: showReplies ? 0 : -90 }} transition={{ duration: 0.15 }}>
                    <ChevronDown className="w-3 h-3" />
                  </motion.span>
                </button>
              )}
              {isOwn && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-[11px] font-medium md:text-muted-foreground/50 hover:text-primary transition-colors md:opacity-0 group-hover:opacity-100"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-1 text-[11px] font-medium ml-auto md:text-muted-foreground/50 text-destructive hover:text-destructive transition-colors md:opacity-0 group-hover:opacity-100"
                  >
                    {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
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
                      onEdit={onEdit}
                      taskId={taskId}
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
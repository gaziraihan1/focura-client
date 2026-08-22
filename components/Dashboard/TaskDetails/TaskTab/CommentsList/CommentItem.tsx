import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Trash2, CornerDownRight, MessageSquare, ChevronDown, Loader2, Pencil, Check, X, AlertCircle } from 'lucide-react';
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
  const [isDeleting, setIsDeleting]       = useState(false);
  const [showReplies, setShowReplies]     = useState(true);
  const [isEditing, setIsEditing]         = useState(false);
  const [editContent, setEditContent]     = useState(comment.content);
  const [isSaving, setIsSaving]           = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwn    = comment.user.id === currentUserId;
  // Optimistic (still-uploading) comments don't have a server id yet — replying
  // to one would persist a parentId that never exists and orphan the reply.
  const isOptimistic = comment.id.startsWith("optimistic-comment-");
  const replies  = comment.replies ?? [];
  const hasReplies = replies.length > 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try { await onDelete(comment.id); }
    finally { setIsDeleting(false); setShowDeleteConfirm(false); }
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
      <div className={cn(
        'group relative flex gap-3',
        isReply && 'ml-10 pl-3 border-l-2 border-primary/10'
      )}>
        <Avatar name={comment.user.name} image={comment.user.image} size={isReply ? 'sm' : 'md'} />

        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              'text-sm font-semibold leading-none',
              isOwn ? 'text-primary' : 'text-foreground'
            )}>
              {comment.user.name}
            </span>
            <RelativeTime date={comment.createdAt} />
            {comment.edited && (
              <span className="text-[10px] text-muted-foreground/50 italic" title="This comment has been edited">
                edited
              </span>
            )}
          </div>

          {/* Body — switches between view and edit mode */}
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="space-y-2"
              >
                <textarea
                  aria-label="Edit comment"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleEditSave();
                    }
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      handleEditCancel();
                    }
                  }}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-primary/40 bg-muted/50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEditSave}
                    disabled={isSaving}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                  <span className="text-[10px] text-muted-foreground/40 ml-1 hidden sm:inline">
                    <kbd className="px-1 py-0.5 rounded bg-muted/80 text-[9px] font-mono">⌘↵</kbd>
                    {" "}to save
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'px-3.5 py-2.5 rounded-xl rounded-tl-sm',
                  'bg-muted/40 border border-border/30 transition-colors duration-150',
                  'hover:bg-muted/60',
                  isOwn && 'bg-primary/5 border-primary/10 hover:bg-primary/8'
                )}
              >
                <CommentContent content={comment.content} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-1 px-0.5">
              {!isReply && !isOptimistic && (
                <button
                  onClick={() => onReply(comment)}
                  title="Reply to this comment"
                  className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors px-1.5 py-1 rounded-md hover:bg-primary/5"
                >
                  <CornerDownRight className="w-3 h-3" />
                  Reply
                </button>
              )}
              {hasReplies && !isReply && (
                <button
                  onClick={() => setShowReplies((v) => !v)}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1 rounded-md hover:bg-muted/60"
                >
                  <MessageSquare className="w-3 h-3" />
                  {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                  <motion.span animate={{ rotate: showReplies ? 0 : -90 }} transition={{ duration: 0.15 }}>
                    <ChevronDown className="w-3 h-3" />
                  </motion.span>
                </button>
              )}
              {isOwn && (
                <div className="flex items-center gap-0.5 ml-auto sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => setIsEditing(true)}
                    title="Edit comment"
                    className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground border border-border/60 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all px-2.5 py-1.5 rounded-lg"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    title="Delete comment"
                    className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground border border-border/60 hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all px-2.5 py-1.5 rounded-lg"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-card rounded-xl border border-border shadow-xl w-full max-w-sm"
              >
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-destructive/10 rounded-full shrink-0">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        Delete comment
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete this comment? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2.5 px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Threaded replies */}
      <AnimatePresence initial={false}>
        {hasReplies && !isReply && showReplies && (
          <motion.div
            key="replies"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
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
    </motion.div>
  );
}

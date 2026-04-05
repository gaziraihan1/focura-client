'use client';

import { useState }            from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Loader2, X, AlertTriangle } from 'lucide-react';
import { cn }                  from '@/lib/utils';
import { useDeleteWorkspace }  from '@/hooks/useAdmin';

interface Props {
  workspaceSlug: string;
  workspaceName: string;
  isOpen:        boolean;
  onClose:       () => void;
  onSuccess?:    () => void;
}

export function DeleteWorkspaceModal({
  workspaceSlug, workspaceName, isOpen, onClose, onSuccess,
}: Props) {
  const [reason,     setReason]     = useState('');
  const [hardDelete, setHardDelete] = useState(false);
  const [confirmed,  setConfirmed]  = useState('');

  const { mutate: deleteWs, isPending } = useDeleteWorkspace();

  const isValid = confirmed === workspaceName && (hardDelete ? true : true);

  const handleDelete = () => {
    if (!isValid) return;
    deleteWs(
      { slug: workspaceSlug, reason: reason.trim() || undefined, hardDelete },
      {
        onSuccess: () => {
          setReason(''); setConfirmed(''); setHardDelete(false);
          onClose();
          onSuccess?.();
        },
      },
    );
  };

  const handleClose = () => {
    if (isPending) return;
    setReason(''); setConfirmed(''); setHardDelete(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{    opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 flex flex-col gap-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Delete Workspace</h3>
                    <p className="text-xs text-muted-foreground truncate max-w-50">
                      {workspaceName}
                    </p>
                  </div>
                </div>
                <button
                  type="button" onClick={handleClose} disabled={isPending}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Delete type */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Delete Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHardDelete(false)}
                    className={cn(
                      'flex flex-col items-start gap-1 px-3.5 py-3 rounded-xl border text-left transition-all',
                      !hardDelete
                        ? 'border-amber-500/60 bg-amber-500/5 ring-1 ring-amber-500/20'
                        : 'border-border hover:bg-muted/50',
                    )}
                  >
                    <span className={cn('text-sm font-medium', !hardDelete ? 'text-amber-600' : 'text-foreground')}>
                      Suspend
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Soft delete — data kept, can be restored
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHardDelete(true)}
                    className={cn(
                      'flex flex-col items-start gap-1 px-3.5 py-3 rounded-xl border text-left transition-all',
                      hardDelete
                        ? 'border-destructive/60 bg-destructive/5 ring-1 ring-destructive/20'
                        : 'border-border hover:bg-muted/50',
                    )}
                  >
                    <span className={cn('text-sm font-medium', hardDelete ? 'text-destructive' : 'text-foreground')}>
                      Permanent
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Hard delete — removes all data forever
                    </span>
                  </button>
                </div>
              </div>

              {/* Hard delete warning */}
              {hardDelete && (
                <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-destructive/5 border border-destructive/20">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive leading-relaxed">
                    This will permanently delete all projects, tasks, files, members, and billing data.
                    <strong> This cannot be undone.</strong>
                  </p>
                </div>
              )}

              {/* Reason */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Reason <span className="text-muted-foreground/50">(optional)</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isPending}
                  rows={2}
                  maxLength={500}
                  placeholder="Why is this workspace being deleted…"
                  className={cn(
                    'w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5',
                    'text-sm text-foreground placeholder:text-muted-foreground/50 resize-none',
                    'focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
                    'transition-all disabled:opacity-50',
                  )}
                />
              </div>

              {/* Confirm by typing name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Type workspace name to confirm
                </label>
                <input
                  type="text"
                  value={confirmed}
                  onChange={(e) => setConfirmed(e.target.value)}
                  disabled={isPending}
                  placeholder={workspaceName}
                  className={cn(
                    'w-full rounded-xl border px-3.5 py-2.5 bg-transparent',
                    'text-sm text-foreground placeholder:text-muted-foreground/40',
                    'focus:outline-none transition-all disabled:opacity-50',
                    confirmed === workspaceName
                      ? 'border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20'
                      : 'border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
                  )}
                />
                {confirmed && confirmed !== workspaceName && (
                  <p className="text-[11px] text-destructive">Name doesn&apos;t match</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button" onClick={handleClose} disabled={isPending}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleDelete}
                  disabled={!isValid || isPending}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                    hardDelete
                      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      : 'bg-amber-500 text-white hover:bg-amber-500/90',
                    'transition-colors disabled:opacity-60 disabled:cursor-not-allowed',
                  )}
                >
                  {isPending
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Trash2  className="w-3.5 h-3.5" />}
                  {isPending
                    ? 'Deleting…'
                    : hardDelete ? 'Delete Forever' : 'Suspend'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
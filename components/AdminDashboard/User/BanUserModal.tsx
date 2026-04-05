'use client';

import { useState }            from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { cn }                  from '@/lib/utils';
import { useBanUser }          from '@/hooks/useAdmin';

interface Props {
  userId:   string;
  userName: string;
  isOpen:   boolean;
  onClose:  () => void;
}

export function BanUserModal({ userId, userName, isOpen, onClose }: Props) {
  const [reason, setReason] = useState('');
  const { mutate: ban, isPending } = useBanUser();

  const handleBan = () => {
    if (!reason.trim()) return;
    ban(
      { id: userId, reason: reason.trim() },
      {
        onSuccess: () => {
          setReason('');
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    if (isPending) return;
    setReason('');
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
              className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Ban User</h3>
                    <p className="text-xs text-muted-foreground">
                      Suspending <span className="font-medium text-foreground">{userName}</span>
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

              {/* Reason */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Reason <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isPending}
                  rows={3}
                  maxLength={500}
                  placeholder="Explain why this user is being suspended…"
                  className={cn(
                    'w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5',
                    'text-sm text-foreground placeholder:text-muted-foreground/50 resize-none',
                    'focus:outline-none focus:border-destructive/50 focus:ring-1 focus:ring-destructive/20',
                    'transition-all disabled:opacity-50',
                  )}
                />
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">
                    This reason will be sent to the user via email.
                  </p>
                  <span className={cn(
                    'text-[10px] tabular-nums',
                    reason.length > 450 ? 'text-destructive' : 'text-muted-foreground/50',
                  )}>
                    {reason.length}/500
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button" onClick={handleClose} disabled={isPending}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleBan}
                  disabled={!reason.trim() || isPending}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                    'transition-colors disabled:opacity-60 disabled:cursor-not-allowed',
                  )}
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  {isPending ? 'Banning…' : 'Ban User'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
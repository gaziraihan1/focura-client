'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateFeatureRequest } from '@/hooks/useFeatures';

interface Props { isOpen: boolean; onClose: () => void; }

export function FeatureRequestModal({ isOpen, onClose }: Props) {
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');

  const { mutate: create, isPending } = useCreateFeatureRequest();

  const isValid = title.trim().length > 0 && description.trim().length > 0;

  const handleClose = () => {
    if (isPending) return;
    setTitle(''); setDescription('');
    onClose();
  };

  const handleSubmit = () => {
    if (!isValid || isPending) return;
    create(
      { title: title.trim(), description: description.trim() },
      { onSuccess: handleClose },
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl shadow-black/20 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Lightbulb className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">Request a Feature</h2>
                </div>
                <button
                  type="button" onClick={handleClose} disabled={isPending}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Feature title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isPending}
                    maxLength={150}
                    placeholder="Give your idea a clear, short title…"
                    className={cn(
                      'w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5',
                      'text-sm text-foreground placeholder:text-muted-foreground/50',
                      'focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
                      'transition-all disabled:opacity-50',
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isPending}
                    maxLength={2000}
                    rows={5}
                    placeholder="Describe the feature and how it would help you…"
                    className={cn(
                      'w-full rounded-xl border border-border bg-transparent px-3.5 py-2.5',
                      'text-sm text-foreground placeholder:text-muted-foreground/50 resize-none',
                      'focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
                      'transition-all disabled:opacity-50',
                    )}
                  />
                  <div className="flex justify-end">
                    <span className={cn(
                      'text-[11px] tabular-nums',
                      description.length > 1800 ? 'text-destructive' : 'text-muted-foreground/50',
                    )}>
                      {description.length} / 2,000
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Your request will be reviewed by the Focura team. Once approved it will be open for community voting.
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                <button
                  type="button" onClick={handleClose} disabled={isPending}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button" onClick={handleSubmit}
                  disabled={!isValid || isPending}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium',
                    'bg-primary text-primary-foreground hover:bg-primary/90 transition-all',
                    'shadow-sm shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed',
                  )}
                >
                  {isPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Lightbulb className="w-4 h-4" />}
                  {isPending ? 'Submitting…' : 'Submit Request'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnnouncementForm } from './AnnouncementForm';
import type {
  AnnouncementModalProps,
} from '@/types/announcement.types';

export function AnnouncementModal({
  isOpen,
  isLoading,
  isValid,
  form,
  members,
  projects,
  lockedProjectId,
  onClose,
  onSubmit,
  onTitleChange,
  onContentChange,
  onVisibilityChange,
  onIsPinnedChange,
  onProjectChange,
  onTargetToggle,
}: AnnouncementModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={cn(
                'relative w-full max-w-lg max-h-[90vh] flex flex-col',
                'rounded-2xl bg-card border border-border shadow-2xl shadow-black/20',
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Megaphone className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">
                    New Announcement
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body — pure form, no state */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <AnnouncementForm
                  formState={form}
                  members={members}
                  projects={projects}
                  lockedProjectId={lockedProjectId}
                  onTitleChange={onTitleChange}
                  onContentChange={onContentChange}
                  onVisibilityChange={onVisibilityChange}
                  onIsPinnedChange={onIsPinnedChange}
                  onProjectChange={onProjectChange}
                  onTargetToggle={onTargetToggle}
                  disabled={isLoading}
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={onSubmit}
                  disabled={!isValid || isLoading}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium',
                    'bg-primary text-primary-foreground hover:bg-primary/90',
                    'transition-all duration-150 shadow-sm shadow-primary/20',
                    'disabled:opacity-40 disabled:cursor-not-allowed',
                  )}
                >
                  {isLoading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Megaphone className="w-4 h-4" />}
                  {isLoading ? 'Publishing…' : 'Publish'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
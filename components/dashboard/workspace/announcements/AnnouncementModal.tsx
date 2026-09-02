'use client';

import { m as motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, Loader2, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { AnnouncementForm } from './AnnouncementForm';
import type {
  AnnouncementModalProps,
} from '@/types/announcement.types';

export function AnnouncementModal({
  isOpen,
  isLoading,
  isValid,
  isEditing,
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
          <motion.div role="presentation"
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
                'relative w-full max-w-lg max-h-[95dvh] flex flex-col',
                'rounded-2xl bg-card border border-border shadow-2xl shadow-black/20',
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-border shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                    <Megaphone className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h2 className="text-base font-semibold text-foreground truncate">
                      {isEditing ? 'Edit Announcement' : 'New Announcement'}
                    </h2>
                    {form.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        <Pin className="w-2.5 h-2.5" />
                        Will be pinned
                      </span>
                    )}
                  </div>
                </div>
                <Button aria-label="Close"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Body — pure form, no state */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
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
              <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-4 border-t border-border shrink-0">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </Button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => onSubmit(form)}
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
                  {isLoading
                    ? (isEditing ? 'Saving…' : 'Publishing…')
                    : (isEditing ? 'Save Changes' : 'Publish')}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

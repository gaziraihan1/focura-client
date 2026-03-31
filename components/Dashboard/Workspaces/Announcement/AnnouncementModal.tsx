'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnnouncementForm } from './AnnouncementForm';
import type {
  CreateAnnouncementDto,
  AnnouncementVisibility,
} from '@/types/announcement.types';

interface WorkspaceMember {
  userId: string;
  user: { id: string; name: string; image: string | null };
}

interface AnnouncementModalProps {
  isOpen:    boolean;
  onClose:   () => void;
  onSubmit:  (data: CreateAnnouncementDto) => Promise<void>;
  isLoading: boolean;
  members:   WorkspaceMember[];
}

const DEFAULT_FORM = {
  title:      '',
  content:    '',
  visibility: 'PUBLIC' as AnnouncementVisibility,
  isPinned:   false,
  targetIds:  [] as string[],
};

export function AnnouncementModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  members,
}: AnnouncementModalProps) {
  const [form, setForm] = useState(DEFAULT_FORM);

  const resetForm = useCallback(() => setForm(DEFAULT_FORM), []);

  const handleClose = () => {
    if (isLoading) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    await onSubmit({
      title:      form.title.trim(),
      content:    form.content.trim(),
      visibility: form.visibility,
      isPinned:   form.isPinned,
      targetIds:  form.visibility === 'PRIVATE' ? form.targetIds : [],
    });
    resetForm();
  };

  const isValid = form.title.trim().length > 0 && form.content.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
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
                  onClick={handleClose}
                  disabled={isLoading}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <AnnouncementForm
                  formState={form}
                  members={members}
                  onTitleChange={(v)      => setForm((f) => ({ ...f, title: v }))}
                  onContentChange={(v)    => setForm((f) => ({ ...f, content: v }))}
                  onVisibilityChange={(v) => setForm((f) => ({ ...f, visibility: v, targetIds: [] }))}
                  onIsPinnedChange={(v)   => setForm((f) => ({ ...f, isPinned: v }))}
                  onTargetToggle={(uid)   =>
                    setForm((f) => ({
                      ...f,
                      targetIds: f.targetIds.includes(uid)
                        ? f.targetIds.filter((id) => id !== uid)
                        : [...f.targetIds, uid],
                    }))
                  }
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleSubmit}
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
                    : <Megaphone className="w-4 h-4" />
                  }
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
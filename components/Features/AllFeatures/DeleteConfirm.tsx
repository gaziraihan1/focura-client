"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

export function DeleteConfirm({
  title, isDeleting, onConfirm, onCancel,
}: { title: string; isDeleting: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1,    y: 0 }}
          exit={{    opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="w-full max-w-sm rounded-2xl bg-card border border-border shadow-2xl p-6 flex flex-col gap-4"
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-11 h-11 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">Delete feature request?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground/80">&quot;{title}&quot;</span> will be permanently removed.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button" onClick={onCancel} disabled={isDeleting}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button" onClick={onConfirm} disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-60"
            >
              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
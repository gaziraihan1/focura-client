"use client"
import { Label, useDeleteLabel } from "@/hooks/useLabels";
import {motion} from 'framer-motion'
import { AlertCircle, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  label: Label;
  onClose: () => void;
}

export default function DeleteConfirmModal({ label, onClose }: DeleteConfirmModalProps) {
  const deleteMutation = useDeleteLabel();
  const taskCount = label._count?.tasks ?? 0;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(label.id);
      onClose();
    } catch (error) {
      console.error('Error deleting label:', error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card rounded-lg border border-border shadow-lg w-full max-w-md"
        >
          {/* Header */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-destructive/10 rounded-full">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Delete Label
                </h2>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete the label{' '}
                  <span className="font-medium text-foreground">&quot;{label.name}&quot;</span>?
                </p>
                {taskCount > 0 && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-foreground">
                      This label is currently used by{' '}
                      <span className="font-semibold">{taskCount}</span> task
                      {taskCount !== 1 ? 's' : ''}. The label will be removed from all
                      tasks.
                    </p>
                  </div>
                )}
                <p className="mt-3 text-sm text-muted-foreground">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              disabled={deleteMutation.isPending}
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Delete Label</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
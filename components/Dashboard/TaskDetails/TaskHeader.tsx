import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Edit, Trash, Loader2, AlertCircle } from 'lucide-react';

interface TaskHeaderProps {
  isEditing: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const TaskHeader = ({
  isEditing,
  onBack,
  onEdit,
  onDelete,
  isDeleting,
  canEdit = true,
  canDelete = true,
}: TaskHeaderProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {!isEditing && canEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
            >
              <Edit size={16} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash size={16} />
              )}
              <span className="hidden sm:inline">Delete</span>
            </button>
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
                        Delete task
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete this task? This action cannot be undone.
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
                    onClick={() => { setShowDeleteConfirm(false); onDelete(); }}
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
    </>
  );
};

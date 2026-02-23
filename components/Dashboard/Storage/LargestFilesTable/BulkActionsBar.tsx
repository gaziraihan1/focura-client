import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Loader2, AlertCircle } from 'lucide-react';
import { formatStorageSize } from '@/hooks/useStoragePage';

interface BulkActionsBarProps {
  selectedCount: number;
  selectedFilesSize: number;
  deletableCount: number;
  isAdmin: boolean;
  isDeleting: boolean;
  onClearSelection: () => void;
  onBulkDelete: () => void;
}

export function BulkActionsBar({
  selectedCount,
  selectedFilesSize,
  deletableCount,
  isAdmin,
  isDeleting,
  onClearSelection,
  onBulkDelete,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-4 p-4 bg-muted/50 rounded-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedCount} file(s) selected
            </span>
            <span className="text-sm text-muted-foreground">
              {formatStorageSize(selectedFilesSize)}
            </span>
            {!isAdmin && deletableCount < selectedCount && (
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
                <AlertCircle className="w-3 h-3" />
                <span className="text-xs">
                  Only {deletableCount} file(s) can be deleted
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearSelection}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-background hover:bg-muted transition-colors"
            >
              Clear
            </button>
            <button
              onClick={onBulkDelete}
              disabled={isDeleting || deletableCount === 0}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3" />
              )}
              Delete {isAdmin ? 'Selected' : 'My Files'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
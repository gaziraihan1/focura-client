'use client';

import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  fileName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmModal({
  fileName,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative bg-background border rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Delete File</h2>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="font-medium mb-1">Are you sure?</p>
              <p className="text-sm text-muted-foreground">
                You are about to delete{' '}
                <span className="font-medium text-foreground">&quot;{fileName}&quot;</span>. This
                action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>

      <div className="absolute inset-0 -z-10" onClick={onCancel} />
    </div>
  );
}
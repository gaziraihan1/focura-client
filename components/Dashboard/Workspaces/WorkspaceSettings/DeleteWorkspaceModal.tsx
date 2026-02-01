import { AlertCircle, Trash2, Loader2 } from "lucide-react";

interface DeleteWorkspaceModalProps {
  isOpen: boolean;
  workspaceName: string;
  isDeleting: boolean;
  onDelete: () => void;
  onClose: () => void;
}

export function DeleteWorkspaceModal({
  isOpen,
  workspaceName,
  isDeleting,
  onDelete,
  onClose,
}: DeleteWorkspaceModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl border border-border w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-red-500/10">
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Delete Workspace?
          </h3>
        </div>

        <p className="text-muted-foreground mb-6">
          This will permanently delete <strong>{workspaceName}</strong> and all
          its projects, tasks, and data. This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 rounded-lg bg-red-500 text-white hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Trash2 size={18} />
            )}
            Delete Permanently
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-lg border border-border hover:bg-accent transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
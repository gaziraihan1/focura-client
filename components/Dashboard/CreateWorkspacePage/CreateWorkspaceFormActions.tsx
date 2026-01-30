import { Loader2, Save } from "lucide-react";

interface CreateWorkspaceFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export function CreateWorkspaceFormActions({
  isSubmitting,
  onCancel,
}: CreateWorkspaceFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-accent transition disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Creating...
          </>
        ) : (
          <>
            <Save size={18} />
            Create Workspace
          </>
        )}
      </button>
    </div>
  );
}
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-6 py-3"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 hover:opacity-90"
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
      </Button>
    </div>
  );
}
import { Save, Loader2 } from "lucide-react";

interface FormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

export function FormActions({ isLoading, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2 rounded-lg border border-border hover:bg-accent transition"
      >
        Cancel
      </button>
      <button
        disabled={isLoading}
        className="px-6 py-2 rounded-lg bg-primary text-primary-foreground flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Creating
          </>
        ) : (
          <>
            <Save size={16} />
            Create Task
          </>
        )}
      </button>
    </div>
  );
}
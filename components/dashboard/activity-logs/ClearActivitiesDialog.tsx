import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ClearActivitiesDialogProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ClearActivitiesDialog({
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: ClearActivitiesDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Clear all activities"
        className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Clear all activities?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently delete all activity logs. This action cannot
              be undone.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-foreground"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Clearing..." : "Clear Activities"}
          </Button>
        </div>
      </div>
    </div>
  );
}
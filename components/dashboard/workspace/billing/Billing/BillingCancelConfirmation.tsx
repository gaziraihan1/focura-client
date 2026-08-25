// components/WorkspaceBilling/CancelConfirmation.tsx

interface CancelConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function BillingCancelConfirmation({
  onConfirm,
  onCancel,
  isLoading,
}: CancelConfirmationProps) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
      <p className="text-sm text-destructive font-medium">
        This workspace will revert to the Free plan after your current billing
        period ends. Your other workspaces are not affected.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-4 py-1.5 rounded-lg bg-destructive text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {isLoading ? 'Canceling…' : 'Yes, cancel plan'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Keep plan
        </button>
      </div>
    </div>
  );
}
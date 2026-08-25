import { X } from "lucide-react";

interface InvitationErrorStateProps {
  error: string | null;
  onGoToDashboard: () => void;
}

export function InvitationErrorState({
  error,
  onGoToDashboard,
}: InvitationErrorStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Invalid Invitation
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || "This invitation link is invalid or has expired."}
          </p>
          <button
            onClick={onGoToDashboard}
            className="w-full bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
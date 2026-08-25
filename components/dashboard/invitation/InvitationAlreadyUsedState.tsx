import { Check } from "lucide-react";

interface InvitationAlreadyUsedStateProps {
  status: string;
  onGoToWorkspace: () => void;
}

export function InvitationAlreadyUsedState({
  status,
  onGoToWorkspace,
}: InvitationAlreadyUsedStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Already Accepted
          </h1>
          <p className="text-muted-foreground mb-6">
            This invitation has already been {status.toLowerCase()}.
          </p>
          <button
            onClick={onGoToWorkspace}
            className="w-full bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
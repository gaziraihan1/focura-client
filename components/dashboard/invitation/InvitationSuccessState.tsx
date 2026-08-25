import { Check } from "lucide-react";

interface InvitationSuccessStateProps {
  workspaceName: string;
}

export function InvitationSuccessState({
  workspaceName,
}: InvitationSuccessStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-chart-4/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-chart-4" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome to {workspaceName}!
          </h1>
          <p className="text-muted-foreground mb-6">
            You&apos;ve successfully joined the workspace. Redirecting...
          </p>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
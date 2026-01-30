import { Loader2 } from "lucide-react";

export function InvitationLoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading invitation...</p>
      </div>
    </div>
  );
}
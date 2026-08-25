import InvitationHeader from "./InvitationCard/InvitationHeader";
import InvitationContent from "./InvitationCard/InvitationContent";

interface Workspace {
  name: string;
  description?: string | null;
  color?: string | null;
  logo?: string | null;
  slug: string;
}

export interface Invitation {
  email: string;
  role: string;
  expiresAt: string;
  workspace: Workspace;
}

interface InvitationCardProps {
  invitation: Invitation;
  isAccepting: boolean;
  localError: string | null;
  onAccept: () => void;
  onDecline: () => void;
}



export function InvitationCard({
  invitation,
  isAccepting,
  localError,
  onAccept,
  onDecline,
}: InvitationCardProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {/* Header with workspace branding */}
         <InvitationHeader invitation={invitation} />

          {/* Content */}
          <InvitationContent invitation={invitation} isAccepting={isAccepting} onAccept={onAccept} onDecline={onDecline} localError={localError} />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By accepting, you agree to join this workspace and collaborate with
          its members.
        </p>
      </div>
    </div>
  );
}
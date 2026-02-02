import React from "react";
import { Invitation } from "../InvitationCard";
import InvitationError from "./InvitationError";
import InvitationActions from "./InvitationActions";
import InvitationDetails from "./InvitationDetails";

interface InvitationContentProps {
  invitation: Invitation;
  isAccepting: boolean;
  localError: string | null;
  onAccept: () => void;
  onDecline: () => void;
}

export default function InvitationContent({
  invitation,
  onDecline,
  isAccepting,
  onAccept,
  localError,
}: InvitationContentProps) {
  return (
    <div className="p-8">
      {invitation.workspace.description && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-muted-foreground text-sm">
            {invitation.workspace.description}
          </p>
        </div>
      )}
      <InvitationDetails invitation={invitation} />

      <InvitationActions
        onDecline={onDecline}
        onAccept={onAccept}
        isAccepting={isAccepting}
      />
      {localError && <InvitationError localError={localError} />}
    </div>
  );
}

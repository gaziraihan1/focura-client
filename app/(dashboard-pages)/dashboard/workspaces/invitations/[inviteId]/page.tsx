"use client";

import { useParams } from "next/navigation";
import { useInvitationPage } from "@/hooks/useInvitationPage";
import { InvitationLoadingState } from "@/components/Dashboard/Invitation/InvitationLoadingState";
import { InvitationErrorState } from "@/components/Dashboard/Invitation/InvitationErrorState";
import { InvitationSuccessState } from "@/components/Dashboard/Invitation/InvitationSuccessState";
import { InvitationExpiredState } from "@/components/Dashboard/Invitation/InvitationExpiredState";
import { InvitationAlreadyUsedState } from "@/components/Dashboard/Invitation/InvitationAlreadyUsedState";
import { InvitationCard } from "@/components/Dashboard/Invitation/InvitationCard";

export default function InvitationPage() {
  const params = useParams();
  const token = params.inviteId as string;

  const {
    invitation,
    isLoading,
    error,
    success,
    isExpired,
    isAlreadyUsed,
    isAccepting,
    handleAccept,
    handleDecline,
    handleGoToDashboard,
    handleGoToWorkspace,
    localError,
  } = useInvitationPage({ token });

  if (isLoading) {
    return <InvitationLoadingState />;
  }

  if (error || !invitation) {
    return (
      <InvitationErrorState error={error} onGoToDashboard={handleGoToDashboard} />
    );
  }

  if (success) {
    return <InvitationSuccessState workspaceName={invitation.workspace.name} />;
  }

  if (isExpired) {
    return (
      <InvitationExpiredState
        workspaceName={invitation.workspace.name}
        onGoToDashboard={handleGoToDashboard}
      />
    );
  }

  if (isAlreadyUsed) {
    return (
      <InvitationAlreadyUsedState
        status={invitation.status}
        onGoToWorkspace={handleGoToWorkspace}
      />
    );
  }

  return (
    <InvitationCard
      invitation={invitation}
      isAccepting={isAccepting}
      localError={localError}
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
}
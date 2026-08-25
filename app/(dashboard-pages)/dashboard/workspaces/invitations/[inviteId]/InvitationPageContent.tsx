"use client";

import { useInvitationPage } from "@/hooks/useInvitationPage";
import { InvitationLoadingState } from "@/components/dashboard/invitation/InvitationLoadingState";
import { InvitationErrorState } from "@/components/dashboard/invitation/InvitationErrorState";
import { InvitationSuccessState } from "@/components/dashboard/invitation/InvitationSuccessState";
import { InvitationExpiredState } from "@/components/dashboard/invitation/InvitationExpiredState";
import { InvitationAlreadyUsedState } from "@/components/dashboard/invitation/InvitationAlreadyUsedState";
import { InvitationCard } from "@/components/dashboard/invitation/InvitationCard";

interface InvitationPageContentProps {
  token: string;
}

export function InvitationPageContent({ token }: InvitationPageContentProps) {
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

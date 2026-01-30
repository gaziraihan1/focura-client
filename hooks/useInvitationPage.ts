import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInvitation } from "@/hooks/useInvitation";

interface UseInvitationPageProps {
  token: string;
}

export function useInvitationPage({ token }: UseInvitationPageProps) {
  const router = useRouter();
  const {
    invitation,
    isLoading,
    error: fetchError,
    acceptInvitation,
    isAccepting,
  } = useInvitation(token);

  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAccept = async () => {
    setLocalError(null);

    try {
      const workspace = await acceptInvitation();
      setSuccess(true);

      setTimeout(() => {
        router.push(`/dashboard/workspaces/${workspace.slug}`);
      }, 2000);
    } catch (err: unknown) {
      const error = err as Error;
      setLocalError(error.message || "Failed to accept invitation");
    }
  };

  const handleDecline = () => {
    router.push("/dashboard");
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleGoToWorkspace = () => {
    if (invitation) {
      router.push(`/dashboard/workspaces/${invitation.workspace.slug}`);
    }
  };

  const error = fetchError || localError;
  const isExpired = invitation && new Date(invitation.expiresAt) < new Date();
  const isAlreadyUsed = invitation && invitation.status !== "PENDING";

  return {
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
  };
}
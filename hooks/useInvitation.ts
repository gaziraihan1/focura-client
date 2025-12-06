// hooks/useInvitation.ts
import { useState, useEffect } from "react";
import { api } from "@/lib/axios";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  color?: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  workspace: Workspace;
}

interface UseInvitationReturn {
  invitation: Invitation | null;
  isLoading: boolean;
  error: string | null;
  acceptInvitation: () => Promise<Workspace>;
  isAccepting: boolean;
}

export function useInvitation(token: string): UseInvitationReturn {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid invitation token");
      setIsLoading(false);
      return;
    }

    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<Invitation>(
        `/api/workspaces/invitations/${token}`,
        { showErrorToast: false }
      );

      if (response.success && response.data) {
        setInvitation(response.data);
      } else {
        setError("Failed to fetch invitation");
      }
    } catch (err: any) {
      const errorMessage = 
        err.response?.data?.message || 
        "Invalid or expired invitation";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptInvitation = async (): Promise<Workspace> => {
    try {
      setIsAccepting(true);

      const response = await api.post<Workspace>(
        `/api/workspaces/invitations/${token}/accept`,
        undefined,
        { 
          showSuccessToast: true,
          showErrorToast: true 
        }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to accept invitation");
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = 
        err.response?.data?.message || 
        "Failed to accept invitation";
      throw new Error(errorMessage);
    } finally {
      setIsAccepting(false);
    }
  };

  return {
    invitation,
    isLoading,
    error,
    acceptInvitation,
    isAccepting,
  };
}
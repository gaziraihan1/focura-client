"use client";

import {  useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, X, Loader2, Mail, Users, Shield, Clock } from "lucide-react";
import { useInvitation } from "@/hooks/useInvitation";

export default function InvitationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.inviteId as string;

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

      // Redirect to workspace after 2 seconds
      setTimeout(() => {
        router.push(`/dashboard/workspaces/${workspace.slug}`);
      }, 2000);
    } catch (err: any) {
      setLocalError(err.message || "Failed to accept invitation");
    }
  };

  const handleDecline = () => {
    router.push("/dashboard");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "bg-primary/10 text-primary border-primary/20";
      case "ADMIN":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      case "MEMBER":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20";
      case "GUEST":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const error = fetchError || localError;
  const isExpired = invitation && new Date(invitation.expiresAt) < new Date();
  const isAlreadyUsed = invitation && invitation.status !== "PENDING";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
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
              onClick={() => router.push("/dashboard")}
              className="w-full bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card border border-border rounded-xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-chart-4/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-chart-4" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome to {invitation.workspace.name}!
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

  if (isExpired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card border border-border rounded-xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Invitation Expired
            </h1>
            <p className="text-muted-foreground mb-6">
              This invitation to <strong>{invitation.workspace.name}</strong> has expired.
              Please contact the workspace administrator for a new invitation.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isAlreadyUsed) {
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
              This invitation has already been {invitation.status.toLowerCase()}.
            </p>
            <button
              onClick={() => router.push(`/dashboard/workspaces/${invitation.workspace.slug}`)}
              className="w-full bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Go to Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div 
            className="px-8 py-12 text-center relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${invitation.workspace.color || '#667eea'} 0%, ${invitation.workspace.color || '#667eea'}dd 100%)`
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }}></div>
            </div>
            <div className="relative">
              {invitation.workspace.logo ? (
                <img
                  src={invitation.workspace.logo}
                  alt={invitation.workspace.name}
                  className="w-20 h-20 rounded-xl mx-auto mb-4 bg-white/10 backdrop-blur-sm border-2 border-white/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl mx-auto mb-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
              )}
              <h1 className="text-3xl font-bold text-white mb-2">
                You're Invited!
              </h1>
              <p className="text-white/90 text-lg">
                Join <strong>{invitation.workspace.name}</strong> workspace
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {invitation.workspace.description && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm">
                  {invitation.workspace.description}
                </p>
              </div>
            )}

            {/* Invitation Details */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-0.5">
                    Invited Email
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {invitation.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                <Shield className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Your Role
                  </p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(invitation.role)}`}>
                    {invitation.role}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-0.5">
                    Expires
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invitation.expiresAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDecline}
                disabled={isAccepting}
                className="flex-1 px-6 py-3 rounded-lg font-medium border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={isAccepting}
                className="flex-1 px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Accept Invitation
                  </>
                )}
              </button>
            </div>

            {localError && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center">{localError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By accepting, you agree to join this workspace and collaborate with its members.
        </p>
      </div>
    </div>
  );
}
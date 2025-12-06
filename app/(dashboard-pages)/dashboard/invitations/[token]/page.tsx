// app/invitations/[token]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Users,
  Building2,
  ArrowRight,
} from "lucide-react";
import { useAcceptInvitation } from "@/hooks/useWorkspace";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function InvitationAcceptPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = params.token as string;

  const [invitationData, setInvitationData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isValidating, setIsValidating] = useState(true);

  const acceptInvitation = useAcceptInvitation();

  // Validate invitation token on mount
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      // Redirect to login with return URL
      router.push(`/login?callbackUrl=/invitations/${token}`);
      return;
    }

    validateInvitation();
  }, [token, status]);

  const validateInvitation = async () => {
    try {
      // Call your backend to validate the token
      // For now, we'll simulate this
      setIsValidating(false);
      
      // In production, fetch invitation details:
      // const response = await api.get(`/api/invitations/${token}/validate`);
      // setInvitationData(response.data.data);
      
      // Mock data for demonstration
      setInvitationData({
        workspace: {
          name: "Acme Inc",
          description: "A great workspace for collaboration",
          color: "#667eea",
          memberCount: 12,
        },
        role: "MEMBER",
        invitedBy: "John Doe",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    } catch (err: any) {
      setIsValidating(false);
      setError(err.message || "Invalid or expired invitation");
    }
  };

  const handleAccept = async () => {
    try {
      await acceptInvitation.mutateAsync(token);
      // Navigation handled in mutation onSuccess
    } catch (err: any) {
      setError(err.message || "Failed to accept invitation");
    }
  };

  const handleDecline = () => {
    router.push("/dashboard/workspaces");
  };

  // Loading state
  if (status === "loading" || isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Validating invitation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !invitationData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="rounded-xl bg-card border border-border p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <XCircle className="text-red-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Invalid Invitation
            </h2>
            <p className="text-muted-foreground mb-6">
              {error || "This invitation link is invalid or has expired."}
            </p>
            <Link
              href="/dashboard/workspaces"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Go to Workspaces
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success - Show invitation details
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center border-b border-border">
            <div
              className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white"
              style={{
                backgroundColor: invitationData.workspace.color || "#667eea",
              }}
            >
              {invitationData.workspace.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              You&apos;ve been invited!
            </h1>
            <p className="text-muted-foreground">
              <span className="font-medium">{invitationData.invitedBy}</span>{" "}
              invited you to join
            </p>
          </div>

          {/* Workspace Info */}
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {invitationData.workspace.name}
              </h2>
              {invitationData.workspace.description && (
                <p className="text-muted-foreground">
                  {invitationData.workspace.description}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Users size={20} className="text-primary" />
                  <span className="text-2xl font-bold text-foreground">
                    {invitationData.workspace.memberCount}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>

              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 size={20} className="text-primary" />
                  <span className="text-sm font-medium text-foreground uppercase tracking-wide">
                    {invitationData.role}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Your Role</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Mail size={18} className="text-primary" />
                What you&apos;ll get access to:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" />
                  Collaborate on projects and tasks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" />
                  Share files and documents
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" />
                  Real-time updates and notifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" />
                  Team analytics and insights
                </li>
              </ul>
            </div>

            {/* Expiry Notice */}
            <div className="text-center text-sm text-muted-foreground">
              This invitation expires on{" "}
              <span className="font-medium">
                {new Date(invitationData.expiresAt).toLocaleDateString()}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAccept}
                disabled={acceptInvitation.isPending}
                className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {acceptInvitation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Accept Invitation
                  </>
                )}
              </button>

              <button
                onClick={handleDecline}
                disabled={acceptInvitation.isPending}
                className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-accent transition disabled:opacity-50"
              >
                Decline
              </button>
            </div>

            {/* User Info */}
            <div className="pt-4 border-t border-border text-center text-sm text-muted-foreground">
              Accepting as{" "}
              <span className="font-medium text-foreground">
                {session?.user?.email}
              </span>
              <br />
              <Link href="/logout" className="text-primary hover:underline">
                Not you? Sign in with a different account
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            By accepting, you agree to Focura&apos;s{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
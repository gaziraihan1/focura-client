import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { useInviteMember } from "@/hooks/useWorkspace";

interface InviteMemberModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberModal({
  workspaceId,
  isOpen,
  onClose,
}: InviteMemberModalProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER" | "GUEST">("MEMBER");
  
  const inviteMember = useInviteMember();

  const handleInvite = async () => {
    if (!inviteEmail) return;

    try {
      await inviteMember.mutateAsync({
        workspaceId,
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail("");
      setInviteRole("MEMBER");
      onClose();
    } catch (error) {
      console.error("Invite error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-lg sm:rounded-xl border border-border w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
          Invite Team Member
        </h3>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-background border border-border text-sm sm:text-base text-foreground focus:ring-2 ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
              Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) =>
                setInviteRole(e.target.value as "ADMIN" | "MEMBER" | "GUEST")
              }
              className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-background border border-border text-sm sm:text-base text-foreground focus:ring-2 ring-primary outline-none"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
              <option value="GUEST">Guest</option>
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 sm:py-3 rounded-lg border border-border hover:bg-accent transition text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={!inviteEmail || inviteMember.isPending}
              className="w-full sm:flex-1 px-4 py-2 sm:py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {inviteMember.isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />
              )}
              Send Invitation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
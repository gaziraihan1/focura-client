import { Mail, Loader2 } from "lucide-react";
import { WorkspaceRole } from "@/hooks/useWorkspaceSettings";

interface InviteMemberModalProps {
  isOpen: boolean;
  email: string;
  role: WorkspaceRole;
  isInviting: boolean;
  onEmailChange: (email: string) => void;
  onRoleChange: (role: WorkspaceRole) => void;
  onInvite: () => void;
  onClose: () => void;
}

export function WorkspaceInviteMemberModal({
  isOpen,
  email,
  role,
  isInviting,
  onEmailChange,
  onRoleChange,
  onInvite,
  onClose,
}: InviteMemberModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl border border-border w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Invite Team Member
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value as WorkspaceRole)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
              <option value="GUEST">Guest</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onInvite}
              disabled={!email || isInviting}
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isInviting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Mail size={18} />
              )}
              Send Invitation
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-lg border border-border hover:bg-accent transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useEffectEvent } from "react";
import { Mail, Loader2 } from "lucide-react";
import { WorkspaceRole } from "@/hooks/useWorkspaceSettings";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { Button } from "@/components/ui/Button";

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
  const trapRef = useFocusTrap(isOpen);

  // Close on Escape
  const onEscape = useEffectEvent((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); });
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-member-title"
    >
      <div
        ref={trapRef}
        className="bg-card rounded-xl border border-border w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="invite-member-title" className="text-xl font-semibold text-foreground mb-4">
          Invite Team Member
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="invite-email" className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
            />
          </div>

          <div>
            <label htmlFor="invite-role" className="block text-sm font-medium text-foreground mb-2">
              Role
            </label>
            <select
              id="invite-role"
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
            <Button
              onClick={onInvite}
              disabled={!email || isInviting}
              className="flex-1 px-4 py-3 hover:opacity-90 flex items-center justify-center gap-2"
            >
              {isInviting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Mail size={18} />
              )}
              Send Invitation
            </Button>
            <Button variant="outline" onClick={onClose} className="px-4 py-3 hover:bg-accent">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

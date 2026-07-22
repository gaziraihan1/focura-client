'use client';

import { useState } from 'react';
import { User2, Mail, Trash2,  Loader2 } from 'lucide-react';
import { useWorkspace, useWorkspaceMembers, useInviteMember, useRemoveMember, useUpdateMemberRole } from '@/hooks/useWorkspace';
import toast from 'react-hot-toast';
import { announce } from '@/lib/a11y';

interface MembersRolesFormProps {
  workspaceSlug: string;
}

const ROLE_OPTIONS = ['OWNER', 'ADMIN', 'MEMBER', 'GUEST'] as const;

export function MembersRolesForm({ workspaceSlug }: MembersRolesFormProps) {
  const { data: workspace } = useWorkspace(workspaceSlug);
  const { data: members = [], isLoading } = useWorkspaceMembers(workspace?.id || '');
  const inviteMember = useInviteMember();
  const removeMember = useRemoveMember();
  const updateRole = useUpdateMemberRole();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('MEMBER');
  const [inviting, setInviting] = useState(false);

  const handleInvite = async () => {
    if (!workspace || !inviteEmail.trim()) return;
    setInviting(true);
    try {
      await inviteMember.mutateAsync({
        workspaceId: workspace.id,
        email: inviteEmail,
        role: inviteRole as any,
      });
      setInviteEmail('');
      toast.success('Invitation sent');
      announce('Invitation sent successfully');
    } catch {
      toast.error('Failed to send invitation');
      announce('Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!workspace || !confirm('Remove this member?')) return;
    try {
      await removeMember.mutateAsync({
        workspaceId: workspace.id,
        memberId,
      });
      toast.success('Member removed');
      announce('Member removed from workspace');
    } catch {
      toast.error('Failed to remove member');
      announce('Failed to remove member');
    }
  };

  const handleRoleChange = async (memberId: string, role: string) => {
    if (!workspace) return;
    try {
      await updateRole.mutateAsync({
        workspaceId: workspace.id,
        memberId,
        role: role as any,
      });
      toast.success('Role updated');
      announce('Member role updated');
    } catch {
      toast.error('Failed to update role');
      announce('Failed to update role');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" role="status" aria-label="Loading members" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Invite Member */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
            <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Invite Member</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send an invitation to join this workspace
            </p>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="member-invite-email" className="block text-xs font-medium text-muted-foreground mb-2">
              Email Address
            </label>
            <input
              id="member-invite-email"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            />
          </div>
          <div className="w-32">
            <label htmlFor="member-invite-role" className="block text-xs font-medium text-muted-foreground mb-2">
              Role
            </label>
            <select
              id="member-invite-role"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
              <option value="GUEST">Guest</option>
            </select>
          </div>
          <button
            onClick={handleInvite}
            disabled={inviting || !inviteEmail.trim()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            Invite
          </button>
        </div>
      </div>

      {/* Members List */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
            <User2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Team Members</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {members.length} member{members.length !== 1 ? 's' : ''} in this workspace
            </p>
          </div>
        </div>

        <div className="space-y-3" role="list" aria-label="Team members">
          {members.map((member) => (
            <div key={member.id} role="listitem" className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold">
                  {member.user?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium">{member.user?.name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{member.user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor={`member-role-${member.id}`} className="sr-only">
                  Role for {member.user?.name}
                </label>
                <select
                  id={`member-role-${member.id}`}
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value)}
                  className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {member.role !== 'OWNER' && (
                  <button
                    onClick={() => handleRemove(member.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    aria-label={`Remove ${member.user?.name} from workspace`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

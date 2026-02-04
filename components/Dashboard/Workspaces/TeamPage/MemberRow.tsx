'use client';

import React from 'react';
import { Avatar }  from '@/components/Shared/Avatar';
import { RoleBadge }  from './RoleBadge';
import { RoleDropdown, WorkspaceRoleOption } from './RoleDropdown';
import { WorkspaceMemberRow } from '@/hooks/useTeamPage';

interface MemberRowProps {
  member: WorkspaceMemberRow;
  /** true when the logged-in user is the owner of this workspace */
  isCurrentUser: boolean;
  /** Whether the viewer has permission to change roles */
  canManage: boolean;
  /** Is this member the *only* OWNER? If so we must not let them be demoted. */
  isOnlyOwner: boolean;
  onRoleChange: (memberId: string, role: WorkspaceRoleOption) => void;
}

export function MemberRow({
  member,
  isCurrentUser,
  canManage,
  isOnlyOwner,
  onRoleChange,
}: MemberRowProps) {
  const showDropdown = canManage;
  const dropdownDisabled = isCurrentUser || (member.role === 'OWNER' && isOnlyOwner);
  const disabledReason = isCurrentUser
    ? 'You cannot change your own role'
    : 'Cannot demote the only Owner';

  return (
    <tr className="group border-b border-border/50 last:border-0 hover:bg-muted/40 transition-colors duration-100">
      {/* avatar + name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar image={member.user.image} name={member.displayName} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {member.displayName}
              {isCurrentUser && (
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">(you)</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
          </div>
        </div>
      </td>

      {/* joined date */}
      <td className="hidden md:table-cell px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {new Date(member.joinedAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </td>

      {/* role badge (always visible) + dropdown (replaces badge when canManage) */}
      <td className="px-4 py-3">
        {showDropdown ? (
          <RoleDropdown
            variant="workspace"
            currentRole={member.role as WorkspaceRoleOption}
            disabled={dropdownDisabled}
            disabledReason={disabledReason}
            onChange={(role) => onRoleChange(member.id, role)}
          />
        ) : (
          <RoleBadge role={member.role} />
        )}
      </td>
    </tr>
  );
}
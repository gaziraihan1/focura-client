'use client';

import { Avatar }       from '@/components/shared/Avatar';
import { RoleBadge }    from './RoleBadge';
import { RoleDropdown, WorkspaceRoleOption } from './RoleDropdown';
import { WorkspaceMemberRow } from '@/hooks/useTeamPage';

interface MemberRowProps {
  member: WorkspaceMemberRow;
  isCurrentUser: boolean;
  /** Role changes are OWNER-only on the backend (updateMemberRole). */
  canChangeRoles: boolean;
  isOnlyOwner: boolean;
  onRoleChange: (memberId: string, role: WorkspaceRoleOption) => void;
}

export function MemberRow({
  member,
  isCurrentUser,
  canChangeRoles,
  isOnlyOwner,
  onRoleChange,
}: MemberRowProps) {
  const showDropdown    = canChangeRoles;
  const dropdownDisabled = isCurrentUser || (member.role === 'OWNER' && isOnlyOwner);
  const disabledReason  = isCurrentUser
    ? 'You cannot change your own role'
    : 'Cannot demote the only Owner';

  return (
    <tr className="group border-b border-border/50 last:border-0 hover:bg-muted/40 transition-colors duration-100">

      {/* ── Member ─────────────────────────────────────────────────────── */}
      <td className="px-4 py-3 min-w-0">
        {/* min-w-0 on BOTH the td and the flex child is required for truncate to work */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar must not shrink */}
          <div className="shrink-0">
            <Avatar image={member.user.image} name={member.displayName} size="md" />
          </div>

          {/* Text block — must be min-w-0 to allow truncation inside a flex row */}
          <div className="min-w-0 flex-1">
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

      {/* ── Joined ─────────────────────────────────────────────────────── */}
      <td className="hidden md:table-cell px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {new Date(member.joinedAt).toLocaleDateString("en-US", {
          timeZone: "UTC",
          year:  'numeric',
          month: 'short',
          day:   'numeric',
        })}
      </td>

      {/* ── Role ───────────────────────────────────────────────────────── */}
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
'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { Avatar }      from '@/components/Shared/Avatar';
import { RoleBadge }   from './RoleBadge';
import { RoleDropdown, ProjectRoleOption } from './RoleDropdown';
import { EmptyState }  from './EmptyState';
import { ProjectMember } from '@/hooks/useProjects'; // adjust path

interface ProjectMembersPanelProps {
  projectId: string;
  members: ProjectMember[];
  currentUserId: string | null;
  /** Owner / Admin of the workspace may manage project member roles */
  canManage: boolean;
  onRoleChange: (projectId: string, memberId: string, role: ProjectRoleOption) => void;
}

export function ProjectMembersPanel({
  projectId,
  members,
  currentUserId,
  canManage,
  onRoleChange,
}: ProjectMembersPanelProps) {
  if (members.length === 0) {
    return (
      <div className="px-4">
        <EmptyState
          icon={Users}
          title="No members yet"
          description="Add members to this project to see them here."
        />
      </div>
    );
  }

  // only one MANAGER? protect against removing the sole manager
  const managerCount = members.filter((m) => m.role === 'MANAGER').length;

  return (
    <div className="p-4 flex flex-col gap-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
        Project Members
      </p>

      <div className="flex flex-col gap-1.5">
        {members.map((member) => {
          const isCurrentUser = member.user.id === currentUserId;
          const isSoleManager = member.role === 'MANAGER' && managerCount === 1;
          const dropdownDisabled = isCurrentUser || isSoleManager;
          const disabledReason = isCurrentUser
            ? 'You cannot change your own role'
            : 'Cannot demote the only Manager';

          return (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors"
            >
              {/* avatar + info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar image={member.user.image} name={member.user.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {member.user.name}
                    {isCurrentUser && (
                      <span className="ml-1 text-xs font-normal text-muted-foreground">(you)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                </div>
              </div>

              {/* role control */}
              <div className="shrink-0">
                {canManage ? (
                  <RoleDropdown
                    variant="project"
                    currentRole={member.role as ProjectRoleOption}
                    disabled={dropdownDisabled}
                    disabledReason={disabledReason}
                    onChange={(role) => onRoleChange(projectId, member.id, role)}
                  />
                ) : (
                  <RoleBadge role={member.role} compact />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
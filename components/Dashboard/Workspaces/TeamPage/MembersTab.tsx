'use client';

import React, { useState, useMemo } from 'react';
import { Search, Users } from 'lucide-react';
import { MemberRow }    from './MemberRow';
import { EmptyState }   from './EmptyState';
import { WorkspaceRoleOption } from './RoleDropdown';
import { WorkspaceMemberRow }  from '@/hooks/useTeamPage';

interface MembersTabProps {
  members: WorkspaceMemberRow[];
  currentUserId: string | null;
  canManage: boolean;
  onRoleChange: (memberId: string, role: WorkspaceRoleOption) => void;
}

// filter chips
const ROLE_FILTERS: { label: string; value: string | null }[] = [
  { label: 'All',           value: null },
  { label: 'Owners',       value: 'OWNER' },
  { label: 'Admins',       value: 'ADMIN' },
  { label: 'Members',      value: 'MEMBER' },
  { label: 'Guests',       value: 'GUEST' },
];

export function MembersTab({ members, currentUserId, canManage, onRoleChange }: MembersTabProps) {
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  // is there only one OWNER total?
  const ownerCount = members.filter((m) => m.role === 'OWNER').length;

  const filtered = useMemo(() => {
    let list = members;
    if (roleFilter) list = list.filter((m) => m.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.displayName.toLowerCase().includes(q) ||
          m.user.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [members, roleFilter, search]);

  return (
    <div className="flex flex-col gap-4">
      {/* ── search + filter row ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* search input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members…"
            className="w-full rounded-lg border border-border bg-background text-foreground pl-9 pr-3 py-2 text-sm
                       placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          />
        </div>

        {/* role chips */}
        <div className="flex flex-wrap gap-1.5">
          {ROLE_FILTERS.map((chip) => {
            const active = roleFilter === chip.value;
            return (
              <button
                key={chip.label}
                onClick={() => setRoleFilter(chip.value)}
                className={[
                  'px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150',
                  active
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-muted-foreground border-border hover:border-muted-foreground',
                ].join(' ')}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── table ─────────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/60 text-muted-foreground">
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider">Member</th>
                  <th className="hidden md:table-cell px-4 py-2.5 text-xs font-semibold uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    isCurrentUser={member.userId === currentUserId}
                    canManage={canManage}
                    isOnlyOwner={member.role === 'OWNER' && ownerCount === 1}
                    onRoleChange={onRoleChange}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* footer count */}
          <div className="px-4 py-2 border-t border-border/50 bg-muted/30">
            <span className="text-xs text-muted-foreground">
              Showing {filtered.length} of {members.length} member{members.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
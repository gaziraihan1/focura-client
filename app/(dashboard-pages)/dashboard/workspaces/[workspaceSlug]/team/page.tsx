'use client';

import React, { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

import { useTeamPage } from '@/hooks/useTeamPage';
import { StatsCards } from '@/components/Dashboard/Workspaces/TeamPage/StatsCard';
import { MembersTab } from '@/components/Dashboard/Workspaces/TeamPage/MembersTab';
import { ProjectsTab } from '@/components/Dashboard/Workspaces/TeamPage/ProjectsTab';
import {
  WorkspaceRoleOption,
  ProjectRoleOption,
} from '@/components/Dashboard/Workspaces/TeamPage/RoleDropdown';

// ─── Tab definitions ─────────────────────────────────────────────────────────
type TabId = 'members' | 'projects';

const TABS: { id: TabId; label: string }[] = [
  { id: 'members',  label: 'All Members' },
  { id: 'projects', label: 'Projects' },
];

// ─── Page ────────────────────────────────────────────────────────────────────
// This is the route-level entry point.
// workspaceSlug comes from the URL via useParams inside useTeamPage —
// nothing needs to be passed in.
export default function MainTeamPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ?? null;

  const {
    isLoading,
    canManageWorkspace,
    canManageProjects,
    workspaceId,        // resolved slug → id, owned by the hook
    workspaceName,      // for the heading
    stats,
    members,
    updateWorkspaceMemberRole,
    projects,
    projectDetails,
    updateProjectMemberRole,
  } = useTeamPage();   // ← no arguments

  const [activeTab, setActiveTab] = useState<TabId>('members');

  // ── mutation handlers ─────────────────────────────────────────────────────
  const handleWorkspaceRoleChange = useCallback(
    (memberId: string, role: WorkspaceRoleOption) => {
      updateWorkspaceMemberRole.mutate({
        workspaceId,   // comes from the hook, not a prop
        memberId,
        role,
      });
    },
    [updateWorkspaceMemberRole, workspaceId]
  );

  const handleProjectMemberRoleChange = useCallback(
    (projectId: string, memberId: string, role: ProjectRoleOption) => {
      updateProjectMemberRole.mutate({
        projectId,
        memberId,
        role,
      });
    },
    [updateProjectMemberRole]
  );

  // ── loading skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col gap-6 p-4 sm:p-6">
        {/* title placeholder */}
        <div className="flex flex-col gap-1.5">
          <div className="h-7 w-40 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-64 rounded-md bg-muted animate-pulse" />
        </div>

        {/* stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>

        {/* tab bar */}
        <div className="flex gap-2 border-b border-border pb-0">
          <div className="h-9 w-28 rounded-t-lg bg-muted animate-pulse" />
          <div className="h-9 w-24 rounded-t-lg bg-muted animate-pulse" />
        </div>

        {/* body rows */}
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[400px] flex flex-col gap-6 p-4 sm:p-6">
      {/* ── page title ──────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-foreground">
          {workspaceName ? `${workspaceName} — Team` : 'Team'}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage members and projects across your workspace.
        </p>
      </div>

      {/* ── stat cards ──────────────────────────────────────────────────── */}
      <StatsCards stats={stats} />

      {/* ── tab switcher ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'relative px-4 py-2.5 text-sm font-medium transition-colors duration-150',
                'border-b-2',
                active
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {tab.label}
              <span
                className={[
                  'ml-1.5 inline-flex items-center justify-center rounded-full text-xs px-1.5 py-0.5',
                  active
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground',
                ].join(' ')}
              >
                {tab.id === 'members' ? members.length : projects.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── tab bodies ───────────────────────────────────────────────────── */}
      {activeTab === 'members' && (
        <MembersTab
          members={members}
          currentUserId={currentUserId}
          canManage={canManageWorkspace}
          onRoleChange={handleWorkspaceRoleChange}
        />
      )}

      {activeTab === 'projects' && (
        <ProjectsTab
          projects={projects}
          projectDetails={projectDetails}
          currentUserId={currentUserId}
          canManage={canManageProjects}
          onProjectMemberRoleChange={handleProjectMemberRoleChange}
        />
      )}
    </div>
  );
}
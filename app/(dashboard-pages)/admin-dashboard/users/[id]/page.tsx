// app/admin-dashboard/users/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, HardDrive, CheckSquare, MessageSquare, Clock, Lightbulb } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAdminUserDetail, useUnbanUser } from '@/hooks/useAdmin';
import { Avatar } from '@/components/Shared/Avatar';
import { LoadingState } from '@/components/AdminDashboard/User/LoadingState';
import { EmptyState } from '@/components/AdminDashboard/User/EmptyState';
import { CopyableId } from '@/components/AdminDashboard/User/CopyableId';
import { StatCard } from '@/components/AdminDashboard/User/StatCard';
import { SectionCard } from '@/components/AdminDashboard/User/SectionCard';
import {
  TASK_STATUS_COLORS,
  FEATURE_STATUS_COLORS,
  PLAN_COLORS,
} from '@/constants/admin.constants';
import { useState } from 'react';
import { BanUserModal } from '@/components/AdminDashboard/User/BanUserModal';

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const { data: user, isLoading } = useAdminUserDetail(id as string);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const { mutate: unban, isPending: unbanning } = useUnbanUser();

  if (isLoading) return <LoadingState />;
  if (!user) return <EmptyState />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/admin-dashboard/users"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <Avatar name={user.name} image={user.image} size="sm" />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border font-semibold uppercase">
              {user.role}
            </span>

{user.bannedAt ? (
  <div className="flex items-center gap-2">
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 font-semibold">
      BANNED
    </span>
    <button
      onClick={() => unban(user.id)}
      disabled={unbanning}
      className="text-[11px] px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
    >
      {unbanning ? 'Unbanning…' : 'Unban'}
    </button>
  </div>
) : (
  <button
    onClick={() => setBanModalOpen(true)}
    className="text-[11px] px-2.5 py-1 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
  >
    Ban User
  </button>
)}

{user.bannedAt && user.banReason && (
  <div className="px-4 py-3 rounded-xl bg-destructive/5 border border-destructive/20">
    <p className="text-[10px] text-destructive uppercase tracking-wide font-semibold mb-1">
      Ban Reason
    </p>
    <p className="text-xs text-foreground/80">{user.banReason}</p>
    <p className="text-[10px] text-muted-foreground mt-1">
      Banned {formatDistanceToNow(new Date(user.bannedAt), { addSuffix: true })}
    </p>
  </div>
)}

          </div>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* User ID */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">User ID:</span>
        <CopyableId id={user.id} />
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-xl border border-border bg-card text-xs">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
            Joined
          </p>
          <p className="font-medium text-foreground">
            {format(new Date(user.createdAt), 'MMM d, yyyy')}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
            Last Login
          </p>
          <p className="font-medium text-foreground">
            {user.lastLoginAt ? format(new Date(user.lastLoginAt), 'MMM d, yyyy') : 'Never'}
          </p>
          {user.lastLoginAt && (
            <p className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true })}
            </p>
          )}
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
            Timezone
          </p>
          <p className="font-medium text-foreground">{user.timezone ?? '—'}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
            Profile Updated
          </p>
          <p className="font-medium text-foreground">
            {user.lastProfileUpdateAt
              ? formatDistanceToNow(new Date(user.lastProfileUpdateAt), { addSuffix: true })
              : '—'}
          </p>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="px-5 py-4 rounded-xl border border-border bg-card">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Bio</p>
          <p className="text-sm text-foreground/85 leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Activity stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={CheckSquare} label="Tasks created" value={user._count.createdTasks} sub={`${user._count.assignedTasks} assigned to them`} />
        <StatCard icon={MessageSquare} label="Comments" value={user._count.comments} />
        <StatCard icon={Clock} label="Focus sessions" value={user._count.focusSessions} />
        <StatCard icon={HardDrive} label="Files uploaded" value={user._count.files} sub={`${user.storage.usedMb.toLocaleString()} MB used`} />
        <StatCard icon={User} label="Workspaces owned" value={user._count.ownedWorkspaces} />
        <StatCard icon={User} label="Member of" value={user._count.workspaceMember} sub="workspaces" />
        <StatCard icon={Lightbulb} label="Feature requests" value={user._count.featureRequests} />
        <StatCard icon={HardDrive} label="Storage" value={`${user.storage.usedMb} MB`} sub={`${user.storage.fileCount} files`} />
      </div>

      {/* Task breakdown */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Task Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Todo', value: user.taskStats.todo, key: 'TODO' },
            { label: 'In Progress', value: user.taskStats.inProgress, key: 'IN_PROGRESS' },
            { label: 'Completed', value: user.taskStats.completed, key: 'COMPLETED' },
            { label: 'Cancelled', value: user.taskStats.cancelled, key: 'CANCELLED' },
          ].map(({ label, value, key }) => (
            <div
              key={key}
              className={cn(
                'p-3 rounded-lg border border-border/50',
                TASK_STATUS_COLORS[key] ?? 'bg-muted text-muted-foreground'
              )}
            >
              <p className="text-xl font-bold tabular-nums">{value}</p>
              <p className="text-[11px] opacity-80">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">{user.taskStats.total} total tasks created</p>
      </div>

      {/* Storage */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-2">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Storage</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          {user.storage.usedMb.toLocaleString()} MB used across {user.storage.fileCount} file
          {user.storage.fileCount !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Owned workspaces */}
        <SectionCard title="Owned Workspaces" count={user.ownedWorkspaces.length}>
          {user.ownedWorkspaces.length === 0 ? (
            <p className="px-5 py-4 text-xs text-muted-foreground">None</p>
          ) : (
            user.ownedWorkspaces.map((w) => (
              <div key={w.id} className="flex items-center justify-between px-5 py-3 gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/admin-dashboard/workspaces/${w.slug}`}
                    className="text-xs font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {w.name}
                  </Link>
                  <p className="text-[10px] text-muted-foreground">
                    {w._count.members} members · {w._count.projects} projects
                  </p>
                </div>
                <span
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase shrink-0',
                    PLAN_COLORS[w.plan] ?? PLAN_COLORS['FREE']
                  )}
                >
                  {w.plan}
                </span>
              </div>
            ))
          )}
        </SectionCard>

        {/* Workspace memberships */}
        <SectionCard title="Member Of" count={user.workspaceMemberships.length}>
          {user.workspaceMemberships.length === 0 ? (
            <p className="px-5 py-4 text-xs text-muted-foreground">None</p>
          ) : (
            user.workspaceMemberships.map((m, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/admin-dashboard/workspaces/${m.workspace.slug}`}
                    className="text-xs font-medium text-foreground hover:text-primary transition-colors truncate block"
                  >
                    {m.workspace.name}
                  </Link>
                  <p className="text-[10px] text-muted-foreground">
                    Joined {formatDistanceToNow(new Date(m.joinedAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border font-medium uppercase">
                    {m.role}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase',
                      PLAN_COLORS[m.workspace.plan] ?? PLAN_COLORS['FREE']
                    )}
                  >
                    {m.workspace.plan}
                  </span>
                </div>
              </div>
            ))
          )}
        </SectionCard>

        {/* Project memberships */}
        <SectionCard title="Project Memberships" count={user.projectMemberships.length}>
          {user.projectMemberships.length === 0 ? (
            <p className="px-5 py-4 text-xs text-muted-foreground">None</p>
          ) : (
            user.projectMemberships.map((m, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{m.project.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {m.project.workspace.name}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border font-medium uppercase">
                    {m.role}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase">
                    {m.project.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </SectionCard>

        {/* Recent tasks */}
        <SectionCard title="Recent Tasks Created" count={user._count.createdTasks}>
          {user.recentTasks.length === 0 ? (
            <p className="px-5 py-4 text-xs text-muted-foreground">None</p>
          ) : (
            user.recentTasks.map((t) => (
              <div key={t.id} className="flex items-start justify-between px-5 py-3 gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{t.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {t.project?.name ?? t.workspace?.name ?? '—'}
                  </p>
                </div>
                <span
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-md font-medium shrink-0',
                    TASK_STATUS_COLORS[t.status] ?? 'text-muted-foreground bg-muted'
                  )}
                >
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            ))
          )}
        </SectionCard>
      </div>

      {/* Feature requests */}
      {user.featureRequests.length > 0 && (
        <SectionCard title="Feature Requests" count={user._count.featureRequests}>
          {user.featureRequests.map((f) => (
            <div key={f.id} className="flex items-center justify-between px-5 py-3 gap-3">
              <div className="min-w-0">
                <p className="text-xs text-foreground truncate">{f.title}</p>
                <p className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(f.createdAt), { addSuffix: true })}
                </p>
              </div>
              <span
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase shrink-0',
                  FEATURE_STATUS_COLORS[f.status] ?? FEATURE_STATUS_COLORS['PENDING']
                )}
              >
                {f.status}
              </span>
            </div>
          ))}
        </SectionCard>
      )}
      <BanUserModal
      userId={user.id}
      userName={user.name}
      isOpen={banModalOpen}
      onClose={() => setBanModalOpen(false)}
      />
    </div>
  );
}
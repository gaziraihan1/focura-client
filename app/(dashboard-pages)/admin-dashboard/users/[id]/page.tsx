'use client';

import { useParams }           from 'next/navigation';
import { ArrowLeft, User, HardDrive, CheckSquare, MessageSquare } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useAdminUserDetail }  from '@/hooks/useAdmin';
import { Avatar }              from '@/components/Shared/Avatar';
import { cn }                  from '@/lib/utils';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  TODO:        'text-muted-foreground',
  IN_PROGRESS: 'text-primary',
  COMPLETED:   'text-emerald-600',
  CANCELLED:   'text-destructive',
};

const FEATURE_STATUS_COLORS: Record<string, string> = {
  PENDING:   'bg-muted text-muted-foreground border-border',
  APPROVED:  'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  REJECTED:  'bg-destructive/10 text-destructive border-destructive/20',
  PLANNED:   'bg-primary/10 text-primary border-primary/20',
  COMPLETED: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
};

function StatCard({ icon: Icon, label, value, sub }: {
  icon: typeof User; label: string; value: React.ReactNode; sub?: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground">{value}</p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground/70">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminUserDetailPage() {
  const { id }  = useParams();
  const { data: user, isLoading } = useAdminUserDetail(id as string);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!user) return <p className="text-sm text-muted-foreground">User not found.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/users"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <Avatar name={user.name} image={user.image} size="sm" />
        <div>
          <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <span className="ml-2 px-2 py-0.5 rounded-full bg-muted border border-border text-[10px] font-semibold uppercase">
          {user.role}
        </span>
      </div>

      {/* Meta */}
      <div className="p-5 rounded-xl border border-border bg-card text-xs text-muted-foreground grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <p className="uppercase tracking-wide text-[10px]">Joined</p>
          <p className="text-foreground font-medium">{format(new Date(user.createdAt), 'MMM d, yyyy')}</p>
        </div>
        <div>
          <p className="uppercase tracking-wide text-[10px]">Last login</p>
          <p className="text-foreground font-medium">
            {user.lastLoginAt
              ? formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true })
              : 'Never'}
          </p>
        </div>
        <div>
          <p className="uppercase tracking-wide text-[10px]">Timezone</p>
          <p className="text-foreground font-medium">{user.timezone ?? '—'}</p>
        </div>
        <div>
          <p className="uppercase tracking-wide text-[10px]">Last profile update</p>
          <p className="text-foreground font-medium">
            {user.lastProfileUpdateAt
              ? formatDistanceToNow(new Date(user.lastProfileUpdateAt), { addSuffix: true })
              : '—'}
          </p>
        </div>
      </div>

      {/* Activity stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={CheckSquare} label="Tasks created"   value={user._count.createdTasks}   sub={`${user._count.assignedTasks} assigned`} />
        <StatCard icon={MessageSquare} label="Comments"      value={user._count.comments} />
        <StatCard icon={User} label="Focus sessions"         value={user._count.focusSessions} />
        <StatCard icon={HardDrive} label="Files uploaded"    value={user._count.files} />
      </div>

      {/* Task breakdown */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Task Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { label: 'Todo',        value: user.taskStats.todo,       color: 'text-muted-foreground' },
            { label: 'In Progress', value: user.taskStats.inProgress, color: 'text-primary' },
            { label: 'Completed',   value: user.taskStats.completed,  color: 'text-emerald-600' },
            { label: 'Cancelled',   value: user.taskStats.cancelled,  color: 'text-destructive' },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-3 rounded-lg bg-muted/40 border border-border/50">
              <p className={cn('text-lg font-bold tabular-nums', color)}>{value}</p>
              <p className="text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Storage */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-2">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Storage Used</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          {user.storage.usedMb.toLocaleString()} MB across {user.storage.fileCount} files
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Owned workspaces */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Owned Workspaces ({user.ownedWorkspaces.length})
            </h2>
          </div>
          <div className="divide-y divide-border/50 max-h-64 overflow-y-auto">
            {user.ownedWorkspaces.length === 0
              ? <p className="px-5 py-4 text-xs text-muted-foreground">None</p>
              : user.ownedWorkspaces.map((w) => (
                  <div key={w.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <Link
                        href={`/admin/workspaces/${w.slug}`}
                        className="text-xs font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {w.name}
                      </Link>
                      <p className="text-[10px] text-muted-foreground">
                        {w._count.members} members · {w._count.projects} projects
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border font-medium uppercase">
                      {w.plan}
                    </span>
                  </div>
                ))}
          </div>
        </div>

        {/* Workspace memberships */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Member Of ({user.workspaceMemberships.length})
            </h2>
          </div>
          <div className="divide-y divide-border/50 max-h-64 overflow-y-auto">
            {user.workspaceMemberships.length === 0
              ? <p className="px-5 py-4 text-xs text-muted-foreground">None</p>
              : user.workspaceMemberships.map((m, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <Link
                        href={`/admin/workspaces/${m.workspace.slug}`}
                        className="text-xs font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {m.workspace.name}
                      </Link>
                      <p className="text-[10px] text-muted-foreground">
                        Joined {formatDistanceToNow(new Date(m.joinedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border font-medium uppercase">
                      {m.role}
                    </span>
                  </div>
                ))}
          </div>
        </div>

        {/* Recent tasks */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Tasks Created</h2>
          </div>
          <div className="divide-y divide-border/50 max-h-64 overflow-y-auto">
            {user.recentTasks.length === 0
              ? <p className="px-5 py-4 text-xs text-muted-foreground">None</p>
              : user.recentTasks.map((t) => (
                  <div key={t.id} className="flex items-start justify-between px-5 py-3 gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{t.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {t.project?.name ?? t.workspace?.name ?? '—'}
                      </p>
                    </div>
                    <span className={cn('text-[10px] shrink-0 font-medium', STATUS_COLORS[t.status])}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
          </div>
        </div>

        {/* Feature requests */}
        {user.featureRequests.length > 0 && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">
                Feature Requests ({user._count.featureRequests})
              </h2>
            </div>
            <div className="divide-y divide-border/50 max-h-64 overflow-y-auto">
              {user.featureRequests.map((f) => (
                <div key={f.id} className="flex items-center justify-between px-5 py-3 gap-3">
                  <p className="text-xs text-foreground truncate">{f.title}</p>
                  <span className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase shrink-0',
                    FEATURE_STATUS_COLORS[f.status],
                  )}>
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Project memberships */}
      {user.projectMemberships.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Project Memberships ({user.projectMemberships.length})
            </h2>
          </div>
          <div className="divide-y divide-border/50 max-h-64 overflow-y-auto">
            {user.projectMemberships.map((m, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{m.project.name}</p>
                  <p className="text-[10px] text-muted-foreground">{m.project.workspace.name}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border font-medium uppercase">
                    {m.role}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase">{m.project.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
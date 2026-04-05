'use client';

import { Users, Building2, FolderOpen, CheckSquare, Megaphone, Lightbulb } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAdminStats } from '@/hooks/useAdmin';
import { Avatar }        from '@/components/Shared/Avatar';
import Link from 'next/link';
import {StatCard} from '@/components/AdminDashboard/StatCard';

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Live stats across all of Focura.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users}       label="Total Users"      value={stats.totals.users}         className="bg-primary/10 text-primary" />
        <StatCard icon={Building2}   label="Workspaces"       value={stats.totals.workspaces}    className="bg-emerald-500/10 text-emerald-600" />
        <StatCard icon={FolderOpen}  label="Projects"         value={stats.totals.projects}      className="bg-violet-500/10 text-violet-600" />
        <StatCard icon={CheckSquare} label="Tasks"            value={stats.totals.tasks}         className="bg-amber-500/10 text-amber-600" />
        <StatCard icon={Megaphone}   label="Announcements"    value={stats.totals.announcements} className="bg-rose-500/10 text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan distribution */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Plan Distribution</h2>
          {stats.plans.map(({ plan, count }) => (
            <div key={plan} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{plan}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.round((count / stats.totals.workspaces) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground tabular-nums w-6 text-right">
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature request stats */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Feature Requests</h2>
          </div>
          {Object.entries(stats.featureRequests).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground capitalize">{status}</span>
              <span className="text-xs font-semibold text-foreground tabular-nums">{count}</span>
            </div>
          ))}
        </div>

        {/* Recent signups */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Recent Signups</h2>
          {stats.recentSignups.map((u) => (
            <div key={u.id} className="flex items-center gap-2.5">
              <Avatar name={u.name} image={u.image} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{u.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">
                {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent workspaces */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Recent Workspaces</h2>
        <div className="divide-y divide-border/50">
          {stats.recentWorkspaces.map((w) => (
            <div key={w.id} className="flex items-center justify-between py-2.5 gap-4">
              <div className="min-w-0">
                <Link
                  href={`/admin-dashboard/workspaces/${w.slug}`}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {w.name}
                </Link>
                <p className="text-[10px] text-muted-foreground">{w.owner.email}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 text-[11px] text-muted-foreground">
                <span>{w._count.members} members</span>
                <span>{w._count.projects} projects</span>
                <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-[10px] font-medium uppercase">
                  {w.plan}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
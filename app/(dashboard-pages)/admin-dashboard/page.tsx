'use client';

import dynamic from 'next/dynamic';
import {
  Users, Building2, FolderOpen, CheckSquare, Megaphone,
  TrendingUp, TrendingDown, Activity, Zap, ArrowUpRight,
} from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdmin';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const AdminCharts = dynamic(
  () => import('@/components/AdminDashboard/AdminCharts').then((m) => m.AdminCharts),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <div className="h-64 rounded-2xl animate-pulse bg-muted" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl animate-pulse bg-muted" />
          ))}
        </div>
      </div>
    ),
  }
);

const VIZ = {
  indigo: '#818cf8', emerald: '#34d399', violet: '#a78bfa',
  orange: '#fb923c', pink: '#f472b6',
} as const;

function GlassStatCard({
  icon: Icon, label, value, trend, accentFrom, accentTo,
}: {
  icon: typeof Users; label: string; value: number;
  trend?: { value: number; up: boolean }; accentFrom: string; accentTo: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 border border-border bg-card/40 backdrop-blur-md">
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-25 blur-2xl pointer-events-none" style={{ background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` }} />
      <div className="flex items-center justify-between">
        <div className="p-2.5 rounded-xl" style={{ background: `${accentFrom}22` }}>
          <Icon className="w-5 h-5" style={{ color: accentFrom }} />
        </div>
        {trend && (
          <span className={cn('flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full', trend.up ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10')}>
            {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen p-6 space-y-6 bg-background">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl animate-pulse bg-muted" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl animate-pulse bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: `radial-gradient(circle, ${VIZ.indigo}, transparent)` }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: `radial-gradient(circle, ${VIZ.emerald}, transparent)` }} />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 rounded-full opacity-[0.08] blur-3xl" style={{ background: `radial-gradient(circle, ${VIZ.orange}, transparent)` }} />
      </div>

      <div className="relative z-10 space-y-6 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">Live</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Platform Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time stats across all of Focura.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card/40 text-xs text-muted-foreground">
            <Activity className="w-3.5 h-3.5" /> Updated just now
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <GlassStatCard icon={Users} label="Total Users" value={stats.totals.users} trend={{ value: 12, up: true }} accentFrom={VIZ.indigo} accentTo="#6366f1" />
          <GlassStatCard icon={Building2} label="Workspaces" value={stats.totals.workspaces} trend={{ value: 8, up: true }} accentFrom={VIZ.emerald} accentTo="#10b981" />
          <GlassStatCard icon={FolderOpen} label="Projects" value={stats.totals.projects} trend={{ value: 5, up: true }} accentFrom={VIZ.violet} accentTo="#8b5cf6" />
          <GlassStatCard icon={CheckSquare} label="Tasks" value={stats.totals.tasks} trend={{ value: 3, up: false }} accentFrom={VIZ.orange} accentTo="#f97316" />
          <GlassStatCard icon={Megaphone} label="Announcements" value={stats.totals.announcements} accentFrom={VIZ.pink} accentTo="#ec4899" />
        </div>

        <AdminCharts />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Manage Users', href: '/admin-dashboard/users', icon: Users, color: VIZ.indigo },
            { label: 'View Workspaces', href: '/admin-dashboard/workspaces', icon: Building2, color: VIZ.emerald },
            { label: 'Check Billing', href: '/admin-dashboard/billing', icon: Zap, color: VIZ.orange },
            { label: 'Activity Log', href: '/admin-dashboard/activity', icon: Activity, color: VIZ.pink },
          ].map(({ label, href, icon: Icon, color }) => (
            <Link key={href} href={href} className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card/30 transition-all hover:border-border/60 hover:bg-accent/30 group">
              <div className="p-2 rounded-lg" style={{ background: `${color}22` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground ml-auto transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

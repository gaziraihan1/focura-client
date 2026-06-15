'use client';

import {
  Users, Building2, FolderOpen, CheckSquare,
  Megaphone, Lightbulb, TrendingUp, TrendingDown,
  ArrowUpRight, Activity, BarChart3, Zap,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAdminStats } from '@/hooks/useAdmin';
import { Avatar } from '@/components/Shared/Avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

// ─── Chart accent palette (data-viz only — not semantic UI) ──────────────────
// These are intentional data-viz colors, not theme colors, so hex is acceptable here.
const VIZ = {
  indigo:  '#818cf8',
  emerald: '#34d399',
  violet:  '#a78bfa',
  orange:  '#fb923c',
  pink:    '#f472b6',
  red:     '#f87171',
} as const;

const PLAN_COLORS  = [VIZ.indigo, VIZ.emerald, VIZ.orange, VIZ.pink] as const;
const TASK_COLORS  = { todo: VIZ.indigo, inProgress: VIZ.orange, completed: VIZ.emerald } as const;

// ─── Mock chart data (replace with real API data) ────────────────────────────
const growthData = [
  { month: 'Jan', users: 120, workspaces: 34, projects: 89 },
  { month: 'Feb', users: 145, workspaces: 41, projects: 104 },
  { month: 'Mar', users: 178, workspaces: 52, projects: 131 },
  { month: 'Apr', users: 203, workspaces: 60, projects: 158 },
  { month: 'May', users: 267, workspaces: 78, projects: 192 },
  { month: 'Jun', users: 312, workspaces: 94, projects: 241 },
  { month: 'Jul', users: 389, workspaces: 112, projects: 298 },
];

const taskActivityData = [
  { day: 'Mon', todo: 24, inProgress: 18, completed: 31 },
  { day: 'Tue', todo: 18, inProgress: 22, completed: 28 },
  { day: 'Wed', todo: 30, inProgress: 15, completed: 42 },
  { day: 'Thu', todo: 22, inProgress: 27, completed: 38 },
  { day: 'Fri', todo: 16, inProgress: 20, completed: 45 },
  { day: 'Sat', todo: 10, inProgress: 8,  completed: 22 },
  { day: 'Sun', todo: 8,  inProgress: 5,  completed: 14 },
];

// ─── Glassmorphism stat card ──────────────────────────────────────────────────
// accentFrom / accentTo are data-viz accent colors, acceptable as hex.
function GlassStatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  accentFrom,
  accentTo,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  sub?: string;
  trend?: { value: number; up: boolean };
  accentFrom: string;
  accentTo: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 border border-border bg-card/40 backdrop-blur-md">
      {/* Soft glow blob — purely decorative, inline gradient acceptable */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-25 blur-2xl pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` }}
      />

      <div className="flex items-center justify-between">
        {/* Icon container uses accent color via inline style since it's data-viz driven */}
        <div
          className="p-2.5 rounded-xl"
          style={{ background: `${accentFrom}22` }}
        >
          <Icon className="w-5 h-5" style={{ color: accentFrom }} />
        </div>

        {trend && (
          <span
            className={cn(
              'flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full',
              trend.up
                ? 'text-emerald-400 bg-emerald-400/10'
                : 'text-red-400 bg-red-400/10',
            )}
          >
            {trend.up
              ? <TrendingUp className="w-3 h-3" />
              : <TrendingDown className="w-3 h-3" />}
            {trend.value}%
          </span>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
          {value.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Glass panel wrapper ──────────────────────────────────────────────────────
function GlassPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card/40 backdrop-blur-md p-5', className)}>
      {children}
    </div>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-semibold text-foreground">{children}</h2>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Custom recharts tooltip ──────────────────────────────────────────────────
function GlassTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ dataKey: string; color: string; value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover/90 backdrop-blur-md px-3 py-2 text-xs space-y-1">
      <p className="text-muted-foreground font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.dataKey}:</span>
          <span className="text-foreground font-semibold">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Plan badge ───────────────────────────────────────────────────────────────
function PlanBadge({ plan }: { plan: string }) {
  const isPro = plan === 'PRO';
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border',
        isPro
          ? 'bg-primary/10 text-primary border-primary/30'
          : 'bg-muted text-muted-foreground border-border',
      )}
    >
      {plan}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
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

  const pieData = stats.plans.map(({ plan, count }: { plan: string; count: number }, i: number) => ({
    name: plan,
    value: count,
    color: PLAN_COLORS[i % PLAN_COLORS.length],
  }));

  const frTotal = Object.values(stats.featureRequests).reduce((a: number, b) => a + (b as number), 0);
  const frRadial = [
    { name: 'Completed', value: stats.featureRequests.completed, fill: VIZ.emerald },
    { name: 'Planned',   value: stats.featureRequests.planned,   fill: VIZ.indigo  },
    { name: 'Approved',  value: stats.featureRequests.approved,  fill: VIZ.orange  },
    { name: 'Pending',   value: stats.featureRequests.pending,   fill: VIZ.pink    },
    { name: 'Rejected',  value: stats.featureRequests.rejected,  fill: VIZ.red     },
  ].map((d) => ({
    ...d,
    value: frTotal ? Math.round((d.value / frTotal) * 100) : 0,
  }));

  // Shared recharts axis tick style — uses CSS var so it inherits theme
  const axisTick = { fill: 'var(--color-muted-foreground)', fontSize: 11 } as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background orbs — decorative only */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: `radial-gradient(circle, ${VIZ.indigo}, transparent)` }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: `radial-gradient(circle, ${VIZ.emerald}, transparent)` }}
        />
        <div
          className="absolute top-2/3 left-1/2 w-64 h-64 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: `radial-gradient(circle, ${VIZ.orange}, transparent)` }}
        />
      </div>

      <div className="relative z-10 space-y-6 p-6">

        {/* ── Page header ──────────────────────────────────────── */}
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
            <Activity className="w-3.5 h-3.5" />
            Updated just now
          </div>
        </div>

        {/* ── Stat cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <GlassStatCard icon={Users}       label="Total Users"   value={stats.totals.users}         trend={{ value: 12, up: true }}  accentFrom={VIZ.indigo}  accentTo="#6366f1" />
          <GlassStatCard icon={Building2}   label="Workspaces"    value={stats.totals.workspaces}    trend={{ value: 8,  up: true }}  accentFrom={VIZ.emerald} accentTo="#10b981" />
          <GlassStatCard icon={FolderOpen}  label="Projects"      value={stats.totals.projects}      trend={{ value: 5,  up: true }}  accentFrom={VIZ.violet}  accentTo="#8b5cf6" />
          <GlassStatCard icon={CheckSquare} label="Tasks"         value={stats.totals.tasks}         trend={{ value: 3,  up: false }} accentFrom={VIZ.orange}  accentTo="#f97316" />
          <GlassStatCard icon={Megaphone}   label="Announcements" value={stats.totals.announcements}                                  accentFrom={VIZ.pink}    accentTo="#ec4899" />
        </div>

        {/* ── Growth area chart ─────────────────────────────────── */}
        <GlassPanel>
          <SectionTitle sub="Jan – Jul 2025">Platform Growth</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growthData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={VIZ.indigo}  stopOpacity={0.4} />
                  <stop offset="100%" stopColor={VIZ.indigo}  stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="gradWs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={VIZ.emerald} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={VIZ.emerald} stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gradProj" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={VIZ.orange}  stopOpacity={0.3} />
                  <stop offset="100%" stopColor={VIZ.orange}  stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis                  tick={axisTick} axisLine={false} tickLine={false} />
              <Tooltip content={<GlassTooltip />} />
              <Legend
                iconType="circle"
                iconSize={7}
                formatter={(v) => (
                  <span style={{ color: 'var(--color-muted-foreground)', fontSize: 11 }}>{v}</span>
                )}
              />
              <Area type="monotone" dataKey="users"      name="Users"      stroke={VIZ.indigo}  strokeWidth={2} fill="url(#gradUsers)" dot={false} activeDot={{ r: 4, fill: VIZ.indigo  }} />
              <Area type="monotone" dataKey="workspaces" name="Workspaces" stroke={VIZ.emerald} strokeWidth={2} fill="url(#gradWs)"    dot={false} activeDot={{ r: 4, fill: VIZ.emerald }} />
              <Area type="monotone" dataKey="projects"   name="Projects"   stroke={VIZ.orange}  strokeWidth={2} fill="url(#gradProj)"  dot={false} activeDot={{ r: 4, fill: VIZ.orange  }} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassPanel>

        {/* ── Middle row: plan pie + feature radial + task bar ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Plan distribution */}
          <GlassPanel>
            <SectionTitle sub="By workspace count">Plan Distribution</SectionTitle>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry: { color: string }, i: number) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as { name: string; value: number };
                    return (
                      <div className="rounded-xl border border-border bg-popover/90 backdrop-blur-md px-3 py-1.5 text-xs">
                        <span className="text-muted-foreground capitalize">{d.name}: </span>
                        <span className="text-foreground font-semibold">{d.value}</span>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1">
              {pieData.map(({ name, value, color }: { name: string; value: number; color: string }) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">{name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1 rounded-full overflow-hidden bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.round((value / stats.totals.workspaces) * 100)}%`,
                          background: color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground tabular-nums w-5 text-right">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Feature requests */}
          <GlassPanel>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">Feature Requests</h2>
                <p className="text-[11px] text-muted-foreground">{frTotal} total</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <RadialBarChart cx="50%" cy="50%" innerRadius={20} outerRadius={72} data={frRadial} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={4} background={{ fill: 'var(--color-muted)' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as { name: string; value: number };
                    return (
                      <div className="rounded-xl border border-border bg-popover/90 backdrop-blur-md px-3 py-1.5 text-xs">
                        <span className="text-muted-foreground">{d.name}: </span>
                        <span className="text-foreground font-semibold">{d.value}%</span>
                      </div>
                    );
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
              {frRadial.map(({ name, value, fill }) => (
                <div key={name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: fill }} />
                  <span className="text-[11px] text-muted-foreground capitalize truncate">{name}</span>
                  <span className="text-[11px] font-semibold text-foreground ml-auto">{value}%</span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Weekly task activity */}
          <GlassPanel>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-primary" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">Task Activity</h2>
                <p className="text-[11px] text-muted-foreground">This week</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={taskActivityData} margin={{ top: 0, right: 0, bottom: 0, left: -28 }} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" tick={{ ...axisTick, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis                tick={{ ...axisTick, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<GlassTooltip />} />
                <Bar dataKey="todo"       name="Todo"        stackId="a" fill={TASK_COLORS.todo}       radius={[0, 0, 0, 0]} />
                <Bar dataKey="inProgress" name="In Progress" stackId="a" fill={TASK_COLORS.inProgress} radius={[0, 0, 0, 0]} />
                <Bar dataKey="completed"  name="Completed"   stackId="a" fill={TASK_COLORS.completed}  radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassPanel>
        </div>

        {/* ── Bottom row: recent signups + recent workspaces ────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Recent signups */}
          <GlassPanel className="lg:col-span-2">
            <SectionTitle sub="Newest members">Recent Signups</SectionTitle>
            <div className="space-y-3">
              {stats.recentSignups.map((u: { id: string; name: string; image: string | null; email: string; createdAt: string }) => (
                <div key={u.id} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-accent/50">
                  <Avatar name={u.name} image={u.image} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 shrink-0">
                    {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Recent workspaces */}
          <GlassPanel className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Recent Workspaces</h2>
                <p className="text-[11px] text-muted-foreground">Latest created</p>
              </div>
              <Link
                href="/admin-dashboard/workspaces"
                className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors"
              >
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {stats.recentWorkspaces.map((w: {
                id: string;
                name: string;
                slug: string;
                plan: string;
                owner: { email: string };
                _count: { members: number; projects: number };
              }) => (
                <div key={w.id} className="flex items-center justify-between py-2.5 gap-4">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin-dashboard/workspaces/${w.slug}`}
                      className="text-sm font-medium text-foreground/90 hover:text-foreground transition-colors"
                    >
                      {w.name}
                    </Link>
                    <p className="text-[10px] text-muted-foreground/60">{w.owner.email}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {w._count.members}
                    </div>
                    <div className="flex items-center gap-1">
                      <FolderOpen className="w-3 h-3" />
                      {w._count.projects}
                    </div>
                    <PlanBadge plan={w.plan} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* ── Quick actions strip ───────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Manage Users',    href: '/admin-dashboard/users',      icon: Users,     color: VIZ.indigo  },
            { label: 'View Workspaces', href: '/admin-dashboard/workspaces', icon: Building2, color: VIZ.emerald },
            { label: 'Check Billing',   href: '/admin-dashboard/billing',    icon: Zap,       color: VIZ.orange  },
            { label: 'Activity Log',    href: '/admin-dashboard/activity',   icon: Activity,  color: VIZ.pink    },
          ].map(({ label, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card/30 transition-all hover:border-border/60 hover:bg-accent/30 group"
            >
              {/* Icon accent bg — data-viz color, inline acceptable */}
              <div className="p-2 rounded-lg" style={{ background: `${color}22` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {label}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground ml-auto transition-colors" />
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
'use client';

import { formatDistanceToNow } from 'date-fns';
import { useAdminStats } from '@/hooks/useAdmin';
import { Avatar } from '@/components/shared/Avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Users, FolderOpen, Lightbulb,
  ArrowUpRight, BarChart3,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList,
// oxlint-disable-next-line react-doctor/prefer-dynamic-import -- recharts only ships when this chart mounts
} from 'recharts';

const VIZ = {
  indigo: '#818cf8', emerald: '#34d399', violet: '#a78bfa',
  orange: '#fb923c', pink: '#f472b6', red: '#f87171',
} as const;

const PLAN_COLORS = [VIZ.indigo, VIZ.emerald, VIZ.orange, VIZ.pink] as const;
const TASK_COLORS = { todo: VIZ.indigo, inProgress: VIZ.orange, completed: VIZ.emerald } as const;



function GlassTooltip({ active, payload, label }: {
  active?: boolean; payload?: Array<{ dataKey: string; color: string; value: number }>; label?: string;
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

  const axisTick = { fill: 'var(--color-muted-foreground)', fontSize: 11 } as const;

/**
 * Small value label rendered directly on chart points.
 * Returns null for 0 so empty months stay clean.
 */
function ChartLabel({ x, y, value, dy = -2 }: { x?: number; y?: number; value?: unknown; dy?: number }) {
  if (typeof value !== 'number' || value === 0) return null;
  return (
    <text x={x} y={(y ?? 0) + dy} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--color-muted-foreground)">
      {value}
    </text>
  );
}

  /** "Jan - Jul" style label for the last-7-months series (falls back when empty). */
  const monthRangeLabel = (data: { label: string }[]) =>
    data.length ? `${data[0].label} - ${data[data.length - 1].label}` : 'Last 7 months';
export function AdminCharts() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading || !stats) {
    return (
      <div className="space-y-4">
        <div className="h-64 rounded-2xl animate-pulse bg-muted" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl animate-pulse bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const pieData = stats.plans.map(({ plan, count }: { plan: string; count: number }, i: number) => ({
    name: plan, value: count, color: PLAN_COLORS[i % PLAN_COLORS.length],
  }));

  const frTotal = Object.values(stats.featureRequests).reduce((a: number, b) => a + (b as number), 0);
  const frRadial = [
    { name: 'Completed', value: stats.featureRequests.completed, fill: VIZ.emerald },
    { name: 'Planned', value: stats.featureRequests.planned, fill: VIZ.indigo },
    { name: 'Approved', value: stats.featureRequests.approved, fill: VIZ.orange },
    { name: 'Pending', value: stats.featureRequests.pending, fill: VIZ.pink },
    { name: 'Rejected', value: stats.featureRequests.rejected, fill: VIZ.red },
  ].map((d) => ({ ...d, value: frTotal ? Math.round((d.value / frTotal) * 100) : 0 }));

  const growthData = stats.growth ?? [];
  const taskActivityData = stats.taskActivity ?? [];
  const growthByPlanData = stats.growthByPlan ?? [];

  return (
    <>
      {/* Growth area chart */}
      <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-md p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground">Platform Growth</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">{monthRangeLabel(growthData)}</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={growthData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={VIZ.indigo} stopOpacity={0.4} />
                <stop offset="100%" stopColor={VIZ.indigo} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradWs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={VIZ.emerald} stopOpacity={0.35} />
                <stop offset="100%" stopColor={VIZ.emerald} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradProj" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={VIZ.orange} stopOpacity={0.3} />
                <stop offset="100%" stopColor={VIZ.orange} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip content={<GlassTooltip />} cursor={false} />
            <Legend iconType="circle" iconSize={7} formatter={(v) => <span style={{ color: 'var(--color-muted-foreground)', fontSize: 11 }}>{v}</span>} />
            {/* Value labels on each point (zeros hidden by ChartLabel); staggered dy keeps the three series apart */}
            <Area type="monotone" dataKey="users" name="Users" stroke={VIZ.indigo} strokeWidth={2} fill="url(#gradUsers)" dot={false} activeDot={{ r: 4, fill: VIZ.indigo }}>
              <LabelList dataKey="users" content={<ChartLabel dy={-2} />} />
            </Area>
            <Area type="monotone" dataKey="workspaces" name="Workspaces" stroke={VIZ.emerald} strokeWidth={2} fill="url(#gradWs)" dot={false} activeDot={{ r: 4, fill: VIZ.emerald }}>
              <LabelList dataKey="workspaces" content={<ChartLabel dy={-16} />} />
            </Area>
            <Area type="monotone" dataKey="projects" name="Projects" stroke={VIZ.orange} strokeWidth={2} fill="url(#gradProj)" dot={false} activeDot={{ r: 4, fill: VIZ.orange }}>
              <LabelList dataKey="projects" content={<ChartLabel dy={-30} />} />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Growth by plan — stacked workspaces-per-plan per month */}
      <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-md p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground">Growth by Plan</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">{monthRangeLabel(growthByPlanData)}</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={growthByPlanData} margin={{ top: 0, right: 4, bottom: 0, left: -20 }} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip content={<GlassTooltip />} cursor={false} />
            <Legend iconType="circle" iconSize={7} formatter={(v) => <span style={{ color: 'var(--color-muted-foreground)', fontSize: 11 }}>{v}</span>} />
            <Bar dataKey="FREE" name="Free" stackId="plan" fill={PLAN_COLORS[0]} radius={[0, 0, 0, 0]} />
            <Bar dataKey="PRO" name="Pro" stackId="plan" fill={PLAN_COLORS[1]} radius={[0, 0, 0, 0]} />
            <Bar dataKey="BUSINESS" name="Business" stackId="plan" fill={PLAN_COLORS[2]} radius={[0, 0, 0, 0]} />
            <Bar dataKey="ENTERPRISE" name="Enterprise" stackId="plan" fill={PLAN_COLORS[3]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Middle row: plan pie + feature radial + task bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-md p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground">Plan Distribution</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">By workspace count</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={68} paddingAngle={3} dataKey="value">
                {pieData.map((entry: { name: string; color: string }) => (
                  <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as { name: string; value: number };
                return <div className="rounded-xl border border-border bg-popover/90 backdrop-blur-md px-3 py-1.5 text-xs"><span className="text-muted-foreground capitalize">{d.name}: </span><span className="text-foreground font-semibold">{d.value}</span></div>;
              }} />
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
                    <div className="h-full rounded-full" style={{ width: `${Math.round((value / stats.totals.workspaces) * 100)}%`, background: color }} />
                  </div>
                  <span className="text-xs font-semibold text-foreground tabular-nums w-5 text-right">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-md p-5">
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
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as { name: string; value: number };
                return <div className="rounded-xl border border-border bg-popover/90 backdrop-blur-md px-3 py-1.5 text-xs"><span className="text-muted-foreground">{d.name}: </span><span className="text-foreground font-semibold">{d.value}%</span></div>;
              }} />
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
        </div>

        <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-md p-5">
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
              <XAxis dataKey="label" tick={{ ...axisTick, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ ...axisTick, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<GlassTooltip />} cursor={false} />
              <Bar dataKey="todo" name="Todo" stackId="a" fill={TASK_COLORS.todo} radius={[0, 0, 0, 0]} />
              <Bar dataKey="inProgress" name="In Progress" stackId="a" fill={TASK_COLORS.inProgress} radius={[0, 0, 0, 0]} />
              <Bar dataKey="completed" name="Completed" stackId="a" fill={TASK_COLORS.completed} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row: recent signups + recent workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-md p-5 lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground">Recent Signups</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">Newest members</p>
          </div>
          <div className="space-y-3">
            {stats.recentSignups.map((u: { id: string; name: string; image: string | null; email: string; createdAt: string }) => (
              <div key={u.id} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-accent/50">
                <Avatar name={u.name} image={u.image} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{u.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                </div>
                <span className="text-[10px] text-muted-foreground/60 shrink-0">{formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-md p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Recent Workspaces</h2>
              <p className="text-[11px] text-muted-foreground">Latest created</p>
            </div>
            <Link href="/admin-dashboard/workspaces" className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {stats.recentWorkspaces.map((w: { id: string; name: string; slug: string; plan: string; owner: { email: string }; _count: { members: number; projects: number } }) => (
              <div key={w.id} className="flex items-center justify-between py-2.5 gap-4">
                <div className="min-w-0 flex-1">
                  <Link href={`/admin-dashboard/workspaces/${w.slug}`} className="text-sm font-medium text-foreground/90 hover:text-foreground transition-colors">{w.name}</Link>
                  <p className="text-[10px] text-muted-foreground/60">{w.owner.email}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" />{w._count.members}</div>
                  <div className="flex items-center gap-1"><FolderOpen className="w-3 h-3" />{w._count.projects}</div>
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border', w.plan === 'PRO' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted text-muted-foreground border-border')}>{w.plan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

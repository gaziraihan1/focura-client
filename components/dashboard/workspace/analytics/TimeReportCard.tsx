'use client';

import { useMemo, useState } from "react";
import {
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
  Users,
  ListTodo,
  PieChart,
  Briefcase,
  Timer,
  Folder,
} from "lucide-react";
import {
  useTimeReport,
  type TimeTrackingReportRow,
} from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/Button";

interface TimeReportCardProps {
  workspaceId: string;
}

const RANGES = [7, 14, 30, 90];

const CATEGORY_META: Record<string, { label: string; className: string }> = {
  DEEP_WORK: { label: "Deep Work", className: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400" },
  MEETINGS:  { label: "Meetings",  className: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400" },
  ADMIN:     { label: "Admin",     className: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400" },
  LEARNING:  { label: "Learning",  className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" },
  BREAK:     { label: "Break",     className: "bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400" },
  OTHER:     { label: "Other",     className: "bg-neutral-500/10 border-neutral-500/20 text-neutral-600 dark:text-neutral-400" },
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Bar width for rollup rows — relative to the largest row in that section. */
function barWidth(minutes: number, maxMinutes: number): string {
  if (maxMinutes <= 0) return "0%";
  return `${Math.max(4, Math.min(100, (minutes / maxMinutes) * 100))}%`;
}

function RowTable({
  icon: Icon,
  title,
  rows,
  unit,
}: {
  icon: React.ElementType;
  title: string;
  rows: TimeTrackingReportRow[];
  unit: "member" | "task" | "project";
}) {
  const maxMinutes = Math.max(...rows.map((r) => r.minutes), 0);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-sm font-semibold">{title}</h4>
        <span className="text-xs text-muted-foreground ml-auto">{rows.length}</span>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground px-4 py-6 text-center">
            No time logged in this period
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row) => (
              <li key={row.id} className="px-4 py-3">
                <div className="flex items-center gap-3 mb-1.5">
                  {unit === "member" ? (
                    <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary shrink-0">
                      {initials(row.name)}
                    </span>
                  ) : unit === "project" ? (
                    <Folder className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ListTodo className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <span className="text-sm font-medium truncate min-w-0 flex-1">{row.name}</span>
                  <span className="text-sm font-bold tabular-nums shrink-0">
                    {formatDuration(row.minutes)}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: barWidth(row.minutes, maxMinutes) }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function TimeReportCard({ workspaceId }: TimeReportCardProps) {
  const [days, setDays] = useState(7);
  const { data, isLoading, isError, refetch } = useTimeReport(workspaceId, days);

  const billableMinutes = useMemo(
    () =>
      data?.entries
        .filter((e) => e.billable)
        .reduce((sum, e) => sum + e.duration, 0) ?? 0,
    [data]
  );

  const avgMinutesPerEntry =
    data && data.entryCount > 0 ? data.totalMinutes / data.entryCount : 0;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading time report…</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-muted-foreground flex-1">
            Failed to load the time report. Please try again.
          </p>
          <Button
            variant="ghost"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const maxCategoryMinutes = Math.max(...data.byCategory.map((c) => c.minutes), 0);

  return (
    <div className="space-y-5">
      {/* Header + range selector */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Time Report
            </h2>
            <p className="text-sm text-muted-foreground">
              All time logged across the workspace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-card">
          {RANGES.map((r) => (
            <Button
              key={r}
              type="button"
              variant="primary"
              onClick={() => setDays(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                days === r
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {r}d
            </Button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5" /> Total Hours
          </p>
          <p className="text-2xl font-bold tabular-nums">{data.totalHours.toFixed(1)}h</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <ListTodo className="w-3.5 h-3.5" /> Entries
          </p>
          <p className="text-2xl font-bold tabular-nums">{data.entryCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> Billable
          </p>
          <p className="text-2xl font-bold tabular-nums">
            {(billableMinutes / 60).toFixed(1)}h
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Avg / Entry
          </p>
          <p className="text-2xl font-bold tabular-nums">
            {formatDuration(Math.round(avgMinutesPerEntry))}
          </p>
        </div>
      </div>

      {/* Project + member + task rollups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <RowTable icon={Folder} title="By Project" rows={data.byProject} unit="project" />
        <RowTable icon={Users} title="By Member" rows={data.byMember} unit="member" />
        <RowTable icon={ListTodo} title="By Task" rows={data.byTask} unit="task" />
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <PieChart className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold">By Category</h4>
        </div>
        {data.byCategory.length === 0 ? (
          <p className="text-sm text-muted-foreground px-4 py-6 text-center">
            No time logged in this period
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
            {data.byCategory.map((c) => (
              <div key={c.category} className="p-3 rounded-xl bg-muted/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full border">
                    {CATEGORY_META[c.category]?.label ?? c.category}
                  </span>
                  <span className="text-xs font-bold tabular-nums">
                    {formatDuration(c.minutes)}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: barWidth(c.minutes, maxCategoryMinutes) }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent entries */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold">Recent Entries</h4>
          <span className="text-xs text-muted-foreground ml-auto">
            {data.entries.length} shown
          </span>
        </div>
        {data.entries.length === 0 ? (
          <p className="text-sm text-muted-foreground px-4 py-6 text-center">
            No time logged in this period
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 font-medium whitespace-nowrap">Date</th>
                  <th className="px-3 py-2.5 font-medium whitespace-nowrap">Task</th>
                  <th className="px-3 py-2.5 font-medium whitespace-nowrap">Project</th>
                  <th className="px-3 py-2.5 font-medium whitespace-nowrap">Member</th>
                  <th className="px-3 py-2.5 font-medium whitespace-nowrap">Category</th>
                  <th className="px-3 py-2.5 font-medium whitespace-nowrap">Billable</th>
                  <th className="px-4 py-2.5 font-medium whitespace-nowrap text-right">Duration</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground">
                      {formatDate(entry.startedAt)}
                    </td>
                    <td className="px-3 py-2.5 min-w-40">
                      <p className="truncate max-w-48" title={entry.taskTitle ?? ""}>
                        {entry.taskTitle ?? "Unknown task"}
                      </p>
                      {entry.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-48">
                          {entry.description}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {entry.projectName ?? <span className="text-muted-foreground/60">—</span>}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {entry.userName ?? entry.userEmail ?? "Unknown"}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                          CATEGORY_META[entry.category]?.className ?? CATEGORY_META.OTHER.className
                        }`}
                      >
                        {CATEGORY_META[entry.category]?.label ?? entry.category}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {entry.billable ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <Briefcase className="w-2.5 h-2.5" />
                          Billable
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-right font-bold tabular-nums">
                      {formatDuration(entry.duration)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

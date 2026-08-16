"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, CalendarDays, Clock, Folder, X } from "lucide-react";
import { useMyTimeEntries } from "@/hooks/useTimeEntries";
import { TIME_ENTRY_CATEGORY_META } from "@/constants/timeEntry.constants";

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Local YYYY-MM-DD → ISO datetime. endOfDay makes the "to" bound inclusive.
function dateInputToIso(value: string, endOfDay: boolean): string | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function TimeLogView() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fromIso = useMemo(() => dateInputToIso(from, false), [from]);
  const toIso = useMemo(() => dateInputToIso(to, true), [to]);

  const { data: entries = [], isLoading } = useMyTimeEntries(fromIso, toIso);

  const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0);
  const hasFilters = from !== "" || to !== "";

  const clearFilters = () => {
    setFrom("");
    setTo("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold">My Time Entries</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every entry logged across all your tasks.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm shrink-0">
          <span className="text-muted-foreground">Total</span>
          <span className="font-bold tabular-nums text-lg">
            {formatDuration(totalMinutes)}
          </span>
        </div>
      </div>

      {/* Date range filter */}
      <div className="rounded-xl border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1 sm:flex-none">
            <label className="text-xs text-muted-foreground mb-1 block">From</label>
            <input
              type="date"
              aria-label="From date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="min-w-0 flex-1 sm:flex-none">
            <label className="text-xs text-muted-foreground mb-1 block">To</label>
            <input
              type="date"
              aria-label="To date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Entries list */}
      {isLoading ? (
        <div className="text-sm text-muted-foreground py-12 text-center">
          Loading your time entries…
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl">
          <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm text-muted-foreground">
            {hasFilters
              ? "No time entries found for this range"
              : "No time entries yet — log time from any task"}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => {
            const categoryMeta = TIME_ENTRY_CATEGORY_META[entry.category];
            return (
              <li
                key={entry.id}
                className="flex items-start gap-3 p-4 rounded-xl border bg-card"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/dashboard/tasks/${entry.taskId}`}
                      className="text-sm font-medium hover:text-primary transition-colors truncate"
                    >
                      {entry.task?.title ?? "Task"}
                    </Link>
                    {categoryMeta && (
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${categoryMeta.className}`}
                      >
                        {categoryMeta.label}
                      </span>
                    )}
                    {entry.billable && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        <Briefcase className="w-2.5 h-2.5" />
                        Billable
                      </span>
                    )}
                  </div>

                  {entry.task?.project?.name && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                      <Folder className="w-3 h-3 shrink-0" />
                      <span className="truncate">{entry.task.project.name}</span>
                    </p>
                  )}

                  {entry.description && (
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                      {entry.description}
                    </p>
                  )}

                  <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                    <CalendarDays className="w-3 h-3 shrink-0" />
                    {formatDate(entry.startedAt)}
                  </p>
                </div>

                <span className="text-sm font-bold tabular-nums shrink-0">
                  {formatDuration(entry.duration)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

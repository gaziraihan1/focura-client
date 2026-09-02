"use client";

// components/Dashboard/Workspaces/project/Tasks/ProjectTasksTimeline.tsx
// Gantt-style project timeline: tasks render as horizontal bars on a date
// axis spanning start → due date, colored by status. Tasks without dates are
// collected in an "Unscheduled" tray below the grid. Clicking a bar opens the
// task details modal.

import { useMemo, useState } from "react";
import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { CalendarRange, Inbox, Loader2 } from "lucide-react";
import { Task } from "@/hooks/useTask";
import { TaskDetailsModal } from "@/components/dashboard/calendar/calendar-view/TaskDetailsModal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ProjectTasksTimelineProps {
  tasks: Task[];
  isLoading: boolean;
}

const STATUS_BAR: Record<Task["status"], string> = {
  TODO: "bg-slate-400",
  IN_PROGRESS: "bg-blue-500",
  IN_REVIEW: "bg-amber-500",
  BLOCKED: "bg-red-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-muted-foreground/40",
};

const STATUS_LABEL: Record<Task["status"], string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  BLOCKED: "Blocked",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const DAY_W = 30; // px per day column

interface Bar {
  task: Task;
  left: number; // days from window start
  width: number; // days spanned
}

function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const d = parseISO(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function ProjectTasksTimeline({ tasks, isLoading }: ProjectTasksTimelineProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // ── Window: from the earliest start to the latest due (padded a week each
  // side, aligned to month boundaries). Falls back to the current month.
  const window = useMemo(() => {
    const dates = tasks.flatMap((t) => [toDate(t.startDate), toDate(t.dueDate)]).filter((d): d is Date => !!d);
    if (dates.length === 0) {
      const now = startOfDay(new Date());
      return { start: startOfMonth(now), end: endOfMonth(now) };
    }
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    return {
      start: startOfMonth(addDays(min, -7)),
      end: endOfMonth(addDays(max, 7)),
    };
  }, [tasks]);

  const days = useMemo(
    () => eachDayOfInterval({ start: window.start, end: window.end }),
    [window.start, window.end],
  );

  // Month bands for the header ruler.
  const monthBands = useMemo(() => {
    const bands: Array<{ label: string; startIdx: number; count: number }> = [];
    days.forEach((day, idx) => {
      const last = bands[bands.length - 1];
      if (!last || !isSameMonth(day, days[last.startIdx])) {
        bands.push({ label: format(day, "MMM yyyy"), startIdx: idx, count: 1 });
      } else {
        last.count += 1;
      }
    });
    return bands;
  }, [days]);

  const bars = useMemo<Bar[]>(() => {
    const total = days.length;
    const out: Bar[] = [];
    for (const task of tasks) {
      const start = toDate(task.startDate) ?? toDate(task.dueDate);
      const end = toDate(task.dueDate) ?? toDate(task.startDate);
      if (!start && !end) continue; // unscheduled → tray
      const s = start ?? end!;
      const e = end ?? s;
      const left = Math.max(differenceInCalendarDays(s, window.start), 0);
      const right = Math.min(differenceInCalendarDays(e, window.start), total - 1);
      if (right < 0 || left >= total) continue;
      out.push({ task, left, width: Math.max(right - left + 1, 1) });
    }
    return out.sort((a, b) => a.left - b.left || a.task.title.localeCompare(b.task.title));
  }, [tasks, days, window.start]);

  const unscheduled = useMemo(
    () => tasks.filter((t) => !toDate(t.startDate) && !toDate(t.dueDate)),
    [tasks],
  );

  const today = startOfDay(new Date());
  const todayLeft = differenceInCalendarDays(today, window.start);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <CalendarRange className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Project Timeline</h3>
          <span className="hidden sm:inline text-xs text-muted-foreground">
            {bars.length} scheduled · {unscheduled.length} unscheduled
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[11px] text-muted-foreground">
          {(Object.keys(STATUS_LABEL) as Task["status"][]).map((s) => (
            <span key={s} className="flex items-center gap-1">
              <span className={cn("size-2 rounded-full", STATUS_BAR[s])} />
              {STATUS_LABEL[s]}
            </span>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading timeline…
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-max">
            {/* Ruler */}
            <div className="relative border-b border-border bg-card">
              <div className="flex">
                {monthBands.map((band) => (
                  <div
                    key={band.label}
                    className="border-r border-border/50 px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider"
                    style={{ width: band.count * DAY_W }}
                  >
                    {band.label}
                  </div>
                ))}
              </div>
              <div className="flex">
                {days.map((day) => (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "flex h-6 items-start justify-center border-r border-border/30 pt-0.5 text-[9px]",
                      isSameDay(day, today) ? "font-bold text-primary" : "text-muted-foreground",
                    )}
                    style={{ width: DAY_W }}
                  >
                    {format(day, "d")}
                  </div>
                ))}
              </div>
              {todayLeft >= 0 && todayLeft < days.length && (
                <div className="absolute inset-y-0 w-px bg-primary/60" style={{ left: todayLeft * DAY_W }} />
              )}
            </div>

            {/* Bars */}
            <div className="relative">
              {todayLeft >= 0 && todayLeft < days.length && (
                <div
                  className="pointer-events-none absolute inset-y-0 w-px bg-primary/15"
                  style={{ left: todayLeft * DAY_W }}
                />
              )}
              <div className="divide-y divide-border/40">
                {bars.map(({ task, left, width }) => {
                  const startLabel = task.startDate ? format(parseISO(task.startDate), "MMM d") : null;
                  const endLabel = task.dueDate ? format(parseISO(task.dueDate), "MMM d") : null;
                  return (
                    <div key={task.id} className="relative flex items-center py-2">
                      <div
                        className="group flex items-center overflow-hidden rounded-md shadow-sm transition-transform hover:brightness-105"
                        style={{
                          marginLeft: left * DAY_W,
                          width: Math.max(width * DAY_W - 4, 14),
                        }}
                      >
                        <Button
                          variant="primary"
                          onClick={() => setSelectedTask(task)}
                          className={cn(
                            "flex h-6 w-full items-center gap-1.5 truncate rounded-md px-2 text-left text-[10px] font-medium text-white transition-opacity hover:opacity-90",
                            STATUS_BAR[task.status],
                          )}
                          title={`${task.title}${endLabel ? ` · due ${endLabel}` : ""}`}
                        >
                          <span className="truncate">{task.title}</span>
                        </Button>
                      </div>
                      <span className="ml-2 whitespace-nowrap text-[10px] text-muted-foreground">
                        {startLabel || "—"} → {endLabel || "—"}
                      </span>
                    </div>
                  );
                })}
                {bars.length === 0 && (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    No dated tasks yet — schedule a start or due date to see it on the timeline.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unscheduled tray */}
      {unscheduled.length > 0 && (
        <div className="border-t border-border bg-muted/20 px-4 py-3">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <Inbox className="size-3.5" /> Unscheduled ({unscheduled.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {unscheduled.map((task) => (
              <Button
                key={task.id}
                variant="outline"
                onClick={() => setSelectedTask(task)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span className={cn("size-1.5 rounded-full", STATUS_BAR[task.status])} />
                {task.title}
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedTask && <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
}

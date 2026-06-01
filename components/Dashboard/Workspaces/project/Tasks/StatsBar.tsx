import { useMemo } from "react";
import { COLUMNS } from "./ListRow";
import { cn } from "@/lib/utils";
import { Task } from "@/hooks/useTask";

export function StatsBar({ tasks }: { tasks: Task[] }) {
  const counts = useMemo(() => {
    const map = { TODO: 0, IN_PROGRESS: 0, IN_REVIEW: 0, COMPLETED: 0 } as Record<string, number>;
    tasks.forEach((t) => { if (t.status in map) map[t.status]++; });
    return map;
  }, [tasks]);

  const total = tasks.length;
  const pct   = total > 0 ? Math.round((counts.COMPLETED / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">{pct}% complete</span>
        <span className="text-muted-foreground">{counts.COMPLETED} / {total} tasks done</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-3 pt-0.5">
        {COLUMNS.map((col) => (
          <span key={col.status} className={cn('flex items-center gap-1.5 text-[11px] font-medium', col.color)}>
            {col.icon}
            {counts[col.status] ?? 0} {col.label}
          </span>
        ))}
      </div>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SubtaskStats } from "@/types/subtasks.types";

interface SubtaskProgressProps {
  stats: SubtaskStats;
}

export function SubtaskProgress({ stats }: SubtaskProgressProps) {
  const { total, completed, inProgress, completionRate } = stats;

  if (total === 0) return null;

  const inProgressPct = Math.round((inProgress / total) * 100);

  return (
    <div className="space-y-2 px-1 pb-3 pt-1">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            Done
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-blue-500/70 shrink-0" />
            In progress
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-muted-foreground/25 shrink-0" />
            To do
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-foreground tabular-nums">
            {completed}
          </span>
          <span className="text-xs text-muted-foreground">of {total}</span>
          <span
            className={cn(
              "text-[10px] font-bold tabular-nums ml-1",
              completionRate === 100
                ? "text-emerald-500"
                : "text-muted-foreground",
            )}
          >
            {completionRate}%
          </span>
        </div>
      </div>

      {/* Segmented bar */}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden flex gap-px">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completionRate}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-emerald-500 rounded-l-full"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${inProgressPct}%` }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
          className="h-full bg-blue-500/70"
        />
      </div>
    </div>
  );
}
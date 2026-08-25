import { Zap, Flame, Brain, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskFocusSectionProps {
  energyType?: string | null;
  focusRequired?: boolean | null;
  focusLevel?: number | null;
  distractionCost?: number | null;
}

const ENERGY_BADGE: Record<string, string> = {
  HIGH: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  MEDIUM: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  LOW: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400",
};

export function TaskFocusSection({
  energyType,
  focusRequired,
  focusLevel,
  distractionCost,
}: TaskFocusSectionProps) {
  const hasAny = energyType || focusRequired || focusLevel || distractionCost;
  if (!hasAny) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Focus & Energy</h3>
      </div>
      <div className="flex flex-wrap gap-2 pl-6">
        {energyType && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium",
              ENERGY_BADGE[energyType] ?? ENERGY_BADGE.MEDIUM
            )}
          >
            <Zap className="w-3 h-3" />
            {energyType} energy
          </span>
        )}

        {focusRequired && (
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400">
            <Flame className="w-3 h-3" />
            Focus required
          </span>
        )}

        {typeof focusLevel === "number" && focusLevel > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400">
            <Brain className="w-3 h-3" />
            Focus level {focusLevel}/5
          </span>
        )}

        {typeof distractionCost === "number" && distractionCost > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400">
            <Activity className="w-3 h-3" />
            Distraction cost {distractionCost}
          </span>
        )}
      </div>
    </div>
  );
}

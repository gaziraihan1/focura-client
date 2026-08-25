import { Target, Flag, RefreshCw } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface Milestone {
  id: string;
  title: string;
  status?: string | null;
  progress?: number | null;
}

interface Sprint {
  id: string;
  name: string;
}

interface Recurrence {
  id: string;
  pattern: string;
  interval: number;
  days?: number[] | null;
  endsAt?: string | null;
}

interface TaskPlanSectionProps {
  milestone?: Milestone | null;
  sprint?: Sprint | null;
  recurrence?: Recurrence | null;
}

export function TaskPlanSection({ milestone, sprint, recurrence }: TaskPlanSectionProps) {
  if (!milestone && !sprint && !recurrence) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Plan</h3>
      </div>
      <div className="space-y-3 pl-6">
        {milestone && (
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <Target className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-sm font-medium text-foreground truncate">
                  {milestone.title}
                </span>
              </div>
              {milestone.status && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
                  {milestone.status.replace("_", " ")}
                </span>
              )}
            </div>
            {typeof milestone.progress === "number" && milestone.progress > 0 && (
              <div className="h-1 w-full rounded-full bg-foreground/10 overflow-hidden">
                <div
                  role="progressbar"
                  aria-label={`${milestone.title} progress`}
                  aria-valuenow={Math.min(100, milestone.progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${Math.min(100, milestone.progress)}%` }}
                />
              </div>
            )}
          </div>
        )}

        {sprint && (
          <div className="flex items-center gap-2">
            <Flag className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="text-sm text-foreground">{sprint.name}</span>
          </div>
        )}

        {recurrence && (
          <div className="flex items-center gap-2 text-sm">
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-foreground capitalize">
              Repeats {recurrence.pattern.toLowerCase()} every{" "}
              {recurrence.interval} {recurrence.interval === 1 ? "period" : "periods"}
            </span>
            {recurrence.endsAt && (
              <span className={cn("text-muted-foreground")}>
                until {format(parseISO(recurrence.endsAt), "MMM d, yyyy")}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

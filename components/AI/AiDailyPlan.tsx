"use client";

import { useState } from "react";
import { CalendarClock, Loader2, ListOrdered, Sparkles, Wand2 } from "lucide-react";
import { useAiDailyPlan, useWorkspaceSlug } from "@/hooks/useAi";
import { cn } from "@/lib/utils";
import {
  AI_ERROR_CODES,
  type AiDailyPlanEntry,
  type AiDailyPlanTaskInput,
  type AiEnergyType,
} from "@/types/ai.types";
import { AiQuotaBadge } from "./AiQuotaBadge";
import { AiUpgradeCta } from "./AiUpgradeCta";

const ENERGY_DOT: Record<AiEnergyType, string> = {
  LOW: "bg-emerald-500",
  MEDIUM: "bg-amber-500",
  HIGH: "bg-rose-500",
};

function getErrorCode(error: unknown): string | undefined {
  const e = error as { response?: { data?: { code?: string } }; code?: string };
  return e?.response?.data?.code ?? e?.code;
}

interface AiDailyPlanProps {
  /** Candidate tasks for the day (what the scheduler may reorder). */
  tasks: AiDailyPlanTaskInput[];
  workspaceId?: string | null;
  /** Workspace slug for the upgrade CTA (avoids an async slug lookup). */
  workspaceSlug?: string;
  className?: string;
}

/**
 * "AI daily plan" card — orders a set of tasks into a recommended sequence
 * using the backend `plan.daily` feature (PRO/BUSINESS). Purely advisory:
 * it never changes task state itself.
 */
export function AiDailyPlan({ tasks, workspaceId, workspaceSlug, className }: AiDailyPlanProps) {
  const [plan, setPlan] = useState<AiDailyPlanEntry[] | null>(null);
  const [rationale, setRationale] = useState<string | undefined>();
  const [quotaError, setQuotaError] = useState(false);

  const dailyPlan = useAiDailyPlan();
  // The page usually passes the slug directly; fall back to the cached lookup
  // when it doesn't (both are hooks-safe — no conditional hook calls).
  const slugFromList = useWorkspaceSlug(workspaceId);
  const resolvedWorkspaceSlug = workspaceSlug ?? slugFromList;

  const trimmed = tasks.filter((task) => task.title.trim().length > 0);
  const canGenerate = trimmed.length >= 2 && !dailyPlan.isPending;

  const taskById = new Map(trimmed.map((task) => [task.id, task]));

  async function handleGenerate() {
    setQuotaError(false);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const result = await dailyPlan.mutateAsync({
        date: today,
        tasks: trimmed,
        workspaceId,
      });
      setPlan(result.plan);
      setRationale(result.rationale);
    } catch (err) {
      const code = getErrorCode(err);
      if (
        code === AI_ERROR_CODES.dailyQuota ||
        code === AI_ERROR_CODES.monthlyQuota ||
        code === AI_ERROR_CODES.rateLimit
      ) {
        setQuotaError(true);
      }
      // Other AI errors stay silent — the card simply keeps its prior state.
    }
  }

  if (trimmed.length < 2) return null;

  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Plan my day with AI</h3>
            <p className="text-xs text-muted-foreground">
              Best order for {trimmed.length} task{trimmed.length === 1 ? "" : "s"} today
            </p>
          </div>
        </div>
        <AiQuotaBadge workspaceId={workspaceId} className="hidden sm:inline-flex" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-opacity",
            canGenerate
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "cursor-not-allowed bg-muted text-muted-foreground",
          )}
        >
          {dailyPlan.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {dailyPlan.isPending ? "Planning…" : "Generate order"}
        </button>
        {plan && (
          <button
            type="button"
            onClick={() => {
              setPlan(null);
              setRationale(undefined);
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {quotaError && <AiUpgradeCta className="mt-4" workspaceSlug={resolvedWorkspaceSlug} />}

      {plan && plan.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <ListOrdered className="h-4 w-4 text-primary" aria-hidden="true" />
            Recommended order
          </div>
          <ol className="mt-2 space-y-1.5">
            {plan.map((entry) => {
              const task = taskById.get(entry.taskId);
              if (!task) return null;
              return (
                <li
                  key={entry.taskId}
                  className="flex items-start gap-2.5 rounded-lg border border-border bg-background px-3 py-2"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                    {entry.order}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-sm text-foreground">
                        {task.title}
                      </span>
                      {task.energyType && (
                        <span
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            ENERGY_DOT[task.energyType],
                          )}
                          title={`${task.energyType} energy`}
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {entry.reason}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
          {rationale && (
            <p className="mt-2 text-xs italic text-muted-foreground">{rationale}</p>
          )}
          <p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Wand2 className="h-3 w-3" aria-hidden="true" />
            Suggested order only — nothing is changed automatically.
          </p>
        </div>
      )}
    </div>
  );
}

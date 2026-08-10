"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Check, Loader2, ListChecks, Sparkles, Wand2 } from "lucide-react";
import { useAiTaskBreakdown } from "@/hooks/useAi";
import { useCreateTask } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import {
  AI_ERROR_CODES,
  type AiEnergyType,
  type AiGoalBreakdownTask,
} from "@/types/ai.types";
import { AiQuotaBadge } from "./AiQuotaBadge";
import { AiUpgradeCta } from "./AiUpgradeCta";

const ENERGY_STYLES: Record<AiEnergyType, string> = {
  LOW: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  HIGH: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

function getErrorCode(error: unknown): string | undefined {
  const e = error as { response?: { data?: { code?: string } }; code?: string };
  return e?.response?.data?.code ?? e?.code;
}

/**
 * "Cognitive breakdown" card — describes a big goal and the AI returns a
 * low→high energy task sequence the user can review and add to their tasks.
 */
export function AiGoalBreakdown() {
  const [goal, setGoal] = useState("");
  const [tasks, setTasks] = useState<AiGoalBreakdownTask[] | null>(null);
  const [rationale, setRationale] = useState<string | undefined>();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [quotaError, setQuotaError] = useState(false);

  const breakdown = useAiTaskBreakdown();
  const createTask = useCreateTask();

  const trimmedGoal = goal.trim();
  const canGenerate = trimmedGoal.length >= 5 && !breakdown.isPending;
  const selectedCount = tasks ? [...selected].filter((i) => tasks[i]).length : 0;

  async function handleGenerate() {
    setQuotaError(false);
    try {
      const result = await breakdown.mutateAsync({ goal: trimmedGoal });
      setTasks(result.tasks);
      setRationale(result.rationale);
      setSelected(new Set(result.tasks.map((_, i) => i)));
    } catch (err) {
      const code = getErrorCode(err);
      if (
        code === AI_ERROR_CODES.dailyQuota ||
        code === AI_ERROR_CODES.monthlyQuota ||
        code === AI_ERROR_CODES.rateLimit
      ) {
        setQuotaError(true);
      } else if (!code || !String(code).startsWith("AI_")) {
        // Silent for structured AI errors (unavailable / invalid response)
        // — the query-level notice handles those. Only surface unexpected ones.
        toast.error("AI is unavailable right now. Please try again later.");
      }
    }
  }

  async function handleAddToTasks() {
    if (!tasks || selectedCount === 0) return;
    const picked = tasks.filter((_, i) => selected.has(i));

    const results = await Promise.allSettled(
      picked.map((task) =>
        createTask.mutateAsync({
          title: task.title,
          description: `Planned with AI from: "${trimmedGoal}"`,
          status: "TODO",
          priority: "MEDIUM",
          energyType: task.energyType ?? undefined,
          estimatedHours: task.estimatedHours ?? undefined,
          workspaceId: null,
          projectId: undefined,
          assigneeIds: [],
          labelIds: [],
        }),
      ),
    );

    const created = results.filter((r) => r.status === "fulfilled").length;
    if (created > 0) {
      toast.success(`${created} task${created === 1 ? "" : "s"} added`);
      setTasks(null);
      setGoal("");
      setSelected(new Set());
    } else {
      toast.error("Couldn't create the tasks. Please try again.");
    }
  }

  function toggleTask(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Wand2 className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Plan a goal with AI
            </h3>
            <p className="text-xs text-muted-foreground">
              Break a big goal into small, energy-matched steps
            </p>
          </div>
        </div>
        <AiQuotaBadge className="hidden sm:inline-flex" />
      </div>

      <div className="mt-4">
        <label htmlFor="ai-goal-input" className="sr-only">
          Your goal
        </label>
        <textarea
          id="ai-goal-input"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={2}
          placeholder='e.g. "Launch a personal blog by the end of the month"'
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">
            {goal.trim().length > 0 && goal.trim().length < 5
              ? "Describe your goal with at least 5 characters"
              : "AI will order steps from easiest to hardest"}
          </p>
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
            {breakdown.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {breakdown.isPending ? "Planning…" : "Generate plan"}
          </button>
        </div>
      </div>

      {quotaError && (
        <AiUpgradeCta className="mt-4" />
      )}

      {tasks && tasks.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <ListChecks className="h-4 w-4 text-primary" aria-hidden="true" />
            Suggested steps
          </div>
          <ul className="mt-2 space-y-1.5">
            {tasks.map((task, index) => {
              const isSelected = selected.has(index);
              return (
                <li key={`${task.title}-${index}`}>
                  <button
                    type="button"
                    onClick={() => toggleTask(index)}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors",
                      isSelected
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-background hover:border-border/70",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background",
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-foreground leading-snug">
                        {task.title}
                      </span>
                      {task.energyType && (
                        <span
                          className={cn(
                            "mt-1 inline-block rounded-full border px-1.5 py-0.5 text-[10px] font-semibold",
                            ENERGY_STYLES[task.energyType],
                          )}
                        >
                          {task.energyType} energy
                        </span>
                      )}
                      {task.estimatedHours != null && (
                        <span className="ml-1.5 text-[10px] text-muted-foreground">
                          ~{task.estimatedHours}h
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {rationale && (
            <p className="mt-2 text-xs italic text-muted-foreground">{rationale}</p>
          )}
          <button
            type="button"
            onClick={handleAddToTasks}
            disabled={selectedCount === 0 || createTask.isPending}
            className={cn(
              "mt-3 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-opacity",
              selectedCount === 0 || createTask.isPending
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground hover:opacity-90",
            )}
          >
            {createTask.isPending && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            )}
            Add {selectedCount} task{selectedCount === 1 ? "" : "s"} to my tasks
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { Check, Sparkles, Wand2 } from "lucide-react";
import { useAiTaskSuggestions, useWorkspaceSlug } from "@/hooks/useAi";
import { cn } from "@/lib/utils";
import { AI_ERROR_CODES, type AiEnergyType, type AiPriority, type AiTaskSuggestion } from "@/types/ai.types";
import { AiQuotaBadge } from "./AiQuotaBadge";
import { AiUpgradeCta } from "./AiUpgradeCta";

interface AiSuggestionBarProps {
  title: string;
  workspaceId?: string | null;
  energyType?: AiEnergyType;
  enabled?: boolean;
  /** Apply the whole suggestion (description, priority, energy, dates…). */
  onApply: (suggestion: AiTaskSuggestion) => void;
  /** Apply a single field (chip click). */
  onApplyPartial: (patch: Partial<AiTaskSuggestion>) => void;
}

const PRIORITY_LABEL: Record<AiPriority, string> = {
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

function getErrorCode(error: unknown): string | undefined {
  const e = error as { response?: { data?: { code?: string } }; code?: string };
  return e?.response?.data?.code ?? e?.code;
}

function formatDueDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * Renders AI suggestions for a task title. Shown only when the debounced title
 * is long enough; never blocks the form and fails gracefully on any error.
 */
export function AiSuggestionBar({
  title,
  workspaceId,
  energyType,
  enabled = true,
  onApply,
  onApplyPartial,
}: AiSuggestionBarProps) {
  const trimmed = title.trim();

  // Keep the hook mounted so its query state stays warm, but only surface the
  // bar once the user has actually typed something meaningful.
  const { data, isFetching, error } = useAiTaskSuggestions({
    title: trimmed,
    workspaceId,
    energyType,
    enabled: enabled && trimmed.length >= 3,
  });
  const workspaceSlug = useWorkspaceSlug(workspaceId);

  if (trimmed.length < 3) return null;

  const errorCode = getErrorCode(error);

  if (
    errorCode === AI_ERROR_CODES.dailyQuota ||
    errorCode === AI_ERROR_CODES.monthlyQuota ||
    errorCode === AI_ERROR_CODES.rateLimit
  ) {
    return (
      <AiUpgradeCta compact className="mt-3 w-full" workspaceSlug={workspaceSlug} />
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          AI suggestions
        </p>
        <div className="flex items-center gap-2">
          <AiQuotaBadge workspaceId={workspaceId} />
        </div>
      </div>

      {isFetching && !data ? (
        <div className="mt-2 space-y-1.5" aria-live="polite">
          <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-muted" />
          <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-muted" />
          <p className="text-[11px] text-muted-foreground">Analyzing title…</p>
        </div>
      ) : error ? (
        <p className="mt-2 text-xs text-muted-foreground">
          AI is unavailable right now. You can still create the task manually.
        </p>
      ) : data ? (
        <>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <SuggestionChip
              label={data.priority ? PRIORITY_LABEL[data.priority] : null}
              icon={<Wand2 className="h-3 w-3" aria-hidden="true" />}
              onClick={() => data.priority && onApplyPartial({ priority: data.priority })}
            />
            <SuggestionChip
              label={data.energyType ? `${data.energyType} energy` : null}
              onClick={() => data.energyType && onApplyPartial({ energyType: data.energyType })}
            />
            <SuggestionChip
              label={data.intent ?? null}
              onClick={() => data.intent && onApplyPartial({ intent: data.intent })}
            />
            <SuggestionChip
              label={data.estimatedHours != null ? `~${data.estimatedHours}h` : null}
              onClick={() =>
                data.estimatedHours != null &&
                onApplyPartial({ estimatedHours: data.estimatedHours })
              }
            />
            <SuggestionChip
              label={data.dueDate ? formatDueDate(data.dueDate) : null}
              onClick={() => data.dueDate && onApplyPartial({ dueDate: data.dueDate })}
            />
            <SuggestionChip
              label={data.description ? "Description" : null}
              onClick={() => data.description && onApplyPartial({ description: data.description })}
            />
          </div>

          {(data.subtasks?.length ?? 0) > 0 && (
            <div className="mt-2 rounded-lg border border-border bg-background/60 px-2.5 py-2">
              <p className="text-[11px] font-medium text-muted-foreground">
                Suggested subtasks
              </p>
              <ul className="mt-1 space-y-0.5">
                {data.subtasks.slice(0, 3).map((subtask, index) => (
                  <li
                    key={`${subtask.title}-${index}`}
                    className="flex items-center gap-1.5 text-xs text-foreground/90"
                  >
                    <Check className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
                    <span className="truncate">{subtask.title}</span>
                  </li>
                ))}
                {data.subtasks.length > 3 && (
                  <li className="text-[11px] text-muted-foreground">
                    +{data.subtasks.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={() => onApply(data)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Apply all
          </button>
        </>
      ) : null}
    </div>
  );
}

function SuggestionChip({
  label,
  icon,
  onClick,
}: {
  label: string | null;
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  if (!label) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      title={`Apply ${label}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground/90",
        "transition-colors hover:border-primary/50 hover:text-primary",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

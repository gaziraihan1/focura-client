"use client";

import { Sparkles } from "lucide-react";
import { useAiQuota } from "@/hooks/useAi";
import { cn } from "@/lib/utils";

interface AiQuotaBadgeProps {
  workspaceId?: string | null;
  className?: string;
}

/**
 * Small pill showing how many AI credits remain today. Uses the workspace
 * quota when `workspaceId` is provided, otherwise the user's personal quota.
 * Hidden entirely when the quota cannot be loaded (offline / not configured).
 */
export function AiQuotaBadge({ workspaceId, className }: AiQuotaBadgeProps) {
  const { data: quota } = useAiQuota(workspaceId, true);

  if (!quota) return null;

  const ratio = quota.dailyLimit > 0 ? quota.usedToday / quota.dailyLimit : 1;
  const tone =
    ratio >= 1
      ? "bg-destructive/10 text-destructive border-destructive/20"
      : ratio >= 0.5
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";

  return (
    <span
      title={`${quota.remaining} of ${quota.dailyLimit} AI credits left today`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tabular-nums whitespace-nowrap",
        tone,
        className,
      )}
    >
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      {quota.remaining}
      <span className="opacity-70">/ {quota.dailyLimit}</span>
    </span>
  );
}

"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, ClipboardList, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useAiMeetingSummary, useWorkspaceSlug } from "@/hooks/useAi";
import { cn } from "@/lib/utils";
import {
  AI_ERROR_CODES,
  type AiMeetingActionItem,
} from "@/types/ai.types";
import { AiQuotaBadge } from "./AiQuotaBadge";
import { AiUpgradeCta } from "./AiUpgradeCta";
import { Button } from "@/components/ui/Button";

function getErrorCode(error: unknown): string | undefined {
  const e = error as { response?: { data?: { code?: string } }; code?: string };
  return e?.response?.data?.code ?? e?.code;
}

interface AiMeetingSummaryProps {
  meetingId: string;
  workspaceId?: string | null;
  /** Workspace slug for the upgrade CTA (avoids an async slug lookup). */
  workspaceSlug?: string;
  className?: string;
}

/**
 * "Summarize with AI" card for meeting detail pages. Takes optional pasted
 * notes, calls the backend `meetings.summarize` feature (PRO/BUSINESS), and
 * renders minutes + action items. Pure display — nothing is posted back.
 */
export function AiMeetingSummary({
  meetingId,
  workspaceId,
  workspaceSlug,
  className,
}: AiMeetingSummaryProps) {
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [actionItems, setActionItems] = useState<AiMeetingActionItem[]>([]);
  const [quotaError, setQuotaError] = useState(false);

  const summarize = useAiMeetingSummary();
  // The page usually passes the slug directly; fall back to the cached lookup
  // when it doesn't (both are hooks-safe — no conditional hook calls).
  const slugFromList = useWorkspaceSlug(workspaceId);
  const resolvedWorkspaceSlug = workspaceSlug ?? slugFromList;

  const canGenerate = meetingId.length > 0 && !summarize.isPending;

  async function handleSummarize() {
    setQuotaError(false);
    try {
      const result = await summarize.mutateAsync({
        meetingId,
        workspaceId,
        notes: notes.trim() || undefined,
      });
      setSummary(result.summary);
      setActionItems(result.actionItems ?? []);
    } catch (err) {
      const code = getErrorCode(err);
      if (
        code === AI_ERROR_CODES.dailyQuota ||
        code === AI_ERROR_CODES.monthlyQuota ||
        code === AI_ERROR_CODES.rateLimit
      ) {
        setQuotaError(true);
      } else if (code === AI_ERROR_CODES.providerRateLimit) {
        // Google-side rate limit — transient, prompt to retry (not a plan issue).
        toast.error(
          "AI is receiving too many requests right now. Please wait a moment and try again.",
        );
      }
    }
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardList className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Summarize with AI
            </h3>
            <p className="text-xs text-muted-foreground">
              Minutes + action items in one click
            </p>
          </div>
        </div>
        <AiQuotaBadge workspaceId={workspaceId} className="hidden sm:inline-flex" />
      </div>

      <label htmlFor="ai-meeting-notes" className="sr-only">
        Meeting notes
      </label>
      <textarea
        id="ai-meeting-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="Paste any notes from the meeting (optional)…"
        className="mt-4 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <div className="mt-2 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="primary"
          onClick={handleSummarize}
          disabled={!canGenerate}
          className={cn(
            "rounded-lg px-3.5 py-2 text-xs font-semibold gap-1.5",
            canGenerate
              ? "hover:opacity-90"
              : "cursor-not-allowed bg-muted text-muted-foreground",
          )}
        >
          {summarize.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {summarize.isPending ? "Summarizing…" : "Summarize meeting"}
        </Button>
      </div>

      {quotaError && <AiUpgradeCta className="mt-4" workspaceSlug={resolvedWorkspaceSlug} />}

      {summary && (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-border bg-background p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Summary
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{summary}</p>
          </div>

          {actionItems.length > 0 && (
            <div className="rounded-lg border border-border bg-background p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Action items
              </p>
              <ul className="mt-2 space-y-1.5">
                {actionItems.map((item, index) => (
                  <li
                    key={`${item.text}-${index}`}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      {item.text}
                      {item.assigneeEmail && (
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          → {item.assigneeEmail}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Wand2 className="h-3 w-3" aria-hidden="true" />
            AI-generated — review before sharing.
          </p>
        </div>
      )}
    </div>
  );
}

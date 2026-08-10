"use client";

import { useState } from "react";
import { Check, Loader2, Wand2 } from "lucide-react";
import { useAiCommentAssist, useWorkspaceSlug } from "@/hooks/useAi";
import { cn } from "@/lib/utils";
import { AI_ERROR_CODES, type AiCommentTone } from "@/types/ai.types";
import { AiUpgradeCta } from "./AiUpgradeCta";

function getErrorCode(error: unknown): string | undefined {
  const e = error as { response?: { data?: { code?: string } }; code?: string };
  return e?.response?.data?.code ?? e?.code;
}

const TONES: { value: AiCommentTone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "concise", label: "Concise" },
  { value: "formal", label: "Formal" },
  { value: "persuasive", label: "Persuasive" },
];

interface AiCommentAssistProps {
  /** Current draft text — the minimum for a rewrite. */
  text: string;
  workspaceId?: string | null;
  /** Receives the rewritten text (caller decides whether to apply it). */
  onAssist: (rewritten: string) => void;
  className?: string;
}

/**
 * "Rewrite with AI" affordance for comments. Opens a small tone picker;
 * the rewritten text is offered back via `onAssist`, never posted directly.
 */
export function AiCommentAssist({
  text,
  workspaceId,
  onAssist,
  className,
}: AiCommentAssistProps) {
  const [open, setOpen] = useState(false);
  const [quotaError, setQuotaError] = useState(false);
  const [featureError, setFeatureError] = useState(false);
  const [serviceError, setServiceError] = useState(false);
  const assist = useAiCommentAssist();
  const workspaceSlug = useWorkspaceSlug(workspaceId);
  const canAssist = text.trim().length >= 2 && !assist.isPending;

  async function handleTone(tone: AiCommentTone) {
    setOpen(false);
    if (!canAssist) return;
    setQuotaError(false);
    setFeatureError(false);
    setServiceError(false);
    try {
      const result = await assist.mutateAsync({ text: text.trim(), tone, workspaceId });
      if (result?.text) onAssist(result.text);
    } catch (err) {
      const code = getErrorCode(err);
      if (
        code === AI_ERROR_CODES.dailyQuota ||
        code === AI_ERROR_CODES.monthlyQuota ||
        code === AI_ERROR_CODES.rateLimit
      ) {
        setQuotaError(true);
      } else if (code === AI_ERROR_CODES.featureNotAvailable) {
        setFeatureError(true);
      } else {
        // Service down / bad response — surface it briefly instead of silently
        // doing nothing.
        setServiceError(true);
      }
    }
  }

  return (
    <div className={cn("relative", className)}>
      {open && (
        <button
          type="button"
          aria-label="Close rewrite menu"
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => setOpen(false)}
          tabIndex={-1}
        />
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={!canAssist}
        aria-expanded={open}
        aria-haspopup="menu"
        title={
          canAssist
            ? "Rewrite with AI"
            : "Write a little more to use AI rewriting"
        }
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium transition-colors",
          canAssist
            ? "text-foreground hover:border-primary/50 hover:text-primary"
            : "cursor-not-allowed text-muted-foreground/50",
        )}
      >
        {assist.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{assist.isPending ? "Rewriting…" : "Rewrite"}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Rewrite with AI"
          className="absolute bottom-full left-0 z-20 mb-1 w-44 rounded-xl border border-border bg-card p-1 shadow-lg animate-in fade-in slide-in-from-bottom-1 duration-150"
        >
          {TONES.map((tone) => (
            <button
              key={tone.value}
              type="button"
              role="menuitem"
              onClick={() => handleTone(tone.value)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              {tone.label}
              {assist.isPending && (
                <Check className="h-3 w-3 text-primary opacity-0" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}

      {(quotaError || featureError) && (
        <AiUpgradeCta compact className="mt-3" workspaceSlug={workspaceSlug} />
      )}
      {serviceError && (
        <p role="alert" className="mt-3 text-xs text-muted-foreground">
          AI couldn&apos;t rewrite right now. Please try again shortly.
        </p>
      )}
    </div>
  );
}

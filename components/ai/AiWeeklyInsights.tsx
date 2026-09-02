"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useAiWeeklyInsights } from "@/hooks/useAi";
import { useWorkspaces } from "@/hooks/useWorkspace";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  AI_ERROR_CODES,
  type AiWeeklyInsightRisk,
  type AiWeeklyInsights as AiWeeklyInsightsData,
} from "@/types/ai.types";
import { AiQuotaBadge } from "./AiQuotaBadge";
import { AiUpgradeCta } from "./AiUpgradeCta";

const SEVERITY_STYLES: Record<AiWeeklyInsightRisk["severity"], string> = {
  low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  high: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

const SEVERITY_LABEL: Record<AiWeeklyInsightRisk["severity"], string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

function getErrorCode(error: unknown): string | undefined {
  const e = error as { response?: { data?: { code?: string } }; code?: string };
  return e?.response?.data?.code ?? e?.code;
}

interface AiWeeklyInsightsProps {
  /**
   * Workspace to analyze. On workspace pages pass the workspace id; on personal
   * pages (wellness) omit it and the card shows a workspace picker.
   */
  workspaceId?: string | null;
  className?: string;
}

/**
 * "AI Insights" card — a weekly productivity summary with burnout warnings
 * for a workspace (BUSINESS-only, `pro` model). Purely advisory: it reads the
 * workspace's aggregated week and never mutates data.
 */
export function AiWeeklyInsights({ workspaceId, className }: AiWeeklyInsightsProps) {
  const [insights, setInsights] = useState<AiWeeklyInsightsData | null>(null);
  const [quotaError, setQuotaError] = useState(false);
  const [featureError, setFeatureError] = useState(false);
  const [serviceError, setServiceError] = useState(false);
  const [providerBusyError, setProviderBusyError] = useState(false);
  const [pickedWorkspaceId, setPickedWorkspaceId] = useState<string | null>(null);

  const weeklyInsights = useAiWeeklyInsights();
  const { data: workspaces } = useWorkspaces();

  // Personal dashboard pages have no workspace context — let the user choose
  // which workspace to analyze (defaults to the first Business/Enterprise one,
  // falling back to the first workspace).
  const personalContext = !workspaceId;
  const preferredId =
    workspaces?.find((ws) => ws.plan === "BUSINESS" || ws.plan === "ENTERPRISE")
      ?.id ?? workspaces?.[0]?.id ?? null;
  const resolvedWorkspaceId = workspaceId ?? pickedWorkspaceId ?? preferredId;
  const resolvedWorkspace = workspaces?.find((ws) => ws.id === resolvedWorkspaceId);
  const resolvedWorkspaceName = resolvedWorkspace?.name;
  const resolvedWorkspaceSlug = resolvedWorkspace?.slug;

  const canGenerate = Boolean(resolvedWorkspaceId) && !weeklyInsights.isPending;

  async function handleGenerate() {
    if (!resolvedWorkspaceId) return;
    setQuotaError(false);
    setFeatureError(false);
    setServiceError(false);
    setProviderBusyError(false);
    try {
      const result = await weeklyInsights.mutateAsync({
        workspaceId: resolvedWorkspaceId,
      });
      setInsights(result);
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
      } else if (code === AI_ERROR_CODES.providerRateLimit) {
        // Provider-side 429 (Google rate limit) — transient, prompt to retry.
        setProviderBusyError(true);
      } else {
        // Any other failure (service down, bad response, network) — surface it
        // instead of silently doing nothing.
        setServiceError(true);
      }
    }
  }

  // No workspace to analyze (user isn't in any workspace yet).
  if (workspaces && workspaces.length === 0 && !workspaceId) {
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed border-border bg-card p-5 text-center",
          className,
        )}
      >
        <BarChart3 className="mx-auto h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <p className="mt-2 text-sm font-medium text-foreground">Weekly AI insights</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
          Join a workspace to get an AI-powered summary of your team&apos;s week,
          plus early burnout warnings.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Weekly AI insights</h3>
            <p className="text-xs text-muted-foreground">
              {resolvedWorkspaceId
                ? `Productivity & burnout signals for ${resolvedWorkspaceName ?? "this workspace"}`
                : "Productivity & burnout signals for your team"}
            </p>
          </div>
        </div>
        {resolvedWorkspaceId && (
          <AiQuotaBadge workspaceId={resolvedWorkspaceId} className="hidden sm:inline-flex" />
        )}
      </div>

      {personalContext && workspaces && workspaces.length > 1 && (
        <label className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="shrink-0 font-medium">Workspace</span>
          <select
            value={resolvedWorkspaceId ?? ""}
            onChange={(e) => {
              setPickedWorkspaceId(e.target.value || null);
              setInsights(null);
              setQuotaError(false);
              setFeatureError(false);
              setServiceError(false);
              setProviderBusyError(false);
            }}
            className="min-w-0 flex-1 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name} ({ws.plan})
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleGenerate}
          disabled={!canGenerate}
          className={cn(
            "gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-opacity",
            canGenerate
              ? "hover:opacity-90"
              : "cursor-not-allowed bg-muted text-muted-foreground",
          )}
        >
          {weeklyInsights.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {weeklyInsights.isPending ? "Analyzing…" : "Generate weekly insights"}
        </Button>
        {insights && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setInsights(null);
              setQuotaError(false);
              setFeatureError(false);
              setServiceError(false);
              setProviderBusyError(false);
            }}
            className="gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </Button>
        )}
      </div>

      {quotaError && (
        <AiUpgradeCta
          className="mt-4"
          workspaceSlug={resolvedWorkspaceSlug}
          message="You've reached the AI limit. Upgrade to Pro for more AI usage."
        />
      )}
      {featureError && (
        <AiUpgradeCta
          className="mt-4"
          workspaceSlug={resolvedWorkspaceSlug}
          message="Weekly AI insights are a Business feature. Upgrade to Business to unlock them."
        />
      )}
      {serviceError && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground"
        >
          AI couldn&apos;t generate insights right now. Please try again shortly.
        </p>
      )}
      {providerBusyError && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground"
        >
          The AI provider is busy right now. Please wait a moment and try again.
        </p>
      )}

      {insights && (
        <div className="mt-4 space-y-4">
          {/* Summary */}
          <p className="text-sm leading-relaxed text-foreground">{insights.summary}</p>

          {/* Highlights */}
          {insights.highlights.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                What went well
              </div>
              <ul className="mt-2 space-y-1.5">
                {insights.highlights.map((item, index) => (
                  <li
                    key={`${item.title}-${index}`}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <span className="block text-sm text-foreground">{item.title}</span>
                    {item.detail && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {item.detail}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risks / burnout warnings */}
          {insights.risks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
                Watch out for
              </div>
              <ul className="mt-2 space-y-1.5">
                {insights.risks.map((risk, index) => (
                  <li
                    key={`${risk.title}-${index}`}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-foreground">{risk.title}</span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                          SEVERITY_STYLES[risk.severity],
                        )}
                      >
                        {SEVERITY_LABEL[risk.severity]}
                      </span>
                    </span>
                    {risk.detail && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {risk.detail}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

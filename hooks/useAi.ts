"use client";

/**
 * All AI module hooks in one place — mirrors `hooks/useTask.ts`'s convention
 * of grouping related hooks in a single file.
 *
 * Every hook calls the Focura backend's `/api/v1/ai/*` endpoints through the
 * existing `lib/axios.ts` instance; the backend is the only process that talks
 * to Google Gemini. See `types/ai.types.ts` for the payload contracts and
 * `../Focura-backend/GEMINI.md` for the server-side architecture.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  AI_BASE_PATH,
  type AiCommentAssist,
  type AiCommentTone,
  type AiDailyPlan,
  type AiDailyPlanTaskInput,
  type AiEnergyType,
  type AiGoalBreakdown,
  type AiMeetingSummary,
  type AiQuota,
  type AiTaskSuggestion,
  type AiUsageReport,
  type AiWeeklyInsights,
} from "@/types/ai.types";
import { useWorkspaces } from "./useWorkspace";
import { useDebouncedValue } from "./useDebouncedValue";

// ─── Query-key factory (mirrors `taskKeys.ts` conventions) ─────────────────

export type AiScope = { workspaceId?: string | null };

export const aiKeys = {
  all: ["ai"] as const,
  quota: (scope: AiScope) =>
    ["ai", "quota", scope.workspaceId ?? "personal"] as const,
  autocomplete: (scope: AiScope, title: string, energyType?: string) =>
    [
      "ai",
      "autocomplete",
      scope.workspaceId ?? "personal",
      title,
      energyType ?? "",
    ] as const,
  breakdown: ["ai", "breakdown"] as const,
  commentAssist: ["ai", "comment-assist"] as const,
  dailyPlan: (date: string, taskIds: string[]) =>
    ["ai", "daily-plan", date, taskIds.join(",")] as const,
  meetingSummary: (meetingId: string) =>
    ["ai", "meeting-summary", meetingId] as const,
  weeklyInsights: (workspaceId: string) =>
    ["ai", "weekly-insights", workspaceId] as const,
  usage: (workspaceId: string, days: number) =>
    ["ai", "usage", workspaceId, days] as const,
};

// ─── Quota ─────────────────────────────────────────────────────────────────

/**
 * Reads the remaining AI quota for a workspace, or the user's personal quota
 * when `workspaceId` is omitted. Backed by `GET /api/v1/ai/quota` which never
 * consumes the AI budget.
 */
export function useAiQuota(workspaceId?: string | null, enabled = true) {
  return useQuery({
    queryKey: aiKeys.quota({ workspaceId }),
    enabled,
    queryFn: async (): Promise<AiQuota | null> => {
      const query = workspaceId
        ? `?workspaceId=${encodeURIComponent(workspaceId)}`
        : "";
      const res = await api.get<AiQuota>(`${AI_BASE_PATH}/quota${query}`, {
        showErrorToast: false,
      });
      return res?.data ?? null;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

// ─── Usage report (OWNER/ADMIN only) ──────────────────────────────────────

/**
 * `GET /api/v1/ai/usage` — workspace AI spend report (calls, tokens, estimated
 * $) from `AiUsageLog`. Backend-gated to workspace owners and admins; a 403 is
 * returned to members/GUESTs. Free read — never consumes the AI budget.
 */
export function useAiUsageReport(
  workspaceId?: string | null,
  enabled = true,
  days = 30,
) {
  return useQuery({
    queryKey: aiKeys.usage(workspaceId ?? "", days),
    enabled: Boolean(workspaceId) && enabled,
    queryFn: async (): Promise<AiUsageReport | null> => {
      const res = await api.get<AiUsageReport>(
        `${AI_BASE_PATH}/usage?workspaceId=${encodeURIComponent(workspaceId!)}&days=${days}`,
        { showErrorToast: false },
      );
      return res?.data ?? null;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

// ─── Usage export (reuses the workspace-usage CSV/JSON pattern) ───────────

const AI_FEATURE_LABELS: Record<string, string> = {
  "tasks.autocomplete": "Task autocomplete",
  "goals.breakdown": "Goal breakdown",
  "comments.assist": "Comment assist",
  "plan.daily": "Daily plan",
  "meetings.summarize": "Meeting summary",
  "insights.weekly": "Weekly insights",
};

/** Human-readable label for an AI feature key (falls back to the raw key). */
export function aiFeatureLabel(feature: string): string {
  return AI_FEATURE_LABELS[feature] ?? feature;
}

/** CSV-safe cell — quotes fields containing commas, quotes or newlines. */
function csvCell(value: string | number): string {
  const text = String(value);
  const needsQuoting = /[",\n]/.test(text);
  if (!needsQuoting) return text;
  return '"' + text.replaceAll('"', '""') + '"';
}

/**
 * Client-side export of the AI usage report (CSV or JSON). Reads the cached
 * `useAiUsageReport` data so the download is instant and needs no extra fetch
 * — the same pattern as `useExportWorkspaceUsage`.
 */
export function useExportAiUsage() {
  const queryClient = useQueryClient();

  const getReport = (workspaceId: string, days: number): AiUsageReport => {
    const data = queryClient.getQueryData<AiUsageReport>(
      aiKeys.usage(workspaceId, days),
    );
    if (!data) {
      throw new Error("AI usage data is not loaded yet. Refresh the section first.");
    }
    return data;
  };

  const buildCsv = (report: AiUsageReport): string => {
    const rows: string[] = [];
    rows.push("Section,Field,Value");
    rows.push(`Summary,Period (days),${report.days}`);
    rows.push(`Summary,Start,${report.period.start}`);
    rows.push(`Summary,End,${report.period.end}`);
    rows.push(`Summary,AI Calls,${report.total.calls}`);
    rows.push(`Summary,Input Tokens,${report.total.inputTokens}`);
    rows.push(`Summary,Output Tokens,${report.total.outputTokens}`);
    rows.push(`Summary,Total Tokens,${report.total.totalTokens}`);
    rows.push(`Summary,Estimated Cost (USD),${report.total.costUsd.toFixed(6)}`);
    rows.push("");
    rows.push("Calls by Feature,Feature,Calls,Total Tokens,Estimated Cost (USD)");
    report.byFeature.forEach((feature) =>
      rows.push(
        `${csvCell(aiFeatureLabel(feature.feature))},${feature.calls},${feature.totalTokens},${feature.costUsd.toFixed(6)}`,
      ),
    );
    rows.push("");
    rows.push("Calls by Model,Model,Calls,Total Tokens,Estimated Cost (USD)");
    report.byModel.forEach((model) =>
      rows.push(
        `${csvCell(model.model)},${model.calls},${model.totalTokens},${model.costUsd.toFixed(6)}`,
      ),
    );
    rows.push("");
    rows.push(
      "Recent Calls,Feature,Model,Input Tokens,Output Tokens,Total Tokens,Estimated Cost (USD),Created At",
    );
    report.recent.forEach((row) =>
      rows.push(
        `${csvCell(aiFeatureLabel(row.feature))},${csvCell(row.model)},${row.inputTokens},${row.outputTokens},${row.totalTokens},${row.costUsd?.toFixed(6) ?? ""},${row.createdAt}`,
      ),
    );
    return rows.join("\n");
  };

  const download = (content: string, mime: string, filename: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = async (workspaceId: string, days: number): Promise<void> => {
    const report = getReport(workspaceId, days);
    const date = new Date().toISOString().split("T")[0];
    download(buildCsv(report), "text/csv;charset=utf-8;", `ai-usage-${days}d-${date}.csv`);
  };

  const exportToJSON = async (workspaceId: string, days: number): Promise<void> => {
    const report = getReport(workspaceId, days);
    const date = new Date().toISOString().split("T")[0];
    download(
      JSON.stringify(report, null, 2),
      "application/json;charset=utf-8;",
      `ai-usage-${days}d-${date}.json`,
    );
  };

  return { exportToCSV, exportToJSON };
}

// ─── Task autocomplete ────────────────────────────────────────────────────

const MIN_TITLE_LENGTH = 3;
const DEFAULT_DEBOUNCE_MS = 500;

interface UseAiTaskSuggestionsOptions {
  /** Current task title — the source of the suggestion. */
  title: string;
  workspaceId?: string | null;
  energyType?: AiEnergyType;
  enabled?: boolean;
  debounceMs?: number;
}

/**
 * Debounced `POST /api/v1/ai/tasks/autocomplete` wrapped in TanStack Query.
 * Identical titles are deduped by the query key and cached for 60s, so typing
 * back and forth costs no extra AI calls.
 */
export function useAiTaskSuggestions({
  title,
  workspaceId,
  energyType,
  enabled = true,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: UseAiTaskSuggestionsOptions) {
  const debouncedTitle = useDebouncedValue(title.trim(), debounceMs);
  const canRun = enabled && debouncedTitle.length >= MIN_TITLE_LENGTH;

  return useQuery({
    queryKey: aiKeys.autocomplete({ workspaceId }, debouncedTitle, energyType),
    enabled: canRun,
    queryFn: async (): Promise<AiTaskSuggestion | null> => {
      const res = await api.post<AiTaskSuggestion>(
        `${AI_BASE_PATH}/tasks/autocomplete`,
        {
          workspaceId: workspaceId ?? undefined,
          title: debouncedTitle,
          energyType,
        },
        { showErrorToast: false },
      );
      return res?.data ?? null;
    },
    staleTime: 60_000,
    retry: 0,
  });
}

// ─── Daily plan (auto-scheduler) ──────────────────────────────────────────

interface DailyPlanVariables {
  date: string;
  tasks: AiDailyPlanTaskInput[];
  workspaceId?: string | null;
}

/**
 * `POST /api/v1/ai/plan/daily` — orders a set of tasks into a recommended
 * sequence for the day (PRO/BUSINESS). Throws on quota/availability errors so
 * callers can render an upgrade CTA instead of a generic toast.
 */
export function useAiDailyPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      tasks,
      workspaceId,
    }: DailyPlanVariables): Promise<AiDailyPlan> => {
      const res = await api.post<AiDailyPlan>(`${AI_BASE_PATH}/plan/daily`, {
        workspaceId: workspaceId ?? undefined,
        date,
        tasks,
      }, { showErrorToast: false });
      if (!res?.data) throw new Error("The AI service returned no response.");
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "quota"] });
    },
  });
}

// ─── Meeting summary ──────────────────────────────────────────────────────

interface MeetingSummaryVariables {
  meetingId: string;
  workspaceId?: string | null;
  notes?: string;
}

/**
 * `POST /api/v1/ai/meetings/summarize` — turns meeting details + notes into
 * minutes and action items (PRO/BUSINESS). Never posts anything automatically.
 */
export function useAiMeetingSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      meetingId,
      workspaceId,
      notes,
    }: MeetingSummaryVariables): Promise<AiMeetingSummary> => {
      const res = await api.post<AiMeetingSummary>(
        `${AI_BASE_PATH}/meetings/summarize`,
        {
          workspaceId: workspaceId ?? undefined,
          meetingId,
          notes,
        },
        { showErrorToast: false },
      );
      if (!res?.data) throw new Error("The AI service returned no response.");
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "quota"] });
    },
  });
}

// ─── Weekly insights (BUSINESS-only) ──────────────────────────────────────

interface WeeklyInsightsVariables {
  /** Insights are workspace-scoped — the BUSINESS plan is workspace-based. */
  workspaceId: string;
  /** Optional week start (YYYY-MM-DD). Defaults to the current week (Monday). */
  week?: string;
}

/**
 * `POST /api/v1/ai/insights/weekly` — weekly productivity summary + burnout
 * warnings for a workspace (BUSINESS-only, `pro` model). Throws on quota /
 * feature errors so callers can render an upgrade CTA instead of a toast.
 */
export function useAiWeeklyInsights() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      week,
    }: WeeklyInsightsVariables): Promise<AiWeeklyInsights> => {
      const res = await api.post<AiWeeklyInsights>(
        `${AI_BASE_PATH}/insights/weekly`,
        { workspaceId, week: week ?? undefined },
        { showErrorToast: false },
      );
      if (!res?.data) throw new Error("The AI service returned no response.");
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "quota"] });
    },
  });
}

// ─── Goal breakdown ───────────────────────────────────────────────────────

interface BreakdownVariables {
  goal: string;
  workspaceId?: string | null;
  energyType?: AiEnergyType;
}

/**
 * `POST /api/v1/ai/goals/breakdown` — turns a big goal into a sequence of
 * energy-appropriate tasks. Throws on quota/availability errors so callers
 * can render an upgrade CTA instead of a generic toast.
 */
export function useAiTaskBreakdown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      goal,
      workspaceId,
      energyType,
    }: BreakdownVariables): Promise<AiGoalBreakdown> => {
      const res = await api.post<AiGoalBreakdown>(
        `${AI_BASE_PATH}/goals/breakdown`,
        {
          workspaceId: workspaceId ?? undefined,
          goal,
          energyType,
        },
        { showErrorToast: false },
      );
      if (!res?.data) throw new Error("The AI service returned no response.");
      return res.data;
    },
    // Every generation consumes budget — refresh the quota badge.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "quota"] });
    },
  });
}

// ─── Comment assist ───────────────────────────────────────────────────────

interface CommentAssistVariables {
  text: string;
  tone: AiCommentTone;
  workspaceId?: string | null;
}

/**
 * `POST /api/v1/ai/comments/assist` — rewrites a draft comment in the chosen
 * tone. The returned text is offered to the caller (usually via `onChange`),
 * never posted automatically.
 */
export function useAiCommentAssist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      text,
      tone,
      workspaceId,
    }: CommentAssistVariables): Promise<AiCommentAssist> => {
      const res = await api.post<AiCommentAssist>(
        `${AI_BASE_PATH}/comments/assist`,
        {
          workspaceId: workspaceId ?? undefined,
          text,
          tone,
        },
        { showErrorToast: false },
      );
      if (!res?.data) throw new Error("The AI service returned no response.");
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "quota"] });
    },
  });
}

// ─── Workspace slug resolution ─────────────────────────────────────────────

/**
 * Resolve a workspace's slug from its id using the cached workspaces list.
 * Returns `undefined` while the list is loading or the id is unknown — callers
 * should fall back to a neutral destination (never a dead `/dashboard/settings`
 * for workspace-scoped AI upgrades).
 */
export function useWorkspaceSlug(
  workspaceId?: string | null,
): string | undefined {
  const { data: workspaces } = useWorkspaces();
  return workspaces?.find((ws) => ws.id === workspaceId)?.slug;
}

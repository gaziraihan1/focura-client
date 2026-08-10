/**
 * AI feature contracts — mirror of the backend `src/modules/ai` module.
 *
 * The backend is the only process that talks to Gemini; these types describe
 * the `POST /api/v1/ai/*` and `GET /api/v1/ai/quota` payloads.
 */

export type AiEnergyType = "LOW" | "MEDIUM" | "HIGH";
export type AiPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
export type AiIntent =
  | "EXECUTION"
  | "PLANNING"
  | "REVIEW"
  | "LEARNING"
  | "COMMUNICATION";

export type AiCommentTone =
  | "professional"
  | "friendly"
  | "concise"
  | "formal"
  | "persuasive";

export interface AiSubtaskSuggestion {
  title: string;
}

/** `POST /api/v1/ai/tasks/autocomplete` response. */
export interface AiTaskSuggestion {
  description: string;
  priority: AiPriority | null;
  estimatedHours: number | null;
  dueDate: string | null;
  energyType: AiEnergyType | null;
  intent: AiIntent | null;
  subtasks: AiSubtaskSuggestion[];
}

export interface AiGoalBreakdownTask {
  title: string;
  energyType: AiEnergyType | null;
  estimatedHours: number | null;
}

/** `POST /api/v1/ai/goals/breakdown` response. */
export interface AiGoalBreakdown {
  tasks: AiGoalBreakdownTask[];
  rationale?: string;
}

/** `POST /api/v1/ai/comments/assist` response. */
export interface AiCommentAssist {
  text: string;
}

/** One candidate task the scheduler may order for the day. */
export interface AiDailyPlanTaskInput {
  id: string;
  title: string;
  priority?: AiPriority | null;
  energyType?: AiEnergyType | null;
  estimatedHours?: number | null;
  dueDate?: string | null;
}

/** One ordered slot in the AI-suggested day plan. */
export interface AiDailyPlanEntry {
  taskId: string;
  order: number;
  reason: string;
}

/** `POST /api/v1/ai/plan/daily` response. */
export interface AiDailyPlan {
  plan: AiDailyPlanEntry[];
  rationale?: string;
}

/** `POST /api/v1/ai/meetings/summarize` response. */
export interface AiMeetingSummary {
  summary: string;
  actionItems: AiMeetingActionItem[];
}

export interface AiMeetingActionItem {
  text: string;
  assigneeEmail?: string | null;
}

/** `POST /api/v1/ai/insights/weekly` response (BUSINESS-only, `pro` model). */
export interface AiWeeklyInsightHighlight {
  title: string;
  detail?: string;
}

export interface AiWeeklyInsightRisk {
  title: string;
  detail?: string;
  severity: "low" | "medium" | "high";
}

export interface AiWeeklyInsights {
  summary: string;
  highlights: AiWeeklyInsightHighlight[];
  risks: AiWeeklyInsightRisk[];
}

export interface AiQuota {
  plan: "FREE" | "PRO" | "BUSINESS";
  dailyLimit: number;
  usedToday: number;
  remaining: number;
  burstPerMinute: number;
  hourly: number;
  dailyTokens: number;
  monthlyTokens: number;
  tokensUsedToday: number;
  tokensUsedThisMonth: number;
  features: string[];
  resetAt: string;
}

/** Error codes the backend returns for AI endpoints (see `X-AI-RateLimit-*`). */
export const AI_ERROR_CODES = {
  rateLimit: "AI_RATE_LIMIT_EXCEEDED",
  dailyQuota: "AI_DAILY_QUOTA_EXCEEDED",
  monthlyQuota: "AI_MONTHLY_QUOTA_EXCEEDED",
  serviceUnavailable: "AI_RATE_LIMIT_SERVICE_UNAVAILABLE",
  serviceDown: "AI_SERVICE_UNAVAILABLE",
  invalidResponse: "AI_INVALID_RESPONSE",
  featureNotAvailable: "AI_FEATURE_NOT_AVAILABLE",
} as const;

/** AI endpoints are CSRF-protected, so the API client handles auth for us. */
export const AI_BASE_PATH = "/api/v1/ai";

// ─── AI usage report (GET /api/v1/ai/usage — OWNER/ADMIN only) ────────────────

export interface AiUsageByFeature {
  feature: string;
  calls: number;
  totalTokens: number;
  costUsd: number;
}

export interface AiUsageByModel {
  model: string;
  calls: number;
  totalTokens: number;
  costUsd: number;
}

export interface AiUsageRecentRow {
  id: string;
  feature: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number | null;
  createdAt: string;
}

export interface AiUsageReport {
  workspaceId: string;
  days: number;
  period: { start: string; end: string };
  total: {
    calls: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    costUsd: number;
  };
  byFeature: AiUsageByFeature[];
  byModel: AiUsageByModel[];
  recent: AiUsageRecentRow[];
}

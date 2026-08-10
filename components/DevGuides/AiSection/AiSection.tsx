"use client";

import type { GuideArticle } from "@/types/guides.types";
import {
  CodeBlock,
  IC,
  InfoCard,
  Prose,
  RowList,
  SectionH,
  Table,
  Tip,
  Warn,
} from "../";

export const aiArticles: GuideArticle[] = [
  {
    id: "ai-overview",
    title: "AI overview & where it lives",
    summary:
      "AI is server-side only. The Focura backend (src/modules/ai) talks to Google Gemini; the client only calls Focura's own /api/v1/ai endpoints.",
    content: (
      <>
        <Prose>
          Focura&apos;s AI layer runs entirely in the <IC>Focura-backend</IC>{" "}
          <IC>src/modules/ai</IC> module. The client never talks to Google
          directly — it calls Focura&apos;s own{" "}
          <IC>/api/v1/ai/*</IC> endpoints through the existing{" "}
          <IC>lib/axios.ts</IC> instance. This keeps{" "}
          <IC>GEMINI_API_KEY</IC> server-side only and lets the backend enforce
          quotas, rate limits and caching before any LLM call is made.
        </Prose>
        <InfoCard icon="⚡" title="Why server-side?">
          <p>
            The Gemini API key must never ship to the browser. Keeping the LLM
            behind the backend also means every call can be metered against the
            workspace plan (FREE / PRO / BUSINESS) with Redis-backed burst,
            hourly, daily and monthly-token caps.
          </p>
        </InfoCard>
        <CodeBlock label="Request flow">{`React hook → lib/axios → POST /api/v1/ai/*
  → requireAuth (RS256 JWT)
  → aiAccess: workspace membership + feature gate
  → aiRateLimit: burst → hourly → daily → monthly token cap
  → aiController → aiService → gemini.client → Google Gemini
  → response + X-AI-RateLimit-* headers`}</CodeBlock>
      </>
    ),
  },
  {
    id: "ai-endpoints",
    title: "Endpoints & contracts",
    summary:
      "Six live feature endpoints (autocomplete, breakdown, comment assist, daily plan, meeting summary, weekly insights) plus a quota endpoint. All return strict Zod-validated JSON.",
    content: (
      <>
        <SectionH>Live endpoints (pilot scope)</SectionH>
        <Table
          headers={["Endpoint", "Purpose", "Output"]}
          rows={[
            ["POST /api/v1/ai/tasks/autocomplete", "Expand a task title into description, priority, energy, subtasks", "AiTaskSuggestion"],
            ["POST /api/v1/ai/goals/breakdown", "Big goal → Low→Medium→High energy task list", "AiGoalBreakdown"],
            ["POST /api/v1/ai/comments/assist", "Rephrase / expand a comment in a chosen tone", "AiCommentAssist"],
            ["GET /api/v1/ai/quota", "Daily usage + remaining credits for the workspace", "AiQuota"],
            ["GET /api/v1/ai/usage (OWNER/ADMIN)", "AI spend report — calls, tokens, estimated cost from AiUsageLog", "AiUsageReport"],
            ["POST /api/v1/ai/plan/daily (PRO+)", "Auto-scheduler: order tasks into a recommended day sequence", "AiDailyPlan"],
            ["POST /api/v1/ai/meetings/summarize (PRO+)", "Meeting details + notes → minutes + action items", "AiMeetingSummary"],
            ["POST /api/v1/ai/insights/weekly (BUSINESS+)", "Weekly productivity summary + burnout warnings", "AiWeeklyInsights"],
          ]}
        />
        <Prose>
          Every AI response is parsed with Zod before it is returned — LLM output
          is untrusted input and a malformed payload surfaces as{" "}
          <IC>AI_INVALID_RESPONSE</IC>. When Gemini is unavailable the backend
          degrades gracefully with a 503{" "}
          <IC>AI_SERVICE_UNAVAILABLE</IC> instead of crashing.
        </Prose>
        <Tip>
          The full contract types live in <IC>types/ai.types.ts</IC> on the
          client and <IC>src/modules/ai/ai.types.ts</IC> on the backend — keep
          them in sync when adding a feature.
        </Tip>
      </>
    ),
  },
  {
    id: "ai-quota",
    title: "Quota & tier-based rate limiting",
    summary:
      "Per-plan limits (burst/hourly/daily requests + daily/monthly tokens) enforced in Redis, keyed by workspace. 429 responses carry X-AI-RateLimit-* headers.",
    content: (
      <>
        <Prose>
          AI calls cost real money per token, so Focura uses plan-based limits
          defined in <IC>src/modules/ai/ai.types.ts</IC>{" "}
          (<IC>AI_PLAN_LIMITS</IC>). FREE gets 3 calls/minute and 60 calls/day;
          PRO and BUSINESS scale up. The middleware fails closed — if Redis is
          unreachable it rejects the call rather than silently spending money.
        </Prose>
        <Table
          headers={["Layer", "Key", "Mechanism"]}
          rows={[
            ["Burst", "focura:ai:rl:min:{wsId}", "Sorted-set sliding window (60 s)"],
            ["Hourly", "focura:ai:rl:hour:{wsId}", "Sorted-set sliding window (3 600 s)"],
            ["Daily quota", "focura:ai:q:daily:{date}:{wsId}", "INCR + EXPIRE (25 h grace)"],
            ["Monthly tokens", "focura:ai:q:month:{ym}:{wsId}", "INCRBY token count"],
          ]}
        />
        <Prose>
          Responses include <IC>X-AI-RateLimit-Plan</IC>,{" "}
          <IC>-Limit</IC>, <IC>-Remaining</IC> and <IC>-Reset</IC> headers, and
          the client reads <IC>GET /api/v1/ai/quota</IC> to render the{" "}
          <IC>AiQuotaBadge</IC>. On 429 with code{" "}
          <IC>AI_DAILY_QUOTA_EXCEEDED</IC> the UI shows an upgrade CTA instead of
          an error toast.
        </Prose>
        <Prose>
          On top of the request layers, every LLM call runs a{" "}
          <strong>hard monthly token pre-check</strong>: the worst-case cost of
          the call (estimated input + the plan&apos;s output cap) must fit inside
          the remaining monthly budget, or the call is rejected with 429{" "}
          <IC>AI_MONTHLY_QUOTA_EXCEEDED</IC> (fail-closed if the counter
          can&apos;t be read). Every successful call also writes an{" "}
          <IC>AiUsageLog</IC> row (feature, model, tokens, estimated cost) for
          billing reports — best-effort, never failing the request.
        </Prose>
        <Warn>
          Never bypass the middleware by calling Gemini directly from a new route
          — every AI route must sit behind <IC>aiAccess</IC> +{" "}
          <IC>aiRateLimit</IC>.
        </Warn>
      </>
    ),
  },
  {
    id: "ai-frontend",
    title: "Frontend integration",
    summary:
      "All AI hooks live in a single file (hooks/useAi.ts): useAiTaskSuggestions, useAiTaskBreakdown, useAiCommentAssist, useAiQuota, useAiDailyPlan, useAiMeetingSummary and useAiWeeklyInsights plus the query-key factory, wired into the task form, wellness page, comment editor, tasks page and meeting detail page.",
    content: (
      <>
        <SectionH>Hooks & components</SectionH>
        <RowList
          items={[
            { label: "useAi.ts", desc: "Single file with aiKeys + all seven hooks (suggestions, breakdown, comment assist, quota, daily plan, meeting summary, weekly insights)" },
            { label: "AiDailyPlan", desc: "Workspace tasks page card that reorders today's tasks (advisory only)" },
            { label: "AiMeetingSummary", desc: "Meeting detail card: notes → minutes + action items" },
            { label: "AiWeeklyInsights", desc: "Wellness card: weekly summary + burnout warnings (BUSINESS, pro model)" },
            { label: "AiUsageSection", desc: "Workspace-usage page: AI spend report with 7d/30d/90d periods — owners/admins only" },
            { label: "useAiUsageReport", desc: "Query for GET /api/v1/ai/usage; 403 for non-admin members" },
            { label: "useAiTaskBreakdown", desc: "Mutation that turns a goal into subtasks for the wellness page" },
            { label: "useAiCommentAssist", desc: "Mutation that rewrites a draft comment in a chosen tone" },
            { label: "useAiQuota", desc: "Query that powers AiQuotaBadge with remaining daily credits" },
            { label: "AiSuggestionBar", desc: "Chips rendered under the task-title field; one-click apply or ignore" },
            { label: "AiGoalBreakdown", desc: "Card on the wellness page that generates a Low/Med/High task plan" },
            { label: "AiCommentAssist", desc: "Toolbar in the comment editor (polish, shorten, friendly…)" },
            { label: "AiUpgradeCta", desc: "Inline upgrade prompt shown when the FREE quota is exhausted" },
          ]}
        />
        <CodeBlock label="hooks/useAi.ts (query-key factory)">{`export const aiKeys = {
  all: ["ai"] as const,
  quota: (scope: AiScope) =>
    ["ai", "quota", scope.workspaceId ?? "personal"] as const,
  autocomplete: (scope: AiScope, title: string, energyType?: string) =>
    ["ai", "autocomplete", scope.workspaceId ?? "personal", title, energyType ?? ""] as const,
  breakdown: ["ai", "breakdown"] as const,
  commentAssist: ["ai", "comment-assist"] as const,
};`}</CodeBlock>
        <Prose>
          The suggestion hook debounces the title, skips titles under 4
          characters, and dedupes identical calls through the query key. When a
          suggestion is accepted, the form applies the fields and queues any
          AI-suggested subtasks to be created right after the parent task.
        </Prose>
      </>
    ),
  },
  {
    id: "ai-testing",
    title: "Testing AI",
    summary:
      "Backend: unit tests for validators, rate limiter, service and Gemini client plus an integration test. Frontend: MSW handlers for /api/v1/ai/* and hook/component tests.",
    content: (
      <>
        <SectionH>Backend</SectionH>
        <RowList
          items={[
            { label: "ai.validators.test.ts", desc: "Input validation + LLM output parsing (malformed JSON → AI_INVALID_RESPONSE)" },
            { label: "ai.ratelimit.test.ts", desc: "Per-plan limits, 429 codes, headers, fail-closed Redis errors" },
            { label: "ai.service.test.ts", desc: "Prompt building, token accounting, dedupe cache hits" },
            { label: "gemini.client.test.ts", desc: "Graceful 503 when GEMINI_API_KEY is missing or the provider errors" },
            { label: "integrations/ai.test.ts", desc: "Full flow through the test app: auth → quota → feature endpoints" },
          ]}
        />
        <SectionH>Frontend</SectionH>
        <Prose>
          MSW handlers for all four AI endpoints live in{" "}
          <IC>tests/mock/handlers/ai.handlers.ts</IC> and are registered in{" "}
          <IC>tests/mock/handlers.ts</IC>. Hook tests render through{" "}
          <IC>createWrapper()</IC>, component tests assert chips, quota badges
          and the upgrade CTA. The axios mock in <IC>tests/setup.ts</IC>{" "}
          preserves status + response body so error-code branches (e.g.{" "}
          <IC>AI_DAILY_QUOTA_EXCEEDED</IC>) are testable.
        </Prose>
      </>
    ),
  },
  {
    id: "ai-add-feature",
    title: "Adding a new AI feature",
    summary:
      "Checklist: backend types → validator → service prompt → route → client hook → component → MSW handler → tests → docs.",
    content: (
      <>
        <SectionH>Checklist</SectionH>
        <RowList
          items={[
            { label: "1", desc: "Add the request/response types to src/modules/ai/ai.types.ts + types/ai.types.ts" },
            { label: "2", desc: "Write a Zod validator + a strict JSON system prompt in ai.validators.ts / ai.service.ts" },
            { label: "3", desc: "Register the route in ai.routes.ts behind aiAccess + aiRateLimit" },
            { label: "4", desc: "Add a plan-gated feature key (FREE/PRO/BUSINESS) in AI_PLAN_LIMITS" },
            { label: "5", desc: "Create a client hook + key factory + small component under components/AI/" },
            { label: "6", desc: "Add an MSW handler + hook/component tests" },
            { label: "7", desc: "Update GEMINI.md, AI_IMPLEMENTATION_GUIDE.md and the guides pages" },
          ]}
        />
        <Tip>
          Follow the three existing features as templates — they demonstrate the
          exact end-to-end pattern including graceful 503 handling.
        </Tip>
      </>
    ),
  },
];

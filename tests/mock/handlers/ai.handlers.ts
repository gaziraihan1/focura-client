// tests/mock/handlers/ai.handlers.ts
import { http, HttpResponse } from "msw";
import type {
  AiCommentAssist,
  AiDailyPlan,
  AiGoalBreakdown,
  AiMeetingSummary,
  AiQuota,
  AiTaskSuggestion,
  AiUsageReport,
  AiWeeklyInsights,
} from "@/types/ai.types";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const mockAiQuota: AiQuota = {
  plan: "FREE",
  dailyLimit: 60,
  usedToday: 3,
  remaining: 57,
  burstPerMinute: 3,
  hourly: 15,
  dailyTokens: 40_000,
  monthlyTokens: 500_000,
  maxOutputTokens: 512,
  tokensUsedToday: 1_200,
  tokensUsedThisMonth: 18_000,
  features: ["tasks.autocomplete", "goals.breakdown", "comments.assist"],
  resetAt: "2026-08-11T00:00:00.000Z",
  defaults: { daily: 60, monthlyTokens: 500_000, maxOutputTokens: 512 },
  overrides: {},
};

export const mockAiSuggestion: AiTaskSuggestion = {
  description: "Investigate and fix the redirect bug on mobile.",
  priority: "HIGH",
  estimatedHours: 2,
  dueDate: "2026-08-15",
  energyType: "MEDIUM",
  intent: "EXECUTION",
  subtasks: [{ title: "Reproduce locally" }, { title: "Deploy fix" }],
};

export const mockAiBreakdown: AiGoalBreakdown = {
  tasks: [
    { title: "Outline the blog structure", energyType: "LOW", estimatedHours: 1 },
    { title: "Write the first three posts", energyType: "MEDIUM", estimatedHours: 3 },
    { title: "Design and launch the site", energyType: "HIGH", estimatedHours: 4 },
  ],
  rationale: "Start small to build momentum.",
};

export const mockAiCommentAssist: AiCommentAssist = {
  text: "Could you please take a look at the pull request when you have a moment?",
};

export const mockAiDailyPlan: AiDailyPlan = {
  plan: [
    { taskId: "t1", order: 1, reason: "Urgent and due today — do it while your energy is high" },
    { taskId: "t2", order: 2, reason: "Low-energy filler for a lighter moment" },
  ],
  rationale: "Front-load the urgent work.",
};

export const mockAiMeetingSummary: AiMeetingSummary = {
  summary: "Team agreed on the Q3 roadmap and the budget deadline.",
  actionItems: [
    { text: "Draft the Q3 budget", assigneeEmail: "alice@example.com" },
    { text: "Follow up with design on the timeline" },
  ],
};

export const mockAiUsageReport: AiUsageReport = {
  workspaceId: "ws-1",
  days: 30,
  period: {
    start: "2026-07-11T00:00:00.000Z",
    end: "2026-08-10T00:00:00.000Z",
  },
  total: {
    calls: 12,
    inputTokens: 1800,
    outputTokens: 900,
    totalTokens: 2700,
    costUsd: 0.004,
  },
  byFeature: [
    { feature: "tasks.autocomplete", calls: 7, totalTokens: 1400, costUsd: 0.0014 },
    { feature: "goals.breakdown", calls: 3, totalTokens: 900, costUsd: 0.0027 },
    { feature: "comments.assist", calls: 2, totalTokens: 400, costUsd: 0.0004 },
  ],
  byModel: [
    { model: "lite", calls: 9, totalTokens: 1800, costUsd: 0.0018 },
    { model: "std", calls: 3, totalTokens: 900, costUsd: 0.0027 },
  ],
  recent: [
    {
      id: "l1",
      feature: "tasks.autocomplete",
      model: "lite",
      inputTokens: 60,
      outputTokens: 30,
      totalTokens: 90,
      costUsd: 0.00009,
      createdAt: "2026-08-09T10:00:00.000Z",
    },
    {
      id: "l2",
      feature: "goals.breakdown",
      model: "std",
      inputTokens: 300,
      outputTokens: 150,
      totalTokens: 450,
      costUsd: 0.00135,
      createdAt: "2026-08-08T09:30:00.000Z",
    },
  ],
};

export const mockAiWeeklyInsights: AiWeeklyInsights = {
  summary: "Strong week — 12 tasks completed and focus time held steady.",
  highlights: [
    { title: "12 tasks completed", detail: "up from 8 the week before" },
    { title: "4 focus sessions completed", detail: "9 hours of deep work" },
  ],
  risks: [
    { title: "Alice has 9 open tasks", detail: "highest workload on the team", severity: "high" },
    { title: "3 tasks overdue", detail: "due dates slipping on the design track", severity: "medium" },
  ],
};

export const aiHandlers = [
  http.get(`${BASE}/api/v1/ai/quota`, () =>
    HttpResponse.json({ success: true, data: mockAiQuota }),
  ),

  http.get(`${BASE}/api/v1/ai/usage`, () =>
    HttpResponse.json({ success: true, data: mockAiUsageReport }),
  ),

  http.post(`${BASE}/api/v1/ai/tasks/autocomplete`, () =>
    HttpResponse.json({ success: true, data: mockAiSuggestion }),
  ),

  http.post(`${BASE}/api/v1/ai/goals/breakdown`, () =>
    HttpResponse.json({ success: true, data: mockAiBreakdown }),
  ),

  http.post(`${BASE}/api/v1/ai/comments/assist`, () =>
    HttpResponse.json({ success: true, data: mockAiCommentAssist }),
  ),

  http.post(`${BASE}/api/v1/ai/plan/daily`, () =>
    HttpResponse.json({ success: true, data: mockAiDailyPlan }),
  ),

  http.post(`${BASE}/api/v1/ai/meetings/summarize`, () =>
    HttpResponse.json({ success: true, data: mockAiMeetingSummary }),
  ),

  http.post(`${BASE}/api/v1/ai/insights/weekly`, () =>
    HttpResponse.json({ success: true, data: mockAiWeeklyInsights }),
  ),
];

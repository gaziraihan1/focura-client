// tests/mock/handlers/automation.handlers.ts
import { http, HttpResponse } from "msw";
import type { AutomationRule } from "@/hooks/useAutomations";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const mockAutomationRule: AutomationRule = {
  id: "rule-1",
  workspaceId: "ws-1",
  projectId: null,
  name: "Auto-assign on review",
  triggerType: "STATUS_CHANGED",
  triggerConfig: { fromStatus: "IN_PROGRESS", toStatus: "IN_REVIEW" },
  actions: [{ type: "ASSIGN_USER", config: { role: "project-owner" } }],
  enabled: true,
  runCount: 3,
  lastRunAt: "2026-08-01T09:00:00.000Z",
  createdById: "user-1",
  createdAt: "2026-07-01T09:00:00.000Z",
  updatedAt: "2026-07-01T09:00:00.000Z",
};

export const automationHandlers = [
  http.get(`${BASE}/api/v1/automations`, () => {
    // The test axios mock strips query params, so the workspaceId filter is
    // ignored here and the same rules are returned for any request.
    return HttpResponse.json({ success: true, data: [mockAutomationRule] });
  }),

  http.post(`${BASE}/api/v1/automations`, async ({ request }) => {
    const body = (await request.json()) as Partial<AutomationRule>;
    return HttpResponse.json(
      {
        success: true,
        message: "Automation rule created",
        data: { ...mockAutomationRule, ...body, id: "rule-new" },
      },
      { status: 201 },
    );
  }),

  http.patch(`${BASE}/api/v1/automations/:id`, async ({ request }) => {
    const body = (await request.json()) as Partial<AutomationRule>;
    return HttpResponse.json({
      success: true,
      message: "Automation rule updated",
      data: { ...mockAutomationRule, ...body },
    });
  }),

  http.delete(`${BASE}/api/v1/automations/:id`, () => {
    return HttpResponse.json({
      success: true,
      message: "Automation rule deleted",
      data: { success: true },
    });
  }),

  http.get(`${BASE}/api/v1/automations/:id/runs`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: "run-1",
          action: "AUTOMATION_RUN",
          taskId: "task-1",
          metadata: { ruleName: "Auto-assign on review" },
          createdAt: "2026-08-01T09:00:00.000Z",
          user: { id: "user-1", name: "Test User" },
        },
      ],
    });
  }),
];

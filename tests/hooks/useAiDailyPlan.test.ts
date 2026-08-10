import { describe, it, expect } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createWrapper } from "../utils/renderWithProviders";
import { useAiDailyPlan } from "@/hooks/useAi";
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mock/server";

describe("useAiDailyPlan", () => {
  it("returns the ordered day plan", async () => {
    const { result } = renderHook(() => useAiDailyPlan(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        date: "2026-08-10",
        workspaceId: null,
        tasks: [
          { id: "t1", title: "Fix login bug", priority: "URGENT", energyType: "HIGH" },
          { id: "t2", title: "Reply to emails", priority: "LOW", energyType: "LOW" },
        ],
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.plan).toHaveLength(2);
    expect(result.current.data?.plan[0].taskId).toBe("t1");
    expect(result.current.data?.plan[0].order).toBe(1);
    expect(result.current.data?.rationale).toBeTruthy();
  });

  it("propagates quota errors so callers can show an upgrade CTA", async () => {
    server.use(
      http.post("*/api/v1/ai/plan/daily", () =>
        HttpResponse.json(
          {
            success: false,
            code: "AI_DAILY_QUOTA_EXCEEDED",
            message: "You've hit the free AI limit.",
            plan: "FREE",
            retryAfter: 3600,
          },
          { status: 429 },
        ),
      ),
    );

    const { result } = renderHook(() => useAiDailyPlan(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          date: "2026-08-10",
          tasks: [{ id: "t1", title: "A" }, { id: "t2", title: "B" }],
        });
      } catch {
        // expected
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

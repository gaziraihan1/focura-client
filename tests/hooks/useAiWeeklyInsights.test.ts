import { describe, it, expect } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createWrapper } from "../utils/renderWithProviders";
import { useAiWeeklyInsights } from "@/hooks/useAi";
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mock/server";

describe("useAiWeeklyInsights", () => {
  it("returns a summary, highlights and risks", async () => {
    const { result } = renderHook(() => useAiWeeklyInsights(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        workspaceId: "ws-1",
        week: "2026-08-03",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.summary).toContain("12 tasks completed");
    expect(result.current.data?.highlights).toHaveLength(2);
    expect(result.current.data?.risks[0].severity).toBe("high");
  });

  it("propagates quota errors so callers can show an upgrade CTA", async () => {
    server.use(
      http.post("*/api/v1/ai/insights/weekly", () =>
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

    const { result } = renderHook(() => useAiWeeklyInsights(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({ workspaceId: "ws-1" });
      } catch {
        // expected
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

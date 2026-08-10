import { describe, it, expect } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createWrapper } from "../utils/renderWithProviders";
import { useAiTaskBreakdown } from "@/hooks/useAi";
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mock/server";

describe("useAiTaskBreakdown", () => {
  it("returns the generated task plan", async () => {
    const { result } = renderHook(() => useAiTaskBreakdown(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        goal: "Launch a personal blog by the end of the month",
        workspaceId: null,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.tasks).toHaveLength(3);
    expect(result.current.data?.tasks[0].energyType).toBe("LOW");
    expect(result.current.data?.rationale).toBeTruthy();
  });

  it("propagates quota errors so callers can show an upgrade CTA", async () => {
    server.use(
      http.post("*/api/v1/ai/goals/breakdown", () =>
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

    const { result } = renderHook(() => useAiTaskBreakdown(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({ goal: "Build a bigger app" });
      } catch {
        // expected
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

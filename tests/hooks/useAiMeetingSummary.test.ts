import { describe, it, expect } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createWrapper } from "../utils/renderWithProviders";
import { useAiMeetingSummary } from "@/hooks/useAi";
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mock/server";

describe("useAiMeetingSummary", () => {
  it("returns minutes + action items", async () => {
    const { result } = renderHook(() => useAiMeetingSummary(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        meetingId: "m1",
        workspaceId: "ws-1",
        notes: "We need the budget by Friday.",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.summary).toContain("roadmap");
    expect(result.current.data?.actionItems).toHaveLength(2);
  });

  it("propagates quota errors so callers can show an upgrade CTA", async () => {
    server.use(
      http.post("*/api/v1/ai/meetings/summarize", () =>
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

    const { result } = renderHook(() => useAiMeetingSummary(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({ meetingId: "m1" });
      } catch {
        // expected
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

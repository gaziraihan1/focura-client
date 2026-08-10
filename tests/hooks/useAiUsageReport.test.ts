import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "../utils/renderWithProviders";
import { useAiUsageReport } from "@/hooks/useAi";
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mock/server";

describe("useAiUsageReport", () => {
  it("returns the workspace usage report", async () => {
    const { result } = renderHook(() => useAiUsageReport("ws-1", true, 30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.total.calls).toBe(12);
    expect(result.current.data?.byFeature[0].feature).toBe("tasks.autocomplete");
    expect(result.current.data?.recent).toHaveLength(2);
  });

  it("stays disabled without a workspaceId", async () => {
    const { result } = renderHook(() => useAiUsageReport(null, true, 30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it("propagates 403 so callers can hide the section", async () => {
    server.use(
      http.get("*/api/v1/ai/usage", () =>
        HttpResponse.json(
          {
            success: false,
            code: "FORBIDDEN",
            message: "AI usage is restricted to workspace owners and admins",
          },
          { status: 403 },
        ),
      ),
    );

    const { result } = renderHook(() => useAiUsageReport("ws-1", true, 30), {
      wrapper: createWrapper(),
    });

    // The hook retries once with backoff, so give the retry time to finish.
    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });
    expect(result.current.error).toBeDefined();
  });
});

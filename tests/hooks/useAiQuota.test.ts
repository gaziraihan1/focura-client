import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "../utils/renderWithProviders";
import { useAiQuota } from "@/hooks/useAi";
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mock/server";

describe("useAiQuota", () => {
  it("fetches the personal quota when no workspace is given", async () => {
    const { result } = renderHook(() => useAiQuota(null), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.plan).toBe("FREE");
    expect(result.current.data?.remaining).toBe(57);
    expect(result.current.data?.dailyLimit).toBe(60);
  });

  it("fetches the workspace quota when a workspaceId is given", async () => {
    const { result } = renderHook(() => useAiQuota("ws-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).not.toBeNull();
  });

  it("returns null when the endpoint reports no data", async () => {
    server.use(
      http.get("*/api/v1/ai/quota", () =>
        HttpResponse.json({ success: true, data: null }),
      ),
    );

    const { result } = renderHook(() => useAiQuota(null), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it("is not enabled when `enabled` is false", () => {
    const { result } = renderHook(() => useAiQuota(null, false), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});

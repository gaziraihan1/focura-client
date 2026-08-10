import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "../utils/renderWithProviders";
import { useAiTaskSuggestions } from "@/hooks/useAi";
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mock/server";

describe("useAiTaskSuggestions", () => {
  it("returns a suggestion once a long-enough title settles", async () => {
    const { result, rerender } = renderHook(
      ({ title }) =>
        useAiTaskSuggestions({ title, debounceMs: 0, workspaceId: null }),
      { wrapper: createWrapper(), initialProps: { title: "" } },
    );

    // Too short → no fetch happens.
    rerender({ title: "ab" });
    await waitFor(() => {
      expect(result.current.fetchStatus).toBe("idle");
    });

    rerender({ title: "Fix login redirect" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.priority).toBe("HIGH");
    expect(result.current.data?.description).toContain("redirect");
    expect(result.current.data?.subtasks).toHaveLength(2);
  });

  it("stays idle for short titles", () => {
    const { result } = renderHook(
      () => useAiTaskSuggestions({ title: "hi", debounceMs: 0 }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("does not refetch when the same title is re-submitted (query-key dedupe)", async () => {
    let calls = 0;
    server.use(
      http.post("*/api/v1/ai/tasks/autocomplete", () => {
        calls += 1;
        return HttpResponse.json({
          success: true,
          data: { description: "x", priority: null, estimatedHours: null, dueDate: null, energyType: null, intent: null, subtasks: [] },
        });
      }),
    );

    const { result, rerender } = renderHook(
      ({ title }) =>
        useAiTaskSuggestions({ title, debounceMs: 0, workspaceId: null }),
      { wrapper: createWrapper(), initialProps: { title: "Write tests" } },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    rerender({ title: "Write tests" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(calls).toBe(1);
  });
});

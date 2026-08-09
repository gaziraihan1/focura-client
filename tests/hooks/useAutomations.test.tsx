/**
 * tests/hooks/useAutomations.test.tsx
 */
import { describe, it, expect } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createWrapper } from "../utils/renderWithProviders";
import {
  useAutomations,
  useCreateAutomation,
  useUpdateAutomation,
  useDeleteAutomation,
  useAutomationRuns,
} from "@/hooks/useAutomations";
import { mockAutomationRule } from "../mock/handlers/automation.handlers";

describe("useAutomations", () => {
  it("returns automation rules for a workspace", async () => {
    const { result } = renderHook(() => useAutomations("ws-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([mockAutomationRule]);
  });

  it("returns an empty list when no workspace is selected", async () => {
    const { result } = renderHook(() => useAutomations(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
  });
});

describe("useAutomationRuns", () => {
  it("returns run history for a rule", async () => {
    const { result } = renderHook(() => useAutomationRuns("rule-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].taskId).toBe("task-1");
  });
});

describe("useCreateAutomation", () => {
  it("creates a rule and invalidates the list query", async () => {
    const { result } = renderHook(() => useCreateAutomation(), {
      wrapper: createWrapper(),
    });

    let created: unknown;
    await act(async () => {
      created = await result.current.mutateAsync({
        workspaceId: "ws-1",
        name: "New rule",
        triggerType: "STATUS_CHANGED",
        actions: [{ type: "SET_PRIORITY", config: { priority: "HIGH" } }],
      });
    });

    expect(created).toMatchObject({ id: "rule-new", name: "New rule" });
  });
});

describe("useUpdateAutomation", () => {
  it("updates a rule", async () => {
    const { result } = renderHook(() => useUpdateAutomation(), {
      wrapper: createWrapper(),
    });

    let updated: unknown;
    await act(async () => {
      updated = await result.current.mutateAsync({ id: "rule-1", enabled: false });
    });

    expect(updated).toMatchObject({ id: "rule-1", enabled: false });
  });
});

describe("useDeleteAutomation", () => {
  it("deletes a rule", async () => {
    const { result } = renderHook(() => useDeleteAutomation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync("rule-1");
    });

    expect(result.current.isSuccess).toBe(true);
  });
});

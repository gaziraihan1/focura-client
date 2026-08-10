import { describe, it, expect } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createWrapper } from "../utils/renderWithProviders";
import { useAiCommentAssist } from "@/hooks/useAi";

describe("useAiCommentAssist", () => {
  it("returns a rewritten comment for the chosen tone", async () => {
    const { result } = renderHook(() => useAiCommentAssist(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        text: "check pr pls",
        tone: "professional",
        workspaceId: null,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.text).toContain("pull request");
  });

  it("passes the workspaceId through to the endpoint", async () => {
    const { result } = renderHook(() => useAiCommentAssist(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        text: "nice work",
        tone: "friendly",
        workspaceId: "ws-1",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeTruthy();
  });
});

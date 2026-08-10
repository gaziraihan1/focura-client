import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "../utils/renderWithProviders";
import { useWorkspaceSlug } from "@/hooks/useAi";

describe("useWorkspaceSlug", () => {
  it("resolves the slug for a known workspace id", async () => {
    const { result } = renderHook(() => useWorkspaceSlug("ws-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current).toBe("test-ws"));
  });

  it("returns undefined for an unknown workspace id", async () => {
    const { result } = renderHook(() => useWorkspaceSlug("ws-missing"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current).toBeUndefined());
  });

  it("returns undefined when no workspace id is given", async () => {
    const { result } = renderHook(() => useWorkspaceSlug(null), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current).toBeUndefined());
  });
});

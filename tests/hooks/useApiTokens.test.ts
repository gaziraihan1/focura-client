/**
 * tests/hooks/useApiTokens.test.ts
 *
 * Tests for API token hooks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import {
  useApiTokens,
  useCreateApiToken,
  useDeleteApiToken,
  apiTokenKeys,
} from "@/hooks/useApiTokens";

// Mock axios
vi.mock("@/lib/axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import { api } from "@/lib/axios";

// Test wrapper
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe("useApiTokens", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch API tokens", async () => {
    const mockTokens = [
      { id: "1", name: "Test Token", prefix: "foc_abc12345", isActive: true },
    ];
    (api.get as any).mockResolvedValue({ success: true, data: mockTokens });

    const { result } = renderHook(() => useApiTokens(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTokens);
  });

  it("should handle error gracefully", async () => {
    (api.get as any).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useApiTokens(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Data is undefined on error (React Query default)
    expect(result.current.data).toBeUndefined();
  });
});

describe("useCreateApiToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new API token", async () => {
    const mockToken = {
      id: "1",
      name: "New Token",
      prefix: "foc_xyz789",
      token: "foc_xyz789fulltoken",
    };
    (api.post as any).mockResolvedValue({ success: true, data: mockToken });

    const { result } = renderHook(() => useCreateApiToken(), {
      wrapper: createWrapper(),
    });

    const created = await result.current.mutateAsync({ name: "New Token" });

    expect(created).toEqual(mockToken);
    expect(api.post).toHaveBeenCalledWith(
      "/api/v1/api-keys",
      { name: "New Token" },
      expect.any(Object)
    );
  });
});

describe("useDeleteApiToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete an API token", async () => {
    (api.delete as any).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useDeleteApiToken(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync("token-123");

    expect(api.delete).toHaveBeenCalledWith(
      "/api/v1/api-keys/token-123",
      expect.any(Object)
    );
  });
});

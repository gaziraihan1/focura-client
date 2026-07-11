import { describe, it, expect, beforeEach, vi } from "vitest";
import { getCsrfToken, invalidateCsrfToken } from "@/lib/csrf";

describe("csrf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    invalidateCsrfToken();
  });

  it("returns null when session has no backendToken", async () => {
    vi.spyOn(require("next-auth/react"), "getSession").mockResolvedValue({ backendToken: null });

    const result = await getCsrfToken();
    expect(result).toBeNull();
  });

  it("caches token across calls within TTL", async () => {
    const mockJson = vi.fn().mockResolvedValue({ data: { csrfToken: "cached-token" } });
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: mockJson });
    vi.stubGlobal("fetch", mockFetch);
    vi.spyOn(require("next-auth/react"), "getSession").mockResolvedValue({ backendToken: "..." });

    const first = await getCsrfToken();
    const second = await getCsrfToken();

    expect(first).toBe("cached-token");
    expect(second).toBe("cached-token");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("forceRefresh bypasses cache", async () => {
    let count = 0;
    const mockJson = vi.fn().mockImplementation(() => Promise.resolve({ data: { csrfToken: `token-${++count}` } }));
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: mockJson });
    vi.stubGlobal("fetch", mockFetch);
    vi.spyOn(require("next-auth/react"), "getSession").mockResolvedValue({ backendToken: "..." });

    await getCsrfToken();
    await getCsrfToken(true);

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("invalidates cache on explicit invalidation", async () => {
    const mockJson = vi.fn().mockResolvedValue({ data: { csrfToken: "xyz" } });
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: mockJson });
    vi.stubGlobal("fetch", mockFetch);
    vi.spyOn(require("next-auth/react"), "getSession").mockResolvedValue({ backendToken: "..." });

    await getCsrfToken();
    invalidateCsrfToken();
    await getCsrfToken();

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("returns null when fetch response is not ok", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    vi.stubGlobal("fetch", mockFetch);
    vi.spyOn(require("next-auth/react"), "getSession").mockResolvedValue({ backendToken: "..." });

    const result = await getCsrfToken();
    expect(result).toBeNull();
  });
});

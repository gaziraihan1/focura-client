// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("lib/auth/refresh", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.BACKEND_URL = "http://localhost:5000";
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
  });

  describe("silentRefresh", () => {
    it("returns tokens on successful refresh", async () => {
      const mockTokens = {
        accessToken: "new-at",
        refreshToken: "new-rt",
        sseToken: "new-sse",
        accessTokenExpiry: 1000,
        refreshTokenExpiry: 2000,
      };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockTokens),
        }),
      );

      const { silentRefresh } = await import("@/lib/auth/refresh");
      const result = await silentRefresh("sess-1", "old-rt");

      expect(result).toEqual({ ok: true, tokens: mockTokens });
    });

    it("returns failure with code when server rejects", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockResolvedValue({ code: "TOKEN_REVOKED" }),
        }),
      );

      const { silentRefresh } = await import("@/lib/auth/refresh");
      const result = await silentRefresh("sess-1", "old-rt");

      expect(result).toEqual({ ok: false, code: "TOKEN_REVOKED" });
    });

    it("returns failure without code on non-JSON error body", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockRejectedValue(new Error("Not JSON")),
        }),
      );

      const { silentRefresh } = await import("@/lib/auth/refresh");
      const result = await silentRefresh("sess-1", "old-rt");

      expect(result).toEqual({ ok: false, code: undefined });
    });

    it("returns failure on network error", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("Network error")),
      );

      const { silentRefresh } = await import("@/lib/auth/refresh");
      const result = await silentRefresh("sess-1", "old-rt");

      expect(result).toEqual({ ok: false });
    });

    it("deduplicates concurrent refresh attempts for same session", async () => {
      let callCount = 0;
      vi.stubGlobal(
        "fetch",
        vi.fn().mockImplementation(async () => {
          callCount++;
          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 10));
          return {
            ok: true,
            json: vi.fn().mockResolvedValue({
              accessToken: "at",
              refreshToken: "rt",
              sseToken: "sse",
              accessTokenExpiry: 1000,
              refreshTokenExpiry: 2000,
            }),
          };
        }),
      );

      const { silentRefresh } = await import("@/lib/auth/refresh");

      // Launch 3 concurrent refreshes for the same session
      const [r1, r2, r3] = await Promise.all([
        silentRefresh("sess-1", "rt-1"),
        silentRefresh("sess-1", "rt-2"),
        silentRefresh("sess-1", "rt-3"),
      ]);

      // Only 1 fetch should have been made
      expect(callCount).toBe(1);
      // All 3 should get the same result
      expect(r1.ok).toBe(true);
      expect(r2.ok).toBe(true);
      expect(r3.ok).toBe(true);
    });

    it("sends correct request body", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      });
      vi.stubGlobal("fetch", mockFetch);

      const { silentRefresh } = await import("@/lib/auth/refresh");
      await silentRefresh("sess-1", "refresh-token-123");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/auth/refresh",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: "refresh-token-123" }),
        }),
      );
    });

    it("cleans up lock after completion", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({}),
        }),
      );

      const { silentRefresh } = await import("@/lib/auth/refresh");
      await silentRefresh("sess-1", "rt");

      // Second call should NOT be deduped (lock was cleaned up)
      let callCount = 0;
      vi.stubGlobal(
        "fetch",
        vi.fn().mockImplementation(async () => {
          callCount++;
          return {
            ok: true,
            json: vi.fn().mockResolvedValue({}),
          };
        }),
      );

      await silentRefresh("sess-1", "rt");
      expect(callCount).toBe(1);
    });
  });
});

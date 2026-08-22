// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("crypto", () => ({
  default: {
    createHmac: vi.fn(() => ({
      update: vi.fn().mockReturnThis(),
      digest: vi.fn().mockReturnValue("mock-hmac-signature"),
    })),
  },
}));

describe("lib/auth/bridge", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXTAUTH_SECRET = "test-secret";
    process.env.BACKEND_URL = "http://localhost:5000";
    process.env.NODE_ENV = "development"; // not "test" so calls go through
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
  });

  describe("callInternal", () => {
    it("returns null in test environment", async () => {
      process.env.NODE_ENV = "test";

      const { callInternal } = await import("@/lib/auth/bridge");
      const result = await callInternal("/audit", { event: "LOGIN_SUCCESS" });

      expect(result).toBeNull();
    });

    it("returns data on successful call", async () => {
      const mockData = { success: true, attempts: 3 };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockData),
        }),
      );

      const { callInternal } = await import("@/lib/auth/bridge");
      const result = await callInternal("/failed-attempt", { email: "test@test.com" });

      expect(result).toEqual(mockData);
    });

    it("returns null when response is not ok", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
        }),
      );

      const { callInternal } = await import("@/lib/auth/bridge");
      const result = await callInternal("/audit", { event: "LOGIN_FAILED" });

      expect(result).toBeNull();
    });

    it("returns null on network error", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("Network error")),
      );

      const { callInternal } = await import("@/lib/auth/bridge");
      const result = await callInternal("/audit", { event: "LOGIN_FAILED" });

      expect(result).toBeNull();
    });

    it("sends correct request with HMAC signature", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      });
      vi.stubGlobal("fetch", mockFetch);

      const { callInternal } = await import("@/lib/auth/bridge");
      await callInternal("/audit", { event: "LOGIN_SUCCESS", email: "test@test.com" });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/internal/audit",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: expect.any(AbortSignal),
        }),
      );

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body).toMatchObject({
        event: "LOGIN_SUCCESS",
        email: "test@test.com",
      });
      expect(body).toHaveProperty("timestamp");
      expect(body).toHaveProperty("signature", "mock-hmac-signature");
    });

    it("defaults to http://localhost:5000 when BACKEND_URL is not set", async () => {
      delete process.env.BACKEND_URL;
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      });
      vi.stubGlobal("fetch", mockFetch);

      vi.resetModules();
      const { callInternal } = await import("@/lib/auth/bridge");
      await callInternal("/audit", { event: "TEST" });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/internal/audit",
        expect.anything(),
      );
    });

    it("has 4 second timeout", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      });
      vi.stubGlobal("fetch", mockFetch);

      const { callInternal } = await import("@/lib/auth/bridge");
      await callInternal("/audit", { event: "TEST" });

      const signal = mockFetch.mock.calls[0][1].signal;
      expect(signal).toBeInstanceOf(AbortSignal);
    });
  });

  describe("recordLoginFailure", () => {
    it("returns lock status from backend", async () => {
      const mockResult = { locked: false, attempts: 2 };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockResult),
        }),
      );

      const { recordLoginFailure } = await import("@/lib/auth/bridge");
      const result = await recordLoginFailure("test@test.com");

      expect(result).toEqual(mockResult);
    });

    it("returns null when backend is unavailable", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("Connection refused")),
      );

      const { recordLoginFailure } = await import("@/lib/auth/bridge");
      const result = await recordLoginFailure("test@test.com");

      expect(result).toBeNull();
    });

    it("fires audit event after recording failure", async () => {
      let fetchCallCount = 0;
      const mockFetch = vi.fn().mockImplementation(async () => {
        fetchCallCount++;
        return {
          ok: true,
          json: vi.fn().mockResolvedValue({ attempts: 3 }),
        };
      });
      vi.stubGlobal("fetch", mockFetch);

      const { recordLoginFailure } = await import("@/lib/auth/bridge");
      await recordLoginFailure("test@test.com");

      // Should make 2 calls: /failed-attempt + /audit
      expect(fetchCallCount).toBe(2);

      // First call: /failed-attempt
      expect(mockFetch.mock.calls[0][0]).toContain("/failed-attempt");

      // Second call: /audit
      expect(mockFetch.mock.calls[1][0]).toContain("/audit");
      const auditBody = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(auditBody.event).toBe("LOGIN_FAILED");
      expect(auditBody.meta.attempts).toBe(3);
    });

    it("handles null result from failed-attempt gracefully", async () => {
      let callCount = 0;
      const mockFetch = vi.fn().mockImplementation(async (url: string) => {
        callCount++;
        if (callCount === 1) {
          // failed-attempt returns null
          return { ok: false, status: 500 };
        }
        // audit returns ok
        return { ok: true, json: vi.fn().mockResolvedValue({}) };
      });
      vi.stubGlobal("fetch", mockFetch);

      const { recordLoginFailure } = await import("@/lib/auth/bridge");
      const result = await recordLoginFailure("test@test.com");

      expect(result).toBeNull();
      // Audit should still fire with 0 attempts
      const auditBody = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(auditBody.meta.attempts).toBe(0);
    });
  });
});

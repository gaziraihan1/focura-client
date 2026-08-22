// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("crypto", () => ({
  default: {
    createHmac: vi.fn(() => ({
      update: vi.fn().mockReturnThis(),
      digest: vi.fn().mockReturnValue("mock-signature-123"),
    })),
  },
}));

describe("lib/auth/exchange", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXTAUTH_SECRET = "test-secret";
    process.env.BACKEND_URL = "http://localhost:5000";
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
  });

  describe("createExchangeProof", () => {
    it("returns timestamp and signature", async () => {
      const { createExchangeProof } = await import("@/lib/auth/exchange");
      const result = createExchangeProof("user-1", "test@test.com", "USER", "sess-1");

      expect(result).toHaveProperty("timestamp");
      expect(result).toHaveProperty("signature", "mock-signature-123");
      expect(typeof result.timestamp).toBe("number");
    });

    it("creates HMAC with NEXTAUTH_SECRET", async () => {
      const crypto = await import("crypto");
      const { createExchangeProof } = await import("@/lib/auth/exchange");

      createExchangeProof("user-1", "test@test.com", "USER", "sess-1");

      expect(crypto.default.createHmac).toHaveBeenCalledWith("sha256", "test-secret");
    });
  });

  describe("exchangeForTokens", () => {
    it("returns tokens on successful exchange", async () => {
      const mockTokens = {
        accessToken: "at-123",
        refreshToken: "rt-123",
        sseToken: "sse-123",
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

      const { exchangeForTokens } = await import("@/lib/auth/exchange");
      const result = await exchangeForTokens(
        { id: "user-1", email: "test@test.com", role: "USER" },
        "sess-1",
      );

      expect(result).toEqual(mockTokens);
    });

    it("returns null when response is not ok", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 401,
        }),
      );

      const { exchangeForTokens } = await import("@/lib/auth/exchange");
      const result = await exchangeForTokens(
        { id: "user-1", email: "test@test.com", role: "USER" },
        "sess-1",
      );

      expect(result).toBeNull();
    });

    it("returns null on network error", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("Network error")),
      );

      const { exchangeForTokens } = await import("@/lib/auth/exchange");
      const result = await exchangeForTokens(
        { id: "user-1", email: "test@test.com", role: "USER" },
        "sess-1",
      );

      expect(result).toBeNull();
    });

    it("sends correct request body", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      });
      vi.stubGlobal("fetch", mockFetch);

      const { exchangeForTokens } = await import("@/lib/auth/exchange");
      await exchangeForTokens(
        { id: "user-1", email: "test@test.com", role: "USER" },
        "sess-1",
      );

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/auth/exchange",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      );

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body).toMatchObject({
        userId: "user-1",
        email: "test@test.com",
        role: "USER",
        sessionId: "sess-1",
      });
      expect(body).toHaveProperty("timestamp");
      expect(body).toHaveProperty("signature");
    });

    it("defaults to http://localhost:5000 when BACKEND_URL is not set", async () => {
      delete process.env.BACKEND_URL;
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      });
      vi.stubGlobal("fetch", mockFetch);

      // Re-import to pick up the env change
      vi.resetModules();
      const { exchangeForTokens } = await import("@/lib/auth/exchange");
      await exchangeForTokens(
        { id: "user-1", email: "test@test.com", role: "USER" },
        "sess-1",
      );

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/auth/exchange",
        expect.anything(),
      );
    });
  });
});

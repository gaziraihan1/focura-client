import { vi } from "vitest";

const mockSignOut = vi.fn();
const mockStopBackgroundRefresh = vi.fn();
const mockGetSession = vi.fn().mockResolvedValue(null);

vi.mock("next-auth/react", () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
  getSession: (...args: unknown[]) => mockGetSession(...args),
}));

vi.mock("@/lib/axios", () => ({
  stopBackgroundRefresh: (...args: unknown[]) => mockStopBackgroundRefresh(...args),
}));

import { logout } from "@/lib/auth/logout";

describe("auth/logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue(null);
  });

  it("calls backend logout endpoint with default options", async () => {
    (global as { fetch: typeof fetch }).fetch = vi.fn(() =>
      Promise.resolve({ ok: true })
    ) as unknown as typeof fetch;

    await logout();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/auth/logout"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoutAll: false }),
      }
    );
    expect(mockStopBackgroundRefresh).toHaveBeenCalled();
  });

  it("attaches the Bearer token from the session when present", async () => {
    mockGetSession.mockResolvedValue({ backendToken: "access-token-123" });
    (global as { fetch: typeof fetch }).fetch = vi.fn(() =>
      Promise.resolve({ ok: true })
    ) as unknown as typeof fetch;

    await logout();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/auth/logout"),
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer access-token-123",
        },
      })
    );
  });

  it("passes logoutAll=true when requested", async () => {
    (global as { fetch: typeof fetch }).fetch = vi.fn(() =>
      Promise.resolve({ ok: true })
    ) as unknown as typeof fetch;

    await logout(true);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/auth/logout"),
      expect.objectContaining({
        body: JSON.stringify({ logoutAll: true }),
      })
    );
    expect(mockStopBackgroundRefresh).toHaveBeenCalled();
  });

  it("continues to signOut even if backend logout fails", async () => {
    (global as { fetch: typeof fetch }).fetch = vi.fn(() =>
      Promise.reject(new Error("network"))
    ) as unknown as typeof fetch;

    await logout();

    expect(mockSignOut).toHaveBeenCalledWith({
      callbackUrl: "/authentication/login",
      redirect: true,
    });
    expect(mockStopBackgroundRefresh).toHaveBeenCalled();
  });
});

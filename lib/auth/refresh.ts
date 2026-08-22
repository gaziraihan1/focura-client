// ─────────────────────────────────────────────────────────────────────────────
// Auth — Silent token refresh with dedup locks
// ─────────────────────────────────────────────────────────────────────────────

import type { TokenResponse, RefreshResult } from "./types";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

// Dedup concurrent refresh attempts for the same session.
const refreshLocks = new Map<string, Promise<RefreshResult>>();

export async function silentRefresh(
  sessionId: string,
  refreshToken: string,
): Promise<RefreshResult> {
  const existing = refreshLocks.get(sessionId);
  if (existing) return existing.catch(() => ({ ok: false } as RefreshResult));

  let resolve!: (value: RefreshResult) => void;

  const promise = new Promise<RefreshResult>((res) => {
    resolve = res;
  });

  refreshLocks.set(sessionId, promise);

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (res.ok) {
      const tokens: TokenResponse = await res.json();
      const result: RefreshResult = { ok: true, tokens };
      resolve(result);
      return result;
    }

    // Surface the server's rejection code (TOKEN_REVOKED, SESSION_TIMEOUT,
    // TOKEN_REPLAY_DETECTED, INVALID_TOKEN, TOKEN_EXPIRED, …) so the jwt
    // callback can distinguish a dead session from a transient blip.
    let code: string | undefined;
    try {
      const body = (await res.json()) as { code?: string };
      code = body?.code;
    } catch {
      // non-JSON error body — leave code undefined (treated as transient)
    }
    const result: RefreshResult = { ok: false, code };
    resolve(result);
    return result;
  } catch {
    // Network error / timeout — transient; never force-logout on this.
    const result: RefreshResult = { ok: false };
    resolve(result);
    return result;
  } finally {
    refreshLocks.delete(sessionId);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth — Internal backend bridge (login audit + account lockout)
// ─────────────────────────────────────────────────────────────────────────────
// The credentials check lives in Next.js, but the Redis-backed account
// lockout and the audit log live in the Express backend. These calls are
// strictly best-effort: they must never block or break a login.

import crypto from "crypto";
import type { FailedAttemptResult } from "./types";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function callInternal<T = Record<string, unknown>>(
  path: string,
  fields: Record<string, unknown>,
): Promise<T | null> {
  // Unit tests have no backend to talk to — skip the network call entirely.
  if (process.env.NODE_ENV === "test") return null;
  try {
    const timestamp = Date.now();
    // Same HMAC scheme as the /exchange proof: signed with NEXTAUTH_SECRET,
    // the shared secret the backend already uses to verify exchange requests.
    const signature = crypto
      .createHmac("sha256", process.env.NEXTAUTH_SECRET!)
      .update(JSON.stringify(fields))
      .digest("hex");
    const res = await fetch(`${BACKEND_URL}/api/v1/internal${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, timestamp, signature }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // never fail a login over an internal audit/lockout call
  }
}

/** Record a failed login with the backend and surface the lock status (if any). */
export async function recordLoginFailure(
  email: string,
): Promise<FailedAttemptResult | null> {
  const result = await callInternal<FailedAttemptResult>("/failed-attempt", {
    email,
  });
  void callInternal("/audit", {
    event: "LOGIN_FAILED",
    email,
    reason: "Invalid credentials",
    meta: { attempts: result?.attempts ?? 0 },
  });
  return result;
}

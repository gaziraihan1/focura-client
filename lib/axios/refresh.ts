import { getSession } from "next-auth/react";
import { broadcastAuthEvent } from "./broadcast";
import type { AppSession } from "./types";

// ─── Session fetch (deduped) ──────────────────────────────────────────────────
// Refetches the NextAuth session at most once per tick; concurrent callers
// share the same promise.

let sessionPromise: Promise<AppSession | null> | null = null;
export async function getFreshSession(): Promise<AppSession | null> {
  if (!sessionPromise) {
    sessionPromise = getSession().finally(() => {
      sessionPromise = null;
    }) as Promise<AppSession | null>;
  }
  return sessionPromise;
}

// ─── Token cache ──────────────────────────────────────────────────────────────

const TOKEN_CACHE_TTL = 10 * 60 * 1000;
export let cachedBackendToken: string | null = null;
export let cachedTokenExpiry = 0;

export function invalidateTokenCache(): void {
  cachedBackendToken = null;
  cachedTokenExpiry = 0;
}

/**
 * Set the cached backend token and its expiry. Cross-module writes must go
 * through this accessor — ES modules forbid assigning to imported bindings.
 */
export function setCachedBackendToken(
  token: string | null,
  now = Date.now(),
): void {
  cachedBackendToken = token;
  cachedTokenExpiry = token ? now + TOKEN_CACHE_TTL : 0;
}

// ─── Request Queue During Refresh ────────────────────────────────────────────
// When a refresh is in progress, queue requests and replay them after refresh
// completes. This prevents thundering herd on token expiry.

type QueuedRequest = {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
};

let requestQueue: QueuedRequest[] = [];
export let refreshPromise: Promise<boolean> | null = null;

export function queueRequest(): Promise<string> {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject });
  });
}

function flushRequestQueue(token: string): void {
  const queue = requestQueue;
  requestQueue = [];
  queue.forEach(({ resolve }) => resolve(token));
}

function rejectRequestQueue(error: Error): void {
  const queue = requestQueue;
  requestQueue = [];
  queue.forEach(({ reject }) => reject(error));
}

// ─── Proactive Background Token Refresh ─────────────────────────────────────────

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
export let isRefreshing = false;

function clearRefreshTimer(): void {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

export function scheduleBackgroundRefresh(tokenExpiry: number): void {
  clearRefreshTimer();

  // NextAuth's jwt callback rotates the backend pair only when the token is
  // within 60s of expiry, so firing earlier just yields a redundant session
  // fetch. Schedule at the 60s mark with a 15s floor so a failed refresh
  // cannot produce a tight immediate-refire loop.
  const refreshAt = tokenExpiry - 60_000;
  const delay = Math.max(15_000, refreshAt - Date.now());

  refreshTimer = setTimeout(() => {
    attemptBackgroundRefresh();
  }, delay);
}

/**
 * A refresh only counts as success when the backend actually ROTATED the pair.
 * On a transient failure the NextAuth jwt callback keeps the previous (possibly
 * already expired) access token, so a non-empty backendToken is NOT proof of
 * success — handing that stale token out would retry with a dead token and then
 * force-logout an active user. Returns true only when a new token was minted.
 */
async function attemptBackgroundRefresh(
  failedToken?: string | null,
): Promise<boolean> {
  if (isRefreshing) return false;
  isRefreshing = true;

  // Broadcast refresh start to other tabs
  broadcastAuthEvent({ type: "refresh-start" });

  try {
    const previousToken = cachedBackendToken;

    // Fetching a fresh session re-runs NextAuth's jwt callback, which
    // silently rotates the backend token pair when the access token is
    // within 60s of expiry (the refresh token lives in the httpOnly session
    // cookie — the client never sees it). The returned session already
    // carries the rotated access token.
    const session = await getFreshSession();
    const newToken = session?.backendToken;

    // Rotation happened: the session returned a token that is neither the one
    // we had cached nor the one that just failed.
    const rotated =
      !!newToken &&
      newToken.length > 10 &&
      !!session?.backendTokenExpiry &&
      newToken !== previousToken &&
      newToken !== failedToken;

    if (rotated) {
      setCachedBackendToken(newToken);
      scheduleBackgroundRefresh(session.backendTokenExpiry);
      broadcastAuthEvent({ type: "refresh-complete", tokenExpiry: session.backendTokenExpiry });
      // Flush queued requests with the new token
      flushRequestQueue(newToken);
      return true;
    }

    // Refresh failed (transient blip, or genuinely dead session). Never hand
    // out a stale token — reject queued requests so callers decide instead of
    // retrying with a token that cannot authenticate.
    rejectRequestQueue(new Error("Token refresh failed"));
    return false;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

/** Join the in-flight refresh (or start one) and await its outcome. */
export function startTokenRefresh(
  failedToken?: string | null,
): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = attemptBackgroundRefresh(failedToken);
  }
  return refreshPromise;
}

/**
 * Stop the refresh scheduler (timer + in-flight flag). Session/activity
 * timers are the caller's responsibility — see stopBackgroundRefresh in
 * session.ts, which composes this with the session-side teardown.
 */
export function stopRefreshScheduler(): void {
  clearRefreshTimer();
  isRefreshing = false;
}

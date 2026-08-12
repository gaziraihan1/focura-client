import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { getSession, signOut } from "next-auth/react";
import { logout } from "./auth/logout";
import type { Session } from "next-auth";
import { getCsrfToken, invalidateCsrfToken } from "./csrf";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

interface AppSession extends Session {
  backendToken: string;
  backendTokenExpiry: number;
}

export interface AppError {
  message: string;
  status?: number;
  code?: string;
  response?: {
    data?: { code?: string; message?: string };
    status?: number;
  };
}

export interface ApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  params?: Record<string, unknown>;
  /** Request body for methods that support it (e.g. DELETE with re-auth payload). */
  data?: unknown;
}

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  code?: string;
  reason?: string;
  bannedAt?: string;
  retryAfter?: number;
  errors?: { field: string; message: string }[];
  required?: string[];
}

// ─── Error codes ──────────────────────────────────────────────────────────────

/** Codes that mean the session is dead and the user must re-login */
const TERMINAL_AUTH_CODES = new Set([
  "TOKEN_EXPIRED",
  "INVALID_TOKEN",
  "INVALID_TOKEN_TYPE",
  "TOKEN_VERSION_MISMATCH",
  "TOKEN_REVOKED",
  "TOKEN_REPLAY_DETECTED",
  "SESSION_HIJACK_DETECTED",
  "USER_NOT_FOUND",
  "PROOF_EXPIRED",
  "INVALID_PROOF",
  "SESSION_TIMEOUT",
  "NOT_AUTHENTICATED",
]);

/** Codes the interceptor handles internally — don't show a toast for these */
const INTERCEPTOR_HANDLED_CODES = new Set([
  "TOKEN_EXPIRED",
  "CSRF_VALIDATION_FAILED",
  "REFRESH_IN_PROGRESS",
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function normalizeError(error: unknown): AppError {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      code: error.response?.data?.code,
    };
  }
  if (error instanceof Error) return { message: error.message };
  return { message: "Unknown error" };
}

let sessionPromise: Promise<AppSession | null> | null = null;
export async function getFreshSession(): Promise<AppSession | null> {
  if (!sessionPromise) {
    sessionPromise = getSession().finally(() => {
      sessionPromise = null;
    }) as Promise<AppSession | null>;
  }
  return sessionPromise;
}

// ─── Request Queue During Refresh ────────────────────────────────────────────
// When a refresh is in progress, queue requests and replay them after refresh
// completes. This prevents thundering herd on token expiry.

type QueuedRequest = {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
};

let requestQueue: QueuedRequest[] = [];
let refreshPromise: Promise<boolean> | null = null;

function queueRequest(): Promise<string> {
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

// ─── BroadcastChannel for Multi-Tab Coordination ──────────────────────────────────
// Per FRONTEND_AUTH_GUIDE.md Pitfall 6: coordinate refresh across tabs

interface AuthBroadcastEvent {
  type: "refresh-start" | "refresh-complete" | "logout-all";
  tokenExpiry?: number;
  timestamp?: number;
}

const authChannel = typeof BroadcastChannel !== "undefined"
  ? new BroadcastChannel("focura-auth")
  : null;

function broadcastAuthEvent(event: AuthBroadcastEvent): void {
  if (authChannel) {
    authChannel.postMessage({ ...event, timestamp: Date.now() });
  }
}

// Listen for events from other tabs
if (authChannel) {
  authChannel.onmessage = (ev: MessageEvent<AuthBroadcastEvent>) => {
    const { type, tokenExpiry } = ev.data;
    
    switch (type) {
      case "refresh-start": {
        // Another tab started refresh - wait for completion
        if (isRefreshing) return; // Already refreshing
        break;
      }
      case "refresh-complete": {
        if (tokenExpiry) {
          // Another tab completed refresh - update our token and reschedule
          invalidateTokenCache();
          if (tokenExpiry) {
            scheduleBackgroundRefresh(tokenExpiry);
          }
        }
        break;
      }
      case "logout-all": {
        // Another tab requested logout
        stopBackgroundRefresh();
        stopSessionTimers();
        invalidateTokenCache();
        // Force logout will be handled by the tab that initiated it
        break;
      }
    }
  };
}

// Initialize tab ID
// const refreshTabId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (authChannel) {
      authChannel.close();
    }
  });
}

// ─── Helper functions ──────────────────────────────────────────────────────────────

/**
 * Public marketing pages (templates, pricing, …) must never surface
 * authentication-related messages. If the session dies while a user is
 * browsing one, silently clear client state and let them keep browsing;
 * the next protected-page visit redirects to login via DashboardShell.
 */
function isPublicPage(pathname: string): boolean {
  return (
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/admin-dashboard") &&
    !pathname.startsWith("/authentication")
  );
}

/** Awaits both NextAuth sign-out and backend logout, then redirects */
async function forceLogout(reason = "Session expired. Please login again."): Promise<never> {
  // A hidden tab must never kill a session the user is actively using in
  // another tab. Defer the logout; handleVisibilityChange re-syncs with the
  // live session when the tab becomes visible again.
  if (typeof document !== "undefined" && document.visibilityState === "hidden") {
    stopSessionTimers();
    return Promise.reject(new Error("SESSION_EXPIRED_DEFERRED"));
  }

  // Public pages: stay silent — no toast, no redirect, no cross-tab logout.
  // Clearing the NextAuth session client-side makes useSession() flip to
  // "unauthenticated" so the next dashboard visit redirects to login.
  if (typeof window !== "undefined" && isPublicPage(window.location.pathname)) {
    stopBackgroundRefresh();
    stopSessionTimers();
    invalidateTokenCache();
    await signOut({ redirect: false }).catch(() => {});
    return Promise.reject(new Error("SESSION_EXPIRED"));
  }

  // Broadcast logout to other tabs before cleaning up
  broadcastAuthEvent({ type: "logout-all" });
  
  stopBackgroundRefresh();
  stopSessionTimers();
  toast.error(reason);
  await Promise.allSettled([
    logout(),
    signOut({ callbackUrl: "/authentication/login" }),
  ]);
  // signOut will redirect; this return is just for TS
  return Promise.reject(new Error("SESSION_EXPIRED"));
}

// ─── Axios instance ───────────────────────────────────────────────────────────

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) throw new Error("API_BASE_URL is not set");

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  // Per FRONTEND_AUTH_GUIDE.md §13: use Authorization header, not cookies.
  // withCredentials must stay false so the NextAuth session cookie is not
  // sent on API calls (backend authenticates via Bearer token only).
  withCredentials: false,
});

// ─── Proactive Background Token Refresh ─────────────────────────────────────────

// ─── Session Timeout Management (Inactivity + Absolute) ──────────────────────────
// Per guide: 30 min inactivity timeout, 7 days absolute timeout

// Inactivity is aligned with the absolute lifetime (7 days) so users are
// never logged out while browsing the site; the 7-day absolute cap ends it.
const INACTIVITY_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days (matches backend SESSION_INACTIVITY_TIMEOUT)
const INACTIVITY_WARNING_TIME = 5 * 60 * 1000; // Warn 5 min before logout
const ABSOLUTE_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days
const ABSOLUTE_WARNING_TIME = 60 * 60 * 1000; // Warn 1 hour before absolute timeout

let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
let inactivityWarningTimer: ReturnType<typeof setTimeout> | null = null;
let absoluteTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
let absoluteWarningTimer: ReturnType<typeof setTimeout> | null = null;

function clearInactivityTimers(): void {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
  if (inactivityWarningTimer) {
    clearTimeout(inactivityWarningTimer);
    inactivityWarningTimer = null;
  }
}

function clearAbsoluteTimers(): void {
  if (absoluteTimeoutTimer) {
    clearTimeout(absoluteTimeoutTimer);
    absoluteTimeoutTimer = null;
  }
  if (absoluteWarningTimer) {
    clearTimeout(absoluteWarningTimer);
    absoluteWarningTimer = null;
  }
}

function clearAllSessionTimers(): void {
  clearInactivityTimers();
  clearAbsoluteTimers();
}

function scheduleInactivityLogout(): void {
  clearInactivityTimers();

  // Warning at 25 minutes (5 min before logout)
  inactivityWarningTimer = setTimeout(() => {
    toast.error("Your session will expire in 5 minutes due to inactivity.", { duration: 10000 });
  }, INACTIVITY_TIMEOUT - INACTIVITY_WARNING_TIME);

  // Actual logout at 30 minutes
  inactivityTimer = setTimeout(() => {
    forceLogout("Session expired due to inactivity. Please login again.");
  }, INACTIVITY_TIMEOUT);
}

function scheduleAbsoluteTimeout(): void {
  clearAbsoluteTimers();

  // Warning at 6 days 23 hours (1 hour before absolute timeout)
  absoluteWarningTimer = setTimeout(() => {
    toast.error("Your session will expire in 1 hour. Please log in again to continue.", { duration: 15000 });
  }, ABSOLUTE_TIMEOUT - ABSOLUTE_WARNING_TIME);

  // Actual logout at 7 days
  absoluteTimeoutTimer = setTimeout(() => {
    forceLogout("Session expired (7-day limit reached). Please login again.");
  }, ABSOLUTE_TIMEOUT);
}

function resetActivityTimers(): void {
  scheduleInactivityLogout();
}

function initializeSessionTimers(tokenExpiry: number): void {
  // Initialize absolute timeout based on session start
  // We estimate session start from token expiry (access token = 15 min, so session started ~15 min ago)
  const estimatedSessionStart = tokenExpiry - 15 * 60 * 1000;

  // Store for potential future use (e.g., debugging, session analytics)
  void estimatedSessionStart;

  // Inactivity is aligned with the absolute lifetime (7 days), so running
  // both timers would fire duplicate warnings at the 7-day mark. Only run
  // the inactivity timer when it is meaningfully shorter than the cap.
  if (INACTIVITY_TIMEOUT < ABSOLUTE_TIMEOUT) {
    scheduleInactivityLogout();
  }
  scheduleAbsoluteTimeout();
}

export function updateActivity(): void {
  resetActivityTimers();
}

export function stopSessionTimers(): void {
  clearAllSessionTimers();
}

// ─── User Activity Tracking ─────────────────────────────────────────────────
// "Activity" must mean the user actually using the app (clicking, typing,
// scrolling), not merely API traffic. Otherwise a user browsing cached pages
// gets force-logged-out by the 30-minute inactivity timer while clearly
// active. Interaction events reset the client timer immediately; a low-rate
// heartbeat keeps the server-side Redis activity key alive while active.

let lastInteractionAt = 0;
let lastThrottledInteraction = 0;

const ACTIVITY_HEARTBEAT_MS = 5 * 60 * 1000; // 5 minutes
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

function sendActivityHeartbeat(): void {
  if (!cachedBackendToken) return;
  // Only a visible tab pings. A hidden tab must not extend the 30-minute
  // inactivity window for a user who walked away — the visible tab's client
  // timer already enforces the policy for genuinely active users.
  if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
  // Only ping while the user has been active recently; a fully idle user
  // should still hit the 30-minute inactivity timeout.
  if (Date.now() - lastInteractionAt > INACTIVITY_TIMEOUT) return;
  axiosInstance.get("/api/v1/auth/activity").catch(() => {});
}

function startHeartbeat(): void {
  if (heartbeatTimer) return;
  heartbeatTimer = setInterval(sendActivityHeartbeat, ACTIVITY_HEARTBEAT_MS);
}

function stopHeartbeat(): void {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

/** Called on real user interaction — resets the client inactivity timer. */
function markInteraction(): void {
  lastInteractionAt = Date.now();
  updateActivity();
}

/** Throttled variant for high-frequency events (mousemove/scroll). */
function markThrottledInteraction(): void {
  const now = Date.now();
  if (now - lastThrottledInteraction < 30_000) return;
  lastThrottledInteraction = now;
  markInteraction();
}

/**
 * Hidden tabs must not enforce inactivity: the user may be active in another
 * tab sharing the same session. On return to a visible tab, re-sync with the
 * live session before restarting the timers.
 */
function handleVisibilityChange(): void {
  if (typeof document === "undefined") return;

  if (document.visibilityState === "hidden") {
    stopSessionTimers();
    return;
  }

  stopSessionTimers();
  getFreshSession()
    .then((session) => {
      if (session?.error === "SESSION_EXPIRED") {
        void forceLogout("Session expired. Please login again.");
        return;
      }
      if (session?.backendTokenExpiry) {
        initializeBackgroundRefresh(session.backendTokenExpiry);
      }
      // No session → the next API call 401s and forceLogout handles it.
    })
    .catch(() => {});
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.addEventListener("pointerdown", markInteraction, { passive: true });
  window.addEventListener("keydown", markInteraction);
  window.addEventListener("touchstart", markInteraction, { passive: true });
  window.addEventListener("scroll", markThrottledInteraction, { passive: true });
  window.addEventListener("mousemove", markThrottledInteraction, { passive: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

// ─── Proactive Background Token Refresh ─────────────────────────────────────────

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let isRefreshing = false;

function clearRefreshTimer(): void {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

function scheduleBackgroundRefresh(tokenExpiry: number): void {
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
      cachedBackendToken = newToken;
      cachedTokenExpiry = Date.now() + TOKEN_CACHE_TTL;
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

// Call this when we have a valid session with token expiry
export function initializeBackgroundRefresh(tokenExpiry: number): void {
  scheduleBackgroundRefresh(tokenExpiry);
  initializeSessionTimers(tokenExpiry);
  if (!lastInteractionAt) lastInteractionAt = Date.now();
  startHeartbeat();
}

export function stopBackgroundRefresh(): void {
  clearRefreshTimer();
  isRefreshing = false;
  stopSessionTimers();
  stopHeartbeat();
}

// ─── Token cache ──────────────────────────────────────────────────────────────

const TOKEN_CACHE_TTL = 10 * 60 * 1000;
let cachedBackendToken: string | null = null;
let cachedTokenExpiry = 0;

function invalidateTokenCache(): void {
  cachedBackendToken = null;
  cachedTokenExpiry = 0;
}

// ─── Request interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const now = Date.now();

    if (!cachedBackendToken || now > cachedTokenExpiry) {
      const session = await getFreshSession();
      cachedBackendToken = session?.backendToken ?? null;
      cachedTokenExpiry = cachedBackendToken ? now + TOKEN_CACHE_TTL : 0;

      // Initialize background refresh & session timers if we have token expiry info
      if (session?.backendTokenExpiry) {
        initializeBackgroundRefresh(session.backendTokenExpiry);
      }
    }

    // Update activity timestamp on each request
    updateActivity();

    if (cachedBackendToken) {
      config.headers.Authorization = `Bearer ${cachedBackendToken}`;
    }

    if (config.method && !["get", "head", "options"].includes(config.method.toLowerCase())) {
      const csrfToken = await getCsrfToken();
      if (csrfToken) config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor ─────────────────────────────────────────────────────
// Owns: retry logic for recoverable errors (TOKEN_EXPIRED, CSRF, TOKEN_REPLAY).
// Does NOT toast or call logout — that's handleAxiosError's job.

type RetryConfig = InternalAxiosRequestConfig & {
  _retried?: boolean;
  _csrfRetried?: boolean;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const code = error.response?.data?.code;
    const config = error.config as RetryConfig;

    // ── TOKEN_EXPIRED: attempt session refresh then retry once ────────────────
    if (code === "TOKEN_EXPIRED" && config && !config._retried) {
      config._retried = true;
      const failedToken = extractBearerToken(config.headers?.Authorization);
      invalidateTokenCache();

      // If a refresh is already in progress, queue this request
      if (isRefreshing && refreshPromise) {
        try {
          const newToken = await queueRequest();
          config.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(config);
        } catch {
          // Refresh failed while queued — let handleAxiosError decide whether
          // the session is truly dead (forceLogout) or it was a transient blip
          // (stay logged in).
          return handleRefreshOutcome(error);
        }
      }

      // Start refresh (or join existing)
      if (!refreshPromise) {
        refreshPromise = attemptBackgroundRefresh(failedToken);
      }

      await refreshPromise;

      // Check if refresh succeeded by looking for a valid token
      const session = await getFreshSession();
      const token = session?.backendToken;
      if (token && token !== failedToken) {
        cachedBackendToken = token;
        cachedTokenExpiry = Date.now() + TOKEN_CACHE_TTL;
        config.headers.Authorization = `Bearer ${token}`;

        // Reinitialize background refresh with new expiry
        if (session?.backendTokenExpiry) {
          initializeBackgroundRefresh(session.backendTokenExpiry);
        }

        return axiosInstance(config);
      }

      // Refresh did not rotate the token — rejectRequestQueue already fired.
      return handleRefreshOutcome(error);
    }

    // ── CSRF_VALIDATION_FAILED: refresh CSRF token then retry once ────────────
    if (code === "CSRF_VALIDATION_FAILED" && config && !config._csrfRetried) {
      config._csrfRetried = true;
      invalidateCsrfToken();

      const csrfToken = await getCsrfToken(true);
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
        return axiosInstance(config);
      }
    }

    return Promise.reject(error);
  },
);

// ─── Refresh-outcome helpers ──────────────────────────────────────────────────
// Decides whether a failed refresh is a genuinely dead session (force logout)
// or a transient blip (stay logged in — the next request will retry refresh).

function extractBearerToken(authHeader: unknown): string | null {
  if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7).trim();
}

function isSessionDead(session: AppSession | null): boolean {
  return (
    !session ||
    session.error === "SESSION_EXPIRED" ||
    !session.backendToken ||
    session.backendToken.length <= 10
  );
}

/**
 * After a failed TOKEN_EXPIRED refresh:
 *  - truly dead session (refresh token expired/cleared) → reject normally so
 *    handleAxiosError forceLogouts;
 *  - session still has a token (transient failure) → tag the error so
 *    handleAxiosError rejects silently WITHOUT forceLogout or toast.
 */
async function handleRefreshOutcome(
  error: AxiosError<ApiErrorResponse>,
): Promise<never> {
  try {
    const session = await getFreshSession();
    if (isSessionDead(session)) {
      return Promise.reject(error);
    }
  } catch {
    // Cannot read session (network) — assume transient, stay logged in.
  }
  (error as { __transientAuth?: boolean }).__transientAuth = true;
  return Promise.reject(error);
}

// ─── Error display handler ────────────────────────────────────────────────────
// Called after the interceptor has exhausted retries.
// Owns: toasts, forced logout for terminal auth failures.

const handleAxiosError = async (
  error: AxiosError<ApiErrorResponse>,
  showErrorToast = true,
): Promise<never> => {
  const status = error.response?.status;
  const data = error.response?.data;
  const code = data?.code;
  const message = data?.message || error.message || "Unknown error";

  // A transient refresh failure (backend blip) must never log an active user
  // out — the session is still alive and the next request will retry refresh.
  if ((error as { __transientAuth?: boolean }).__transientAuth) {
    return Promise.reject(error);
  }

  // ── Terminal auth failures → force logout ─────────────────────────────────
  if (code && TERMINAL_AUTH_CODES.has(code)) {
    return forceLogout(
      code === "ACCOUNT_BANNED"
        ? `Your account has been suspended${data?.reason ? `: ${data.reason}` : ""}.`
        : code === "EMAIL_NOT_VERIFIED"
          ? "Please verify your email address before continuing."
          : "Session expired. Please login again.",
    );
  }

  // ── Dedicated handling for specific error codes ─────────────────────────────
  if (code === "EMAIL_NOT_VERIFIED") {
    toast.error("Please verify your email address before continuing.");
    return Promise.reject(error);
  }

  if (code === "FORBIDDEN") {
    if (showErrorToast) {
      const required = data?.required?.join(", ") || "required permissions";
      toast.error(`You don't have permission to perform this action. ${required}`);
    }
    return Promise.reject(error);
  }

  if (code === "ACCOUNT_BANNED") {
    return forceLogout(`Your account has been suspended${data?.reason ? `: ${data.reason}` : ""}.`);
  }

  if (code === "CONFLICT") {
    toast.error(message || "A resource with this identifier already exists.");
    return Promise.reject(error);
  }

  if (code === "REFRESH_IN_PROGRESS") {
    // Interceptor will handle retry - don't toast
    return Promise.reject(error);
  }

  if (code === "RATE_LIMIT_EXCEEDED") {
    const retryAfter = data?.retryAfter || 60;
    toast.error(`Rate limit exceeded. Please wait ${retryAfter} seconds before trying again.`);
    return Promise.reject(error);
  }

  if (code === "SESSION_ERROR") {
    toast.error("Server session error. Please try again.");
    return Promise.reject(error);
  }

  if (code === "PROOF_EXPIRED" || code === "INVALID_PROOF") {
    // These are terminal but have specific meaning
    return forceLogout("Authentication proof invalid. Please login again.");
  }

  // ── Skip toast for: interceptor-handled codes, analytics, or caller opt-out
  const url = error.config?.url ?? "";
  const suppressToast =
    !showErrorToast ||
    (code && INTERCEPTOR_HANDLED_CODES.has(code)) ||
    url.includes("/analytics/") ||
    status === 401; // Auth failures never toast — terminal codes forceLogout above, NO_TOKEN on public pages stays silent

  if (suppressToast) return Promise.reject(error);

  // ── Status-based toast messages ───────────────────────────────────────────
  switch (status) {
    case 400:
      // Validation errors with field details
      if (data?.errors?.length) {
        toast.error(data.errors.map((e: any) => `${e.field}: ${e.message}`).join("; "));
      } else {
        toast.error(message || "Invalid request. Please check your input.");
      }
      break;
    case 403:
      // Already handled FORBIDDEN, EMAIL_NOT_VERIFIED, ACCOUNT_BANNED above
      if (!["FORBIDDEN", "EMAIL_NOT_VERIFIED", "ACCOUNT_BANNED"].includes(code || "")) {
        toast.error(message || "You don't have permission to do that.");
      }
      break;
    case 404:
      // 404s are usually handled inline by the caller — don't toast by default
      break;
    case 409:
      // CONFLICT handled above
      if (code !== "CONFLICT") {
        toast.error(message || "A resource with this identifier already exists.");
      }
      break;
    case 413:
      toast.error("Request too large. Please reduce the payload size.");
      break;
    case 429:
      // RATE_LIMIT_EXCEEDED handled above
      if (code !== "RATE_LIMIT_EXCEEDED") {
        toast.error(message || "Too many requests. Please try again later.");
      }
      break;
    case 500:
    default:
      if (status && status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (status && status >= 400) {
        toast.error(message);
      }
  }

  return Promise.reject(error);
};

// ─── Public API ───────────────────────────────────────────────────────────────

const mergeHeaders = (_options?: ApiOptions, extra?: Record<string, string>) => ({ ...extra });

export const api = {
  get: async <T = unknown>(endpoint: string, options?: ApiOptions) => {
    const res = await axiosInstance
      .get<ApiResponse<T>>(endpoint, { headers: mergeHeaders(options), params: options?.params })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message) toast.success(res.data.message);
    return res?.data;
  },

  post: async <T = unknown>(endpoint: string, data?: unknown, options?: ApiOptions) => {
    const res = await axiosInstance
      .post<ApiResponse<T>>(endpoint, data, { headers: mergeHeaders(options) })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message) toast.success(res.data.message);
    return res?.data;
  },

  put: async <T = unknown>(endpoint: string, data?: unknown, options?: ApiOptions) => {
    const res = await axiosInstance
      .put<ApiResponse<T>>(endpoint, data, { headers: mergeHeaders(options) })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message) toast.success(res.data.message);
    return res?.data;
  },

  patch: async <T = unknown>(endpoint: string, data?: unknown, options?: ApiOptions) => {
    const res = await axiosInstance
      .patch<ApiResponse<T>>(endpoint, data, { headers: mergeHeaders(options) })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message) toast.success(res.data.message);
    return res?.data;
  },

  delete: async <T = unknown>(endpoint: string, options?: ApiOptions) => {
    const res = await axiosInstance
      .delete<ApiResponse<T>>(endpoint, { headers: mergeHeaders(options), data: options?.data })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message) toast.success(res.data.message);
    return res?.data;
  },

  upload: async <T = unknown>(endpoint: string, formData: FormData, options?: ApiOptions) => {
    const res = await axiosInstance
      .post<ApiResponse<T>>(endpoint, formData, {
        headers: mergeHeaders(options, { "Content-Type": "multipart/form-data" }),
      })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message) toast.success(res.data.message);
    return res?.data;
  },
};

export default axiosInstance;
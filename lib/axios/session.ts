import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { logout } from "../auth/logout";
import { axiosInstance } from "./instance";
import {
  cachedBackendToken,
  getFreshSession,
  invalidateTokenCache,
  isRefreshing,
  scheduleBackgroundRefresh,
  stopRefreshScheduler,
} from "./refresh";
import { authChannel, broadcastAuthEvent } from "./broadcast";
import type { AuthBroadcastEvent } from "./types";

// ─── Session Timeout Management (Inactivity + Absolute) ──────────────────────────
// Per guide: 7-day inactivity timeout, 7-day absolute timeout

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

// True while this tab is tracking a live session. Cleared on logout so
// activity/visibility listeners can't re-arm timers after sign-out.
let sessionActive = false;

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

  // Warning 5 min before logout
  inactivityWarningTimer = setTimeout(() => {
    toast.error("Your session will expire in 5 minutes due to inactivity.", { duration: 10000 });
  }, INACTIVITY_TIMEOUT - INACTIVITY_WARNING_TIME);

  // Actual logout when the inactivity window expires
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
  if (!sessionActive) return;
  resetActivityTimers();
}

export function stopSessionTimers(): void {
  clearAllSessionTimers();
}

// ─── User Activity Tracking ─────────────────────────────────────────────────
// "Activity" must mean the user actually using the app (clicking, typing,
// scrolling), not merely API traffic. Otherwise a user browsing cached pages
// gets force-logged-out by the 7-day inactivity timer while clearly active.
// Interaction events reset the client timer immediately; a low-rate heartbeat
// keeps the server-side Redis activity key alive while active.

let lastInteractionAt = 0;
let lastThrottledInteraction = 0;

const ACTIVITY_HEARTBEAT_MS = 5 * 60 * 1000; // 5 minutes
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

function sendActivityHeartbeat(): void {
  if (!cachedBackendToken) return;
  // Only a visible tab pings. A hidden tab must not extend the 7-day
  // inactivity window for a user who walked away — the visible tab's client
  // timer already enforces the policy for genuinely active users.
  if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
  // Only ping while the user has been active recently; a fully idle user
  // should still hit the 7-day inactivity timeout.
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
  if (!sessionActive) return;
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
  // No live session tracked in this tab (logged out) — nothing to re-sync.
  if (!sessionActive) return;
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

// ─── Multi-tab coordination (wiring) ─────────────────────────────────────────
// Listen for events from other tabs. Lives here because the handler
// orchestrates both the session (timers) and refresh (scheduler) lifecycles.

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
        if (!sessionActive) break;
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
        disableSessionTracking();
        stopBackgroundRefresh();
        stopSessionTimers();
        invalidateTokenCache();
        // Force logout will be handled by the tab that initiated it
        break;
      }
    }
  };
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
export async function forceLogout(reason = "Session expired. Please login again."): Promise<never> {
  // A hidden tab must never kill a session the user is actively using in
  // another tab. Defer the logout; handleVisibilityChange re-syncs with the
  // live session when the tab becomes visible again.
  if (typeof document !== "undefined" && document.visibilityState === "hidden") {
    stopSessionTimers();
    return Promise.reject(new Error("SESSION_EXPIRED_DEFERRED"));
  }

  // Stop tracking the session so no activity/visibility event can re-arm the
  // timers or heartbeat while logged out. The hidden-tab path above keeps the
  // listeners attached so handleVisibilityChange can re-sync on focus.
  disableSessionTracking();

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

// ─── Lifecycle boot / teardown ───────────────────────────────────────────────

// Call this when we have a valid session with token expiry
export function initializeBackgroundRefresh(tokenExpiry: number): void {
  sessionActive = true;
  registerSessionListeners();
  scheduleBackgroundRefresh(tokenExpiry);
  initializeSessionTimers(tokenExpiry);
  if (!lastInteractionAt) lastInteractionAt = Date.now();
  startHeartbeat();
}

export function stopBackgroundRefresh(): void {
  stopRefreshScheduler();
  stopSessionTimers();
  stopHeartbeat();
}

/**
 * Mark the session as no longer tracked and detach the activity/visibility
 * listeners. Called on logout so later user interaction can't re-arm the
 * inactivity/absolute timers or the heartbeat for a signed-out tab.
 */
function disableSessionTracking(): void {
  sessionActive = false;
  unregisterSessionListeners();
  lastInteractionAt = 0;
  lastThrottledInteraction = 0;
}

// ─── Window event listeners ─────────────────────────────────────────────────
// Attached while a session is tracked; removed on logout so post-logout
// interactions never re-schedule timers.

let listenersRegistered = false;

function registerSessionListeners(): void {
  if (listenersRegistered || typeof window === "undefined" || typeof document === "undefined") {
    return;
  }
  listenersRegistered = true;
  window.addEventListener("pointerdown", markInteraction, { passive: true });
  window.addEventListener("keydown", markInteraction);
  window.addEventListener("touchstart", markInteraction, { passive: true });
  window.addEventListener("scroll", markThrottledInteraction, { passive: true });
  window.addEventListener("mousemove", markThrottledInteraction, { passive: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

function unregisterSessionListeners(): void {
  if (!listenersRegistered || typeof window === "undefined" || typeof document === "undefined") {
    return;
  }
  listenersRegistered = false;
  window.removeEventListener("pointerdown", markInteraction);
  window.removeEventListener("keydown", markInteraction);
  window.removeEventListener("touchstart", markInteraction);
  window.removeEventListener("scroll", markThrottledInteraction);
  window.removeEventListener("mousemove", markThrottledInteraction);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
}

registerSessionListeners();

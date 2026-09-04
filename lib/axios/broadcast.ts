import type { AuthBroadcastEvent } from "./types";

// ─── BroadcastChannel for Multi-Tab Coordination ──────────────────────────────────
// coordinate refresh across tabs.
// This module owns the channel and the send primitive; the onmessage wiring
// lives in session.ts, which coordinates the session/refresh lifecycle.

export const authChannel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("gablura-auth")
    : null;

export function broadcastAuthEvent(event: AuthBroadcastEvent): void {
  if (authChannel) {
    authChannel.postMessage({ ...event, timestamp: Date.now() });
  }
}

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (authChannel) {
      authChannel.close();
    }
  });
}

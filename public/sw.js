/* eslint-disable no-console */
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";

// ─── Precache all webpack-generated assets ──────────────────────────────────
precacheAndRoute(self.__WB_MANIFEST);

// ─── Cache static assets (images, fonts, icons) ────────────────────────────
registerRoute(
  ({ request }) => request.destination === "image" || request.destination === "font",
  new CacheFirst({
    cacheName: "static-assets",
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }), // 30 days
    ],
  })
);

// ─── Cache API responses (network-first for fresh data) ────────────────────
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/v1/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 5, // Fallback to cache after 5s
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }), // 1 day
    ],
  })
);

// ─── Cache page navigations (network-first) ────────────────────────────────
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages",
    plugins: [
      new ExpirationPlugin({ maxEntries: 10 }),
    ],
  })
);

// ─── Cache JS/CSS bundles (stale-while-revalidate) ────────────────────────
registerRoute(
  ({ request }) => request.destination === "script" || request.destination === "style",
  new StaleWhileRevalidate({
    cacheName: "static-resources",
  })
);

// ─── Background Sync for offline actions ───────────────────────────────────
const bgSyncPlugin = new BackgroundSyncPlugin("offline-queue", {
  maxRetentionTime: 24 * 60, // 24 hours in minutes
});

// Queue POST/PATCH/DELETE requests when offline
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/v1/") && 
    ["POST", "PATCH", "PUT", "DELETE"].includes(request.method),
  new NetworkFirst({
    plugins: [bgSyncPlugin],
  }),
  "POST"
);

// ─── SSE reconnection helper ───────────────────────────────────────────────
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ─── Push notification handler ─────────────────────────────────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.message,
    icon: "/icons/notification-icon.png",
    badge: "/icons/badge-icon.png",
    data: { url: data.actionUrl || "/dashboard" },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

console.log("✅ Service Worker loaded");

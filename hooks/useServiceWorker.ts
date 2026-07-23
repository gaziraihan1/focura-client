/**
 * hooks/useServiceWorker.ts
 *
 * Hook for registering and managing the Service Worker.
 * Handles registration, updates, and offline detection.
 */

"use client";

import { useEffect, useState, useCallback } from "react";

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
  update: () => Promise<void>;
}

export function useServiceWorker(): ServiceWorkerState {
  const initialIsSupported =
    typeof navigator !== "undefined" && "serviceWorker" in navigator;
  const [isSupported, setIsSupported] = useState<boolean>(initialIsSupported);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // If service workers are not supported, nothing to register.
    if (!initialIsSupported) return;

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        setRegistration(reg);
        setIsRegistered(true);

        // Check for updates periodically
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          setIsInstalling(true);

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed") {
              setIsInstalling(false);

              if (navigator.serviceWorker.controller) {
                // New content available, show update prompt
                setIsWaiting(true);
              } else {
                // Content is cached for the first time
                console.log("✅ Content is cached for offline use");
              }
            }
          });
        });

        console.log("✅ Service Worker registered");
      } catch (error) {
        console.error("❌ Service Worker registration failed:", error);
      }
    };

    registerSW();
  }, [initialIsSupported]);

  const update = useCallback(async () => {
    if (!registration) return;

    try {
      await registration.update();
      setIsWaiting(false);

      // Reload the page to activate the new service worker
      window.location.reload();
    } catch (error) {
      console.error("❌ Service Worker update failed:", error);
    }
  }, [registration]);

  return {
    isSupported,
    // setIsSupported,
    isRegistered,
    isInstalling,
    isWaiting,
    update,
  };
}

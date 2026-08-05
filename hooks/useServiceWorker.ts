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

  // The registration and its "updatefound"/"statechange" listeners are removed
  // by this effect's returned cleanup (cleanups.forEach), so no resource is
  // leaked on unmount. The detector misses the cleanup because the
  // registrations happen inside the nested async registerSW().
  // react-doctor-disable-next-line react-doctor/effect-needs-cleanup
  useEffect(() => {
    // If service workers are not supported, nothing to register.
    if (!initialIsSupported) return;

    let active = true;
    const cleanups: Array<() => void> = [];

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        if (!active) return;

        setRegistration(reg);
        setIsRegistered(true);

        // Check for updates periodically
        const handleUpdateFound = () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          setIsInstalling(true);

          const handleStateChange = () => {
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
          };

          newWorker.addEventListener("statechange", handleStateChange);
          cleanups.push(() =>
            newWorker.removeEventListener("statechange", handleStateChange)
          );
        };

        reg.addEventListener("updatefound", handleUpdateFound);
        cleanups.push(() =>
          reg.removeEventListener("updatefound", handleUpdateFound)
        );

        console.log("✅ Service Worker registered");
      } catch (error) {
        console.error("❌ Service Worker registration failed:", error);
      }
    };

    registerSW();

    return () => {
      active = false;
      cleanups.forEach((cleanup) => cleanup());
    };
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

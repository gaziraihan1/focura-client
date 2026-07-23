"use client";

import { useCallback, useState } from "react";
import type { Notification } from "@/types/notification.types";
import { NotificationPreferences } from "@/types/notification.types";

const NOTIFICATION_SOUND_URL = "/sounds/notification.mp3";

export function getStoredPreferences(): NotificationPreferences {
  const defaultPreferences: NotificationPreferences = {
    browserNotifications: false,
    soundEnabled: true,
    projectDueSoon: true,
    projectOverdue: true,
    projectAutoArchived: true,
  };

  if (typeof window === "undefined") {
    return defaultPreferences;
  }

  try {
    const saved = localStorage.getItem("notification-preferences");
    return saved ? JSON.parse(saved) : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

export function storePreferences(preferences: NotificationPreferences): void {
  try {
    localStorage.setItem("notification-preferences", JSON.stringify(preferences));
  } catch {
    // Ignore storage errors
  }
}

export function playNotificationSound(): void {
  try {
    const audio = new Audio(NOTIFICATION_SOUND_URL);
    audio.volume = 0.5;
    void audio.play();
  } catch {
    // Sound file not found or autoplay blocked - silently ignore
  }
}

export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function showBrowserNotification(notification: Notification): void {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const options: NotificationOptions & Record<string, unknown> = {
    body: notification.message,
    icon: notification.sender?.image || "/icons/notification-icon.png",
    badge: "/icons/badge-icon.png",
    tag: notification.id,
    renotify: true,
    data: { url: notification.actionUrl },
  };

  const browserNotif = new Notification(notification.title, options);
  browserNotif.onclick = () => {
    window.focus();
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    browserNotif.close();
  };
}

export function useNotificationPreferencesState() {
  const [preferences, setPreferencesState] =
    useState<NotificationPreferences>(getStoredPreferences);

  const updatePreferences = useCallback(
    (updates: Partial<NotificationPreferences>) => {
      setPreferencesState((prev) => {
        const next = { ...prev, ...updates };
        storePreferences(next);
        return next;
      });
    },
    []
  );

  const enableBrowserNotifications = useCallback(async () => {
    const granted = await requestBrowserNotificationPermission();
    updatePreferences({ browserNotifications: granted });
    return granted;
  }, [updatePreferences]);

  return {
    preferences,
    updatePreferences,
    enableBrowserNotifications,
  };
}

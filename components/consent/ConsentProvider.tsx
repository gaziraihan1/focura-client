"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { ConsentBanner } from "./ConsentBanner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

export type ConsentChoice = "accepted" | "declined";

/** Storage key for the visitor's analytics-consent choice. */
export const CONSENT_STORAGE_KEY = "gablura-consent";

/** Event dispatched on this tab after the choice is persisted. */
const CONSENT_CHANGE_EVENT = "gablura-consent";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
  };
}

function readStoredConsent(): ConsentChoice | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === "accepted" || stored === "declined" ? stored : null;
  } catch {
    // localStorage unavailable (e.g. private mode) — treat as no choice yet.
    return null;
  }
}

function getServerSnapshot(): ConsentChoice | null {
  return null;
}

interface ConsentContextValue {
  consent: ConsentChoice | null;
  accept: () => void;
  decline: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  consent: null,
  accept: () => {},
  decline: () => {},
});

/**
 * Manages the visitor's analytics-consent choice.
 *
 * - Strictly necessary + functional cookies are always on (no consent needed).
 * - Google Analytics only loads once the visitor explicitly accepts.
 * - The choice is persisted in `localStorage` under `gablura-consent`.
 */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const consent: ConsentChoice | null = useSyncExternalStore(
    subscribe,
    readStoredConsent,
    getServerSnapshot
  );

  const persist = useCallback((choice: ConsentChoice) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // Ignore storage failures; the dispatch below still refreshes state.
    }
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
  }, []);

  const value = useMemo(
    () => ({
      consent,
      accept: () => persist("accepted"),
      decline: () => persist("declined"),
    }),
    [consent, persist]
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {mounted && consent === null && <ConsentBanner />}
      <GoogleAnalytics enabled={consent === "accepted"} />
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}

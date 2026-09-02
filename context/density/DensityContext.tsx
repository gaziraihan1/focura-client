"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type Density = "compact" | "default" | "comfortable";

const DENSITY_KEY = "density";

function readStoredDensity(): Density {
  try {
    const stored = window.localStorage.getItem(DENSITY_KEY);
    if (stored === "compact" || stored === "comfortable") return stored;
  } catch {
    // localStorage unavailable
  }
  return "default";
}

function applyDensityAttr(density: Density) {
  document.documentElement.setAttribute("data-density", density);
}

function useStoredDensity(): [Density, (value: Density) => void] {
  // Start with "default" to match server snapshot and avoid hydration mismatch.
  const [density, setDensity] = useState<Density>("default");
  const hasHydrated = useRef(false);

  // After hydration, read the real value from localStorage.
  useEffect(() => {
    if (hasHydrated.current) return;
    
    const stored = readStoredDensity();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDensity(stored);
    applyDensityAttr(stored);
    hasHydrated.current = true;
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === DENSITY_KEY) {
        const next = readStoredDensity();
        setDensity(next);
        applyDensityAttr(next);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const setValue = useCallback((next: Density) => {
    setDensity(next);
    try {
      window.localStorage.setItem(DENSITY_KEY, next);
    } catch {
      // localStorage unavailable (private mode etc.)
    }
    applyDensityAttr(next);
  }, []);

  return [density, setValue];
}

interface DensityContextValue {
  density: Density;
  setDensity: (density: Density) => void;
}

const DensityContext = createContext<DensityContextValue>({
  density: "default",
  setDensity: () => {},
});

export function DensityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [density, setDensity] = useStoredDensity();

  const value = useMemo<DensityContextValue>(
    () => ({
      density,
      setDensity,
    }),
    [density, setDensity],
  );

  return (
    <DensityContext.Provider value={value}>
      {children}
    </DensityContext.Provider>
  );
}

export function useDensity() {
  return useContext(DensityContext);
}

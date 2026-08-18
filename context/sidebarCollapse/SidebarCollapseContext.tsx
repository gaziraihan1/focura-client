"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

const MAIN_SIDEBAR_KEY = "focura.main-sidebar-collapsed";
const PROJECT_SIDEBAR_KEY = "focura.project-sidebar-collapsed";

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();

function readStoredValue(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

// The server always renders the expanded layouts to avoid hydration mismatches;
// the client adopts the persisted preferences right after hydration.
function getServerSnapshot() {
  return false;
}

function subscribe(key: string, callback: Listener) {
  const set = listeners.get(key) ?? new Set<Listener>();
  set.add(callback);
  listeners.set(key, set);
  return () => {
    set.delete(callback);
    if (set.size === 0) listeners.delete(key);
  };
}

function emitChange(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

// Cross-tab sync: when a preference changes in another tab, re-read it.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === MAIN_SIDEBAR_KEY || e.key === PROJECT_SIDEBAR_KEY) {
      listeners.get(e.key)?.forEach((listener) => listener());
    }
  });
}

function useStoredBool(key: string): [boolean, (value: boolean) => void] {
  const value = useSyncExternalStore(
    useCallback((callback) => subscribe(key, callback), [key]),
    useCallback(() => readStoredValue(key), [key]),
    getServerSnapshot,
  );

  const setValue = useCallback(
    (next: boolean) => {
      try {
        window.localStorage.setItem(key, next ? "1" : "0");
      } catch {
        // localStorage unavailable (private mode etc.) — in-memory still works.
      }
      emitChange(key);
    },
    [key],
  );

  return [value, setValue];
}

interface SidebarCollapseContextValue {
  /** Dashboard + workspace shell sidebar (shared between those two layouts). */
  isMainSidebarCollapsed: boolean;
  toggleMainSidebar: () => void;
  setMainSidebarCollapsed: (collapsed: boolean) => void;
  /** Project-level sidebar — independent of the main sidebar state. */
  isProjectSidebarCollapsed: boolean;
  toggleProjectSidebar: () => void;
  setProjectSidebarCollapsed: (collapsed: boolean) => void;
}

const SidebarCollapseContext = createContext<SidebarCollapseContextValue>({
  isMainSidebarCollapsed: false,
  toggleMainSidebar: () => {},
  setMainSidebarCollapsed: () => {},
  isProjectSidebarCollapsed: false,
  toggleProjectSidebar: () => {},
  setProjectSidebarCollapsed: () => {},
});

export function SidebarCollapseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMainSidebarCollapsed, setMainSidebarCollapsed] =
    useStoredBool(MAIN_SIDEBAR_KEY);
  const [isProjectSidebarCollapsed, setProjectSidebarCollapsed] =
    useStoredBool(PROJECT_SIDEBAR_KEY);

  const toggleMainSidebar = useCallback(() => {
    setMainSidebarCollapsed(!readStoredValue(MAIN_SIDEBAR_KEY));
  }, [setMainSidebarCollapsed]);

  const toggleProjectSidebar = useCallback(() => {
    setProjectSidebarCollapsed(!readStoredValue(PROJECT_SIDEBAR_KEY));
  }, [setProjectSidebarCollapsed]);

  return (
    <SidebarCollapseContext.Provider
      value={{
        isMainSidebarCollapsed,
        toggleMainSidebar,
        setMainSidebarCollapsed,
        isProjectSidebarCollapsed,
        toggleProjectSidebar,
        setProjectSidebarCollapsed,
      }}
    >
      {children}
    </SidebarCollapseContext.Provider>
  );
}

export function useSidebarCollapse() {
  return useContext(SidebarCollapseContext);
}
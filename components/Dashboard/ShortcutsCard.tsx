"use client";

import { ReactNode } from "react";

export function ShortcutsCard({ inner }: { inner: ReactNode }) {
  const triggerSwitcher = () => {
    // Dispatch the same keyboard event your useWorkspaceLayout listens for
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        ctrlKey: true,
        bubbles: true,
      })
    );
  };

  return (
    <button
      type="button"
      onClick={triggerSwitcher}
      className="block w-full text-left"
      aria-label="Open workspace switcher (Cmd+K or Ctrl+K)"
    >
      {inner}
    </button>
  );
}

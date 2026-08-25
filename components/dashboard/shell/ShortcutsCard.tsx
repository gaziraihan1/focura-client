"use client";

import { ReactNode } from "react";

function triggerSwitcher() {
  // Dispatch the same keyboard event your useWorkspaceLayout listens for
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
    })
  );
}

export function ShortcutsCard({ inner }: { inner: ReactNode }) {
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

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
    <div onClick={triggerSwitcher} className="block">
      {inner}
    </div>
  );
}
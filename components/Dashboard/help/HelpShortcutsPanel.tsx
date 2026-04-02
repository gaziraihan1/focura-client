"use client";

import { cn } from "@/lib/utils";
import type { ShortcutGroup } from "@/types/help.types";

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    label: "Global",
    shortcuts: [
      { description: "Open command palette", keys: ["⌘", "K"] },
      { description: "Search", keys: ["/"] },
      { description: "Go to inbox", keys: ["G", "I"] },
      { description: "Toggle sidebar", keys: ["⌘", "\\"] },
      { description: "Open help", keys: ["?"] },
    ],
  },
  {
    label: "Tasks",
    shortcuts: [
      { description: "New task", keys: ["C"] },
      { description: "Mark complete", keys: ["⌘", "↵"] },
      { description: "Set priority", keys: ["P"] },
      { description: "Assign member", keys: ["A"] },
      { description: "Set due date", keys: ["D"] },
      { description: "Delete task", keys: ["⌘", "⌫"] },
    ],
  },
  {
    label: "Navigation",
    shortcuts: [
      { description: "Previous item", keys: ["K"] },
      { description: "Next item", keys: ["J"] },
      { description: "Open detail", keys: ["↵"] },
      { description: "Go back", keys: ["⌘", "["] },
    ],
  },
];

interface HelpShortcutsPanelProps {
  className?: string;
}

function Kbd({ children }: { children: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center",
        "min-w-6 h-6 px-1.5 rounded",
        "border border-border bg-secondary",
        "font-mono text-[11px] text-muted-foreground",
        "select-none leading-none",
      )}
    >
      {children}
    </kbd>
  );
}

export function HelpShortcutsPanel({ className }: HelpShortcutsPanelProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {SHORTCUT_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2 select-none">
            {group.label}
          </p>

          <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
            {group.shortcuts.map((shortcut) => (
              <div
                key={shortcut.description}
                className="flex items-center justify-between px-4 py-2.5 bg-card hover:bg-secondary/40 transition-colors duration-100"
              >
                <span className="text-sm text-muted-foreground">
                  {shortcut.description}
                </span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, i) => (
                    <Kbd key={i}>{key}</Kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-4">
        On Windows and Linux, replace{" "}
        <kbd className="font-mono text-[11px] bg-secondary border border-border rounded px-1 py-0.5">
          ⌘
        </kbd>{" "}
        with{" "}
        <kbd className="font-mono text-[11px] bg-secondary border border-border rounded px-1 py-0.5">
          Ctrl
        </kbd>
        . Shortcuts activate when a task is focused or the detail panel is open.
      </p>
    </div>
  );
}
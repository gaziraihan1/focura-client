"use client";

import { COLOR_MAP, DevSection } from "@/lib/devGuides";

interface DevGuideHeaderProps {
  current: DevSection;
  mobileOpen: boolean;
  onMobileToggle: () => void;
}

export function DevGuideHeader({ current, mobileOpen, onMobileToggle }: DevGuideHeaderProps) {
  const col = COLOR_MAP[current.color];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-foreground font-bold text-lg tracking-tight">Focura</span>
          <span className="hidden sm:inline text-muted-foreground text-sm">/</span>
          <span className="hidden sm:inline text-muted-foreground text-sm font-medium">Developer Guide</span>
        </div>

        {/* Mobile trigger */}
        <button
          className="sm:hidden flex items-center gap-2 text-sm border border-border rounded-lg px-3 py-1.5"
          onClick={onMobileToggle}
        >
          <span className={`text-xs ${col.text}`}>{current.icon}</span>
          <span className="text-foreground font-medium text-xs">{current.label}</span>
          <svg
            className={`w-3 h-3 text-muted-foreground transition-transform ${mobileOpen ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Desktop current label */}
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={col.text}>{current.icon}</span>
          <span>{current.label}</span>
        </span>
      </div>
    </header>
  );
}
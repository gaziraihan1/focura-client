"use client";

import type { GuideSection } from "@/types/guides.types";
import { COLOR_MAP } from "@/constants/guides.constants";

interface GuideHeaderProps {
  current: GuideSection;
  mobileOpen: boolean;
  onMobileToggle: () => void;
}

export function GuideHeader({ current, mobileOpen, onMobileToggle }: GuideHeaderProps) {
  const col = COLOR_MAP[current.color];

  return (
    <header className="sticky top-16 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Left: logo + breadcrumb */}
        <div className="flex items-center gap-3">
          <span className="text-foreground font-bold text-lg tracking-tight">Focura</span>
          <span className="hidden sm:inline text-muted-foreground text-sm">/</span>
          <span className="hidden sm:inline text-muted-foreground text-sm">User Guide</span>
        </div>

        {/* Mobile nav trigger */}
        <button
          className="sm:hidden flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-lg px-3 py-1.5"
          onClick={onMobileToggle}
          aria-label="Toggle navigation"
        >
          <span className={`text-xs ${col.text}`}>{current.icon}</span>
          <span className="text-foreground font-medium">{current.label}</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Desktop active section indicator */}
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={col.text}>{current.icon}</span>
          <span>{current.label}</span>
        </span>
      </div>
    </header>
  );
}
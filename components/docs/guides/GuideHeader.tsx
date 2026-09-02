"use client";

import { ChevronDown } from "lucide-react";
import type { GuideSection } from "@/types/guides.types";
import { COLOR_MAP } from "@/constants/guides.constants";
import { GuideSearchInput } from "./GuideSearchInput";
import { Button } from "@/components/ui/Button";

interface GuideHeaderProps {
  current: GuideSection;
  mobileOpen: boolean;
  onMobileToggle: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  /** Breadcrumb label — e.g. "User Guide" or "Developer Guide". */
  label?: string;
}

export function GuideHeader({
  current,
  mobileOpen,
  onMobileToggle,
  query,
  onQueryChange,
  label = "User Guide",
}: GuideHeaderProps) {
  const col = COLOR_MAP[current.color];

  return (
    <header className="sticky top-16 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-foreground font-bold text-lg tracking-tight min-w-0 truncate">Focura</span>
          <span aria-hidden="true" className="hidden sm:inline text-muted-foreground text-sm">
            /
          </span>
          <span className="hidden sm:inline text-muted-foreground text-sm whitespace-nowrap">
            {label}
          </span>
          <span aria-hidden="true" className="hidden md:inline text-muted-foreground text-sm">
            /
          </span>
          <span
            className={`hidden md:flex items-center gap-1.5 text-sm font-medium min-w-0 ${col.text}`}
          >
            <span className="shrink-0">{current.icon}</span>
            <span className="truncate">{current.label}</span>
          </span>
        </div>

        {/* Search + mobile trigger */}
        <div className="flex items-center gap-3">
          <GuideSearchInput
            value={query}
            onChange={onQueryChange}
            id="guide-search-desktop"
            className="hidden sm:block w-56 lg:w-72"
          />          <Button
            variant="outline"
            size="sm"
            onClick={onMobileToggle}
            aria-expanded={mobileOpen}
            aria-label="Toggle guide topics"
            className="md:hidden flex items-center gap-2 min-w-0 text-sm rounded-lg px-3 py-1.5 bg-card hover:bg-muted"
          >
            <span className={`text-xs shrink-0 ${col.text}`}>{current.icon}</span>
            {/* Constrain the label so long section names never push the header
                outside the viewport on small screens. */}
            <span className="text-foreground font-medium text-xs truncate max-w-[42vw]">
              {current.label}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 shrink-0 text-muted-foreground transition-transform ${mobileOpen ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      </div>
    </header>
  );
}

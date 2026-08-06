"use client";

// components/Shared/FilterDropdown.tsx
// Mobile-safe dropdown used by filter toolbars. Unlike naive `absolute
// left-0` menus, the panel is positioned with `fixed` coordinates computed
// from the trigger button and **clamped to the viewport** on every axis, so
// it never spills off-screen on small devices. Long option lists scroll
// within a max-height instead of extending past the bottom of the screen.
//
// Behavior:
//  - Opens on click (touch-friendly — no hover dependency).
//  - Closes on outside click, Escape, or selecting an option.
//  - Repositions on open so it always fits the current viewport.

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterDropdownProps {
  /** Accessible label + fallback text shown on the trigger button. */
  label: string;
  /** Optional icon rendered on the trigger. */
  icon?: ReactNode;
  /** Optional active value shown instead of the label (e.g. "Frontend"). */
  value?: string;
  /** Highlight the trigger when a filter is active. */
  active?: boolean;
  /** Panel content. Receives a `close` callback to dismiss after selection. */
  children: (close: () => void) => ReactNode;
  /** Extra classes for the panel (e.g. min-width). */
  panelClassName?: string;
  /** Extra classes for the trigger button. */
  className?: string;
  /** Offset the panel from the trigger's bottom edge (px). Default 6. */
  offset?: number;
}

export function FilterDropdown({
  label,
  icon,
  value,
  active,
  children,
  panelClassName,
  className,
  offset = 6,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Compute panel position from the trigger's rect, clamped to the viewport
  // on every axis with a small margin so it can never overflow on mobile.
  const updatePosition = useCallback(() => {
    const btn = btnRef.current;
    const panel = panelRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const panelW = panel?.offsetWidth || 200;
    const panelH = panel?.offsetHeight || 240;
    const margin = 8;
    let left = rect.left;
    if (left + panelW > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - panelW - margin);
    }
    // Open below the trigger, but keep it fully inside the viewport:
    // never above the top edge, never below the bottom edge (a fixed panel
    // below the fold is unreachable — the exact mobile bug we're fixing).
    const top = Math.min(
      Math.max(margin, rect.bottom + offset),
      window.innerHeight - panelH - margin,
    );
    setPos({ top, left });
  }, [offset]);

  const openMenu = () => {
    setOpen((v) => !v);
  };

  // Position once the panel has mounted so its real width is measurable.
  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  // Reposition on resize/scroll while open (covers rotation + scrolling).
  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  const close = useCallback(() => setOpen(false), []);

  // Return focus to the trigger after closing so keyboard users don't lose
  // their place (skip the initial mount, where open is already false).
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      btnRef.current?.focus();
    }
    wasOpenRef.current = open;
  }, [open]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    // Close when another FilterDropdown opens (the second trigger's pointerdown
    // is outside this panel, so this also enforces one-open-at-a-time).
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div className="relative inline-flex">
      <button
        ref={btnRef}
        type="button"
        onClick={openMenu}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={value ?? label}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground",
          active && "border-primary/50 text-primary bg-primary/5",
          className,
        )}
      >
        {icon}
        <span className="hidden sm:inline max-w-36 truncate">
          {value ?? label}
        </span>
        <ChevronDown
          className={cn("size-3.5 transition-transform shrink-0", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          className={cn(
            "fixed z-9999 min-w-44 max-w-[calc(100vw-16px)] max-h-[min(60vh,20rem)] overflow-y-auto rounded-xl border border-border bg-popover py-1 shadow-[0_8px_24px_0_rgb(0_0_0/0.12)]",
            panelClassName,
          )}
          style={{ top: pos.top, left: pos.left }}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}

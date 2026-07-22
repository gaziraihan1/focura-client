"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps keyboard focus inside a container element while `active` is true.
 * Returns a ref to attach to the container and an optional initial-focus ref.
 */
export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Remember the element that had focus before the trap opened
    previousRef.current = document.activeElement as HTMLElement;

    // Focus the first focusable element inside the container
    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      const first = containerRef.current.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
      // Restore focus when trap deactivates
      previousRef.current?.focus();
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !containerRef.current) return;

      const focusable = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  return containerRef;
}

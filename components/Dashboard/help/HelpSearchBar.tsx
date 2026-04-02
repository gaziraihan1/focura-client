"use client";

import { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpSearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onClear: () => void;
  className?: string;
}

export function HelpSearchBar({
  query,
  onChange,
  onClear,
  className,
}: HelpSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K focuses search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        onClear();
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClear]);

  return (
    <div className={cn("relative w-full max-w-lg", className)}>
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        size={15}
        strokeWidth={1.75}
      />

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search guides, topics, shortcuts…"
        className={cn(
          "w-full rounded-lg border border-border bg-secondary/50",
          "py-2.5 pl-9 pr-20",
          "text-sm text-foreground placeholder:text-muted-foreground",
          "outline-none ring-0",
          "transition-colors duration-150",
          "focus:border-ring focus:bg-background",
        )}
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {query ? (
          <button
            onClick={onClear}
            className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground select-none">
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  );
}
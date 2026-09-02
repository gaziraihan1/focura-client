"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface GuideSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
}

export function GuideSearchInput({ value, onChange, className, id }: GuideSearchInputProps) {
  const inputId = id ?? "guide-search";

  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
      />
      <label htmlFor={inputId} className="sr-only">
        Search guides
      </label>
      <input
        id={inputId}
        type="text"
        role="searchbox"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search guides…"
        autoComplete="off"
        className="w-full h-9 rounded-lg border border-border bg-card pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring transition-colors"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted h-auto w-auto"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
}

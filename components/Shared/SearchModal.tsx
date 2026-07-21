"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Folder, File, Loader2, Command, Briefcase } from "lucide-react";
import { useGlobalSearch, type SearchResult } from "@/hooks/useGlobalSearch";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_ICON: Record<SearchResult["type"], typeof Folder> = {
  workspace: Briefcase,
  project: Folder,
  file: File,
};

const TYPE_LABEL: Record<SearchResult["type"], string> = {
  workspace: "Workspace",
  project: "Project",
  file: "File",
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { results, isLoading, hasQuery } = useGlobalSearch(query);

  // Group results by type
  const grouped = results.reduce(
    (acc, r) => {
      (acc[r.type] ??= []).push(r);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  const flatResults = results;

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [flatResults.length]);

  const navigate = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flatResults[selectedIndex]) {
      navigate(flatResults[selectedIndex].href);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-border bg-popover shadow-2xl shadow-black/20 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          {isLoading ? (
            <Loader2 size={18} className="text-muted-foreground animate-spin shrink-0" />
          ) : (
            <Search size={18} className="text-muted-foreground shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tasks, projects, files…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {!hasQuery && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              <Command size={20} className="mx-auto mb-2 opacity-50" />
              Type to search across workspaces, projects, tasks, and files
            </div>
          )}

          {hasQuery && isLoading && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              <Loader2 size={18} className="mx-auto mb-2 animate-spin" />
              Searching…
            </div>
          )}

          {hasQuery && !isLoading && flatResults.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <div className="px-4 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
                {TYPE_LABEL[type as SearchResult["type"]]}s
              </div>
              {items.map((item) => {
                const globalIndex = flatResults.indexOf(item);
                const Icon = TYPE_ICON[item.type];
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => navigate(item.href)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      globalIndex === selectedIndex
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: item.color ? `${item.color}20` : undefined,
                      }}
                    >
                      <Icon
                        size={16}
                        style={{ color: item.color ?? undefined }}
                        className={!item.color ? "text-muted-foreground" : ""}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}

          {hasQuery && !isLoading && flatResults.length > 0 && (
            <div className="px-4 py-2 border-t border-border">
              <button
                onClick={() => navigate(`/dashboard/tasks?search=${encodeURIComponent(query)}`)}
                className="w-full text-center text-xs text-primary hover:underline py-1"
              >
                View all results for &ldquo;{query}&rdquo;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

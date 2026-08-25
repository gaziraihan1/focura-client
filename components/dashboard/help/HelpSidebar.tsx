"use client";

import { cn } from "@/lib/utils";
import type { HelpTopic, HelpTopicId } from "@/types/help.types";

interface HelpSidebarProps {
  topics: HelpTopic[];
  activeTopicId: HelpTopicId;
  onSelect: (id: HelpTopicId) => void;
  className?: string;
}

export function HelpSidebar({
  topics,
  activeTopicId,
  onSelect,
  className,
}: HelpSidebarProps) {
  return (
    <nav
      className={cn(
        "flex flex-col gap-0.5 py-4 px-3",
        // Mobile: horizontal scrolling strip
        "max-sm:flex-row max-sm:flex-wrap max-sm:py-3 max-sm:px-4 max-sm:gap-1.5",
        className,
      )}
      aria-label="Help topics"
    >
      <p className="px-2 mb-2 text-[10px] font-mono tracking-widest text-muted-foreground uppercase select-none max-sm:hidden">
        Topics
      </p>

      {topics.map((topic) => {
        const isActive = topic.id === activeTopicId;
        return (
          <button
            key={topic.id}
            onClick={() => onSelect(topic.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-left w-full",
              "transition-all duration-150 outline-none",
              "max-sm:w-auto max-sm:rounded-full max-sm:px-3 max-sm:py-1.5 max-sm:text-xs",
              isActive
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
            )}
          >
            {/* Accent dot — desktop */}
            <span
              className="hidden sm:block w-1.5 h-1.5 rounded-full fshrink-0 transition-opacity duration-150"
              style={{
                backgroundColor: topic.accentColor,
                opacity: isActive ? 1 : 0.45,
              }}
            />

            {/* Icon — mobile */}
            <span className="sm:hidden text-sm leading-none">{topic.icon}</span>

            <span className="truncate">{topic.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
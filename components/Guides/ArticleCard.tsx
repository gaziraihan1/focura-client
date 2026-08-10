"use client";

import { ChevronDown } from "lucide-react";
import type { GuideArticle } from "@/types/guides.types";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: GuideArticle;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function ArticleCard({ article, index, isOpen, onToggle }: ArticleCardProps) {
  const contentId = `guide-article-${index}`;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/60 transition-colors"
      >
        <span className="w-6 h-6 shrink-0 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[11px] font-semibold tabular-nums">
          {index + 1}
        </span>
        <span className="flex-1 text-sm font-medium text-foreground leading-snug">
          {article.title}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 shrink-0 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div
          id={contentId}
          className="px-4 pb-4 [overflow-wrap:anywhere] animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {typeof article.content === "string" ? (
            <p className="text-sm text-muted-foreground leading-relaxed">{article.content}</p>
          ) : (
            <div>{article.content}</div>
          )}
        </div>
      )}
    </div>
  );
}

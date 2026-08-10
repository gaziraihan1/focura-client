"use client";

import { ArrowRight, SearchX } from "lucide-react";
import { getArticleText, type GuideSearchResult } from "@/utils/guides.utils";
import { COLOR_MAP } from "@/constants/guides.constants";

interface GuideSearchResultsProps {
  query: string;
  results: GuideSearchResult[];
  onOpen: (sectionId: string, key: string) => void;
}

function snippet(content: string): string {
  const text = content.replace(/\s+/g, " ").trim();
  return text.length > 140 ? `${text.slice(0, 140).trim()}…` : text;
}

export function GuideSearchResults({ query, results, onOpen }: GuideSearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-16 text-center">
        <SearchX className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-semibold text-foreground">No results for “{query}”</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try a different keyword — for example “task”, “billing”, or “focus”.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        <strong className="font-semibold text-foreground">{results.length}</strong>{" "}
        {results.length === 1 ? "result" : "results"} for “{query}”
      </p>
      <div className="space-y-2.5">
        {results.map(({ section, article, key }) => {
          const col = COLOR_MAP[section.color];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onOpen(section.id, key)}
              className="group w-full rounded-xl border border-border bg-card p-4 text-left hover:border-foreground/20 hover:bg-muted/40 transition-colors"
            >
              <span className="flex items-center gap-2 mb-1.5">
                <span className={`text-xs shrink-0 ${col.text}`}>{section.icon}</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${col.text}`}>
                  {section.label}
                </span>
              </span>
              <span className="flex items-center justify-between gap-3 text-sm font-semibold text-foreground">
                <span className="min-w-0">{article.title}</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform" />
              </span>
              <span className="mt-1 block text-sm text-muted-foreground leading-relaxed">
                {snippet(getArticleText(article))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

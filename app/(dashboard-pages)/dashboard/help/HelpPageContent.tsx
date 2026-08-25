"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { HelpTopicId } from "@/types/help.types";
import { useHelpSearch, useHelpTopics } from "@/hooks/useHelpTopics";
import { HelpSearchBar } from "@/components/dashboard/help/HelpSearchBar";
import { HelpSidebar } from "@/components/dashboard/help/HelpSidebar";
import { SearchResults, TopicContent } from "./HelpPageComponents";

export function HelpPageContent() {
  const [activeTopicId, setActiveTopicId] = useState<HelpTopicId>(
    "getting-started",
  );
  const { topics } = useHelpTopics();
  const { query, setQuery, clear, results, isEmpty } =
    useHelpSearch();

  const isSearching = query.trim().length > 0;

  const handleTopicNavigate = (id: HelpTopicId) => {
    setActiveTopicId(id);
    clear();
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      {/* ── Hero / Search header ── */}
      <div className="border-b border-border px-6 py-8 sm:px-8">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          focura / help center
        </p>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          How can we help?
        </h1>
        <p className="mb-5 text-sm text-muted-foreground max-w-md">
          Browse guides, walkthroughs, and reference docs for every part of your
          dashboard.
        </p>

        <HelpSearchBar query={query} onChange={setQuery} onClear={clear} />
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col sm:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "sm:w-52 sm:shrink-0 sm:border-r border-border",
            "border-b sm:border-b-0",
            isSearching && "sm:opacity-50 sm:pointer-events-none",
            "transition-opacity duration-150",
          )}
        >
          <HelpSidebar
            topics={topics}
            activeTopicId={activeTopicId}
            onSelect={(id) => {
              setActiveTopicId(id);
              clear();
            }}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 scrollbar-hide">
          {isSearching ? (
            <SearchResults
              results={results}
              isEmpty={isEmpty}
              onTopicNavigate={handleTopicNavigate}
            />
          ) : (
            <TopicContent topicId={activeTopicId} />
          )}
        </main>
      </div>
    </div>
  );
}

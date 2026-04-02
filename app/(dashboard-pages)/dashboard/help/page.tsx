"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HelpTopicId, ArticleTag } from "@/types/help.types";

import { useHelpSearch, useHelpTopics } from "@/hooks/useHelpTopics";
import { HelpContactCards } from "@/components/Dashboard/help/HelpContactCards";
import { HelpSearchBar } from "@/components/Dashboard/help/HelpSearchBar";
import { HelpSidebar } from "@/components/Dashboard/help/HelpSidebar";

// ─── Tag badge ────────────────────────────────────────────────────────────────

const TAG_STYLES: Record<ArticleTag, string> = {
  guide:
    "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  reference:
    "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  tip:
    "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  new:
    "bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900",
};

function ArticleTag({ tag }: { tag: ArticleTag }) {
  return (
    <span
      className={cn(
        "inline-block rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider select-none",
        TAG_STYLES[tag],
      )}
    >
      {tag}
    </span>
  );
}

// ─── Article card ─────────────────────────────────────────────────────────────

function ArticleCard({
  title,
  description,
  tag,
  docsPath,
}: {
  title: string;
  description: string;
  tag: ArticleTag;
  docsPath: string;
}) {
  return (
    <Link
      href={docsPath}
      className={cn(
        "group flex flex-col gap-2 rounded-xl border border-border bg-card p-4",
        "transition-all duration-150 outline-none",
        "hover:border-ring/40 hover:bg-secondary/40",
        "focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {/* Top row: tag + arrow */}
      <div className="flex items-center justify-between">
        <ArticleTag tag={tag} />
        <ArrowUpRight
          size={14}
          strokeWidth={1.75}
          className={cn(
            "text-muted-foreground/40 shrink-0",
            "transition-all duration-150",
            "group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
          )}
        />
      </div>

      <p className="text-sm font-medium text-foreground leading-snug">
        {title}
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Docs path hint — appears on hover */}
      <p
        className={cn(
          "font-mono text-[10px] text-muted-foreground/0 truncate mt-auto pt-1",
          "transition-colors duration-150 group-hover:text-muted-foreground/60",
        )}
      >
        {docsPath}
      </p>
    </Link>
  );
}

// ─── Step list ────────────────────────────────────────────────────────────────

function StepList({
  steps,
}: {
  steps: { step: number; title: string; description: string }[];
}) {
  return (
    <div className="mt-6">
      <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3 select-none">
        Quick setup steps
      </p>
      <ol className="space-y-3">
        {steps.map((s) => (
          <li key={s.step} className="flex gap-3">
            <span
              className={cn(
                "shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center",
                "rounded-full border border-border bg-secondary",
                "font-mono text-[10px] text-muted-foreground select-none",
              )}
            >
              {s.step}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground mb-0.5">
                {s.title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {s.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Notice banner ────────────────────────────────────────────────────────────

function Notice({ children }: { children: string }) {
  return (
    <div
      className={cn(
        "mt-6 rounded-lg border-l-2 border-ring bg-secondary/50 px-4 py-3",
        "text-xs text-muted-foreground leading-relaxed",
      )}
    >
      {children}
    </div>
  );
}

// ─── Search results overlay ───────────────────────────────────────────────────

function SearchResults({
  results,
  isEmpty,
  onTopicNavigate,
}: {
  results: ReturnType<typeof useHelpSearch>["results"];
  isEmpty: boolean;
  onTopicNavigate: (id: HelpTopicId) => void;
}) {
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
        <span className="text-3xl">🔍</span>
        <p className="text-sm font-medium text-foreground">No results found</p>
        <p className="text-xs text-muted-foreground">
          Try a different keyword or browse a topic from the sidebar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3 select-none">
        {results.length} result{results.length !== 1 ? "s" : ""}
      </p>

      {results.map((r) => {
        const tagClass = cn(
          "rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
          r.type === "faq"
            ? "border-violet-200 bg-violet-50 text-violet-800 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900"
            : "border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
        );

        const inner = (
          <>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className={tagClass}>{r.type}</span>
                <p className="text-sm font-medium text-foreground truncate">
                  {r.title}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {r.description}
            </p>
          </>
        );

        const sharedClass = cn(
          "group w-full flex flex-col items-start gap-1.5 rounded-xl border border-border bg-card px-4 py-3",
          "text-left transition-all duration-150 outline-none",
          "hover:border-ring/40 hover:bg-secondary/40",
          "focus-visible:ring-2 focus-visible:ring-ring",
        );

        // Article → navigate to /docs/[slug]

        // FAQ → switch to the relevant topic section
        return (
          <button
            key={r.id}
            onClick={() => onTopicNavigate(r.topicId)}
            className={sharedClass}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}

// ─── Topic content ────────────────────────────────────────────────────────────

function TopicContent({ topicId }: { topicId: HelpTopicId }) {
  const { getTopicById } = useHelpTopics();
  const topic = getTopicById(topicId);

  if (!topic) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-3 mb-6 pb-5 border-b border-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-lg">
          {topic.icon}
        </div>
        <div>
          <h2 className="text-base font-medium text-foreground">{topic.label}</h2>
          <p className="text-sm text-muted-foreground">{topic.description}</p>
        </div>
      </div>

      {/* Articles grid */}
      {topic.articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
          {topic.articles.map((a) => (
            <ArticleCard
              key={a.id}
              title={a.title}
              description={a.description}
              tag={a.tag}
              docsPath={a.docsPath}
            />
          ))}
        </div>
      )}

      {/* Steps (getting started) */}
      {topic.steps && topic.steps.length > 0 && (
        <StepList steps={topic.steps} />
      )}

      {/* Contact section */}
      {topicId === "contact" && <HelpContactCards />}

      {/* Shortcuts section */}

      {/* FAQ */}

      {/* Notice */}
      {topic.notice && <Notice>{topic.notice}</Notice>}
    </div>
  );
}

// ─── HelpPage (root) ──────────────────────────────────────────────────────────

export default function HelpPage() {
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
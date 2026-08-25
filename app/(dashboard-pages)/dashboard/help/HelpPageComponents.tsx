"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HelpTopicId, ArticleTag } from "@/types/help.types";
import { useHelpSearch, useHelpTopics } from "@/hooks/useHelpTopics";
import { HelpContactCards } from "@/components/dashboard/help/HelpContactCards";

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

export function ArticleTag({ tag }: { tag: ArticleTag }) {
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

export function ArticleCard({
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

export function StepList({
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

export function Notice({ children }: { children: string }) {
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

export function SearchResults({
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

export function TopicContent({ topicId }: { topicId: HelpTopicId }) {
  const { getTopicById } = useHelpTopics();
  const topic = getTopicById(topicId);

  if (!topic) return null;

  return (
    <div>
      <div className="flex items-start gap-3 mb-6 pb-5 border-b border-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-lg">
          {topic.icon}
        </div>
        <div>
          <h2 className="text-base font-medium text-foreground">{topic.label}</h2>
          <p className="text-sm text-muted-foreground">{topic.description}</p>
        </div>
      </div>

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

      {topic.steps && topic.steps.length > 0 && (
        <StepList steps={topic.steps} />
      )}

      {topicId === "contact" && <HelpContactCards />}

      {topic.notice && <Notice>{topic.notice}</Notice>}
    </div>
  );
}

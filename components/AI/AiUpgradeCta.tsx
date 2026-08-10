"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiUpgradeCtaProps {
  /**
   * Explicit destination. When omitted, the CTA links to the workspace billing
   * upgrade page (`/dashboard/workspaces/<slug>/billing/upgrade`) if
   * `workspaceSlug` is set, otherwise a neutral fallback.
   */
  href?: string;
  /** Workspace whose plan must be upgraded (AI plans are workspace-scoped). */
  workspaceSlug?: string;
  message?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Rendered when the backend returns an AI quota error (429) or a plan-gated
 * feature error. Always offers a clear action instead of a dead-end toast.
 */
export function AiUpgradeCta({
  href,
  workspaceSlug,
  message = "You've reached the free AI limit. Upgrade to Pro for more AI usage.",
  className,
  compact = false,
}: AiUpgradeCtaProps) {
  const resolvedHref =
    href ??
    (workspaceSlug
      ? `/dashboard/workspaces/${workspaceSlug}/billing/upgrade`
      : "/dashboard/workspaces");
  if (compact) {
    return (
      <Link
        href={resolvedHref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10",
          className,
        )}
      >
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Upgrade for more AI
        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">
          <Sparkles className="mr-1.5 inline h-4 w-4 text-primary" aria-hidden="true" />
          AI assistant limit reached
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{message}</p>
      </div>
      <Link
        href={resolvedHref}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Upgrade plan
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

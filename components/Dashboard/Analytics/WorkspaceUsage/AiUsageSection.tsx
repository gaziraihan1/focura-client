"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  Coins,
  Download,
  FileJson,
  FileSpreadsheet,
  Hash,
  ShieldAlert,
  Sparkles,
  Wand2,
} from "lucide-react";
import {
  aiFeatureLabel,
  useAiUsageReport,
  useExportAiUsage,
} from "@/hooks/useAi";
import { cn } from "@/lib/utils";
import type { AiUsageByFeature } from "@/types/ai.types";
import { SectionSkeleton } from "./SectionSkeleton";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}

function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-3.5 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className={cn("rounded-lg p-1.5 sm:p-2", accent)}>
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-2 text-lg sm:text-2xl font-bold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}

interface AiUsageSectionProps {
  workspaceId: string;
}

/**
 * "AI Usage" section — a workspace's AI spend report (calls, tokens, estimated
 * cost) read from `AiUsageLog`. The backend restricts this endpoint to
 * workspace owners and admins; the section is also only rendered for
 * admins/owners by the parent page. Purely read-only.
 */
export function AiUsageSection({ workspaceId }: AiUsageSectionProps) {
  const [periodDays, setPeriodDays] = useState(30);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exported, setExported] = useState(false);
  const { data, isLoading, isError, error } = useAiUsageReport(
    workspaceId,
    true,
    periodDays,
  );
  const { exportToCSV, exportToJSON } = useExportAiUsage();

  async function handleExport(format: "csv" | "json") {
    setMenuOpen(false);
    try {
      if (format === "csv") await exportToCSV(workspaceId, periodDays);
      else await exportToJSON(workspaceId, periodDays);
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    } catch (err) {
      console.error("AI usage export failed:", err);
    }
  }

  if (isLoading) return <SectionSkeleton rows={3} />;

  if (isError || !data) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground"
      >
        <p className="flex items-center gap-1.5 font-medium text-foreground">
          <ShieldAlert className="h-4 w-4 text-destructive" aria-hidden="true" />
          AI usage could not be loaded
        </p>
        <p className="mt-1 text-xs">
          {error?.message ?? "You may need owner or admin access to this workspace."}
        </p>
      </div>
    );
  }

  const maxFeatureCalls = Math.max(1, ...data.byFeature.map((f) => f.calls));
  const hasUsage = data.total.calls > 0;

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            AI Usage
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last {periodDays} days · owners and admins only
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1 rounded-lg border border-border bg-background p-0.5"
            role="group"
            aria-label="Report period"
          >
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                type="button"
                aria-pressed={periodDays === days}
                aria-label={`Show last ${days} days`}
                onClick={() => setPeriodDays(days)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  periodDays === days
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {days}d
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                exported
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-border bg-background text-foreground hover:border-primary/30",
              )}
            >
              {exported ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {exported ? "Exported" : "Export"}
              {!exported && (
                <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              )}
            </button>

            {menuOpen && (
              <>
                {/* Invisible backdrop so any outside click closes the menu. */}
                <div
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden="true"
                />
                <div
                  role="menu"
                  aria-label="Export options"
                  className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-border bg-card p-1 shadow-lg"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => void handleExport("csv")}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                    Export as CSV
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => void handleExport("json")}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <FileJson className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                    Export as JSON
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <StatCard
          icon={Wand2}
          label="AI calls"
          value={data.total.calls.toLocaleString()}
          accent="bg-chart-1/10"
        />
        <StatCard
          icon={Hash}
          label="Tokens used"
          value={data.total.totalTokens.toLocaleString()}
          accent="bg-chart-2/10"
        />
        <StatCard
          icon={Coins}
          label="Estimated cost"
          value={`$${data.total.costUsd.toFixed(4)}`}
          accent="bg-chart-3/10"
        />
      </div>

      {!hasUsage ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card p-6 text-center">
          <Sparkles className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">No AI usage yet</p>
          <p className="max-w-sm text-xs text-muted-foreground">
            AI calls made in this workspace in the last {periodDays} days will
            appear here with their token and cost estimates.
          </p>
        </div>
      ) : (
        <>
          {/* Calls by feature */}
          <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-3.5 sm:p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Calls by feature
            </h3>
            {data.byFeature.length === 0 ? (
              <p className="text-xs text-muted-foreground">No data.</p>
            ) : (
              <ul className="space-y-2.5">
                {data.byFeature.map((item: AiUsageByFeature) => (
                  <li key={item.feature}>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="truncate font-medium text-foreground">
                        {aiFeatureLabel(item.feature)}
                      </span>
                      <span className="shrink-0 tabular-nums text-muted-foreground">
                        {item.calls.toLocaleString()} calls ·{" "}
                        {item.totalTokens.toLocaleString()} tok
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${(item.calls / maxFeatureCalls) * 100}%` }}
                        role="img"
                        aria-label={`${aiFeatureLabel(item.feature)}: ${item.calls} calls`}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Calls by model */}
          {data.byModel.length > 0 && (
            <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-3.5 sm:p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Calls by model
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.byModel.map((item) => (
                  <span
                    key={item.model}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs"
                  >
                    <span className="font-medium text-foreground">{item.model}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {item.calls.toLocaleString()} calls · $
                      {item.costUsd.toFixed(4)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent calls */}
          <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-3.5 sm:p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Recent calls
            </h3>
            {data.recent.length === 0 ? (
              <p className="text-xs text-muted-foreground">No recent calls.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">Feature</th>
                      <th className="py-2 pr-3 font-medium">Model</th>
                      <th className="py-2 pr-3 font-medium text-right">Tokens</th>
                      <th className="py-2 font-medium text-right">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="py-2 pr-3 text-foreground">
                          {aiFeatureLabel(row.feature)}
                        </td>
                        <td className="py-2 pr-3 text-muted-foreground">
                          {row.model}
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums text-muted-foreground">
                          {row.totalTokens.toLocaleString()}
                        </td>
                        <td className="py-2 text-right tabular-nums text-muted-foreground">
                          {new Date(row.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <p className="text-[11px] text-muted-foreground">
        Costs are estimates from token usage (see AiUsageLog) — the provider
        invoice is the source of truth.
      </p>
    </section>
  );
}

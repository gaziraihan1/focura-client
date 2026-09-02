"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  Coins,
  Download,
  FileJson,
  FileSpreadsheet,
  Gauge,
  Hash,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Wand2,
} from "lucide-react";
import {
  aiFeatureLabel,
  useAiQuota,
  useAiUsageReport,
  useExportAiUsage,
} from "@/hooks/useAi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
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

/** 1_200 → "1.2K", 500_000 → "500K", 25_000_000 → "25M". */
function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return n.toLocaleString();
}

/** Small amber "custom" tag with the plan default in a tooltip. */
function CustomTag({ defaultLimit, format }: { defaultLimit: number; format: (n: number) => string }) {
  return (
    <span
      title={`Plan default: ${format(defaultLimit)}`}
      className="ml-1.5 inline-flex items-center gap-0.5 rounded bg-amber-500/15 px-1 py-px text-[10px] font-semibold text-amber-600 dark:text-amber-400"
    >
      <SlidersHorizontal className="h-2.5 w-2.5" aria-hidden="true" />
      custom
    </span>
  );
}

interface LimitRowProps {
  label: string;
  used: number;
  limit: number;
  /** Plan default — shown in the hint when an admin override is active. */
  defaultLimit: number;
  /** Whether a Focura-admin override is active for this field. */
  overridden: boolean;
  format?: (n: number) => string;
}

/**
 * One quota row: usage bar plus a "Plan default: X — customized by Focura
 * admin" hint whenever the effective limit was raised (or lowered) from the
 * workspace's tier default by an admin.
 */
function LimitRow({
  label,
  used,
  limit,
  defaultLimit,
  overridden,
  format = formatCompact,
}: LimitRowProps) {
  const ratio = limit > 0 ? Math.min(1, used / limit) : 1;
  const barTone =
    ratio >= 1 ? "bg-destructive" : ratio >= 0.8 ? "bg-amber-500" : "bg-primary";

  return (
    <li>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="shrink-0 tabular-nums text-muted-foreground">
          {format(used)}
          <span className="opacity-70"> / {format(limit)}</span>
          {overridden && <CustomTag defaultLimit={defaultLimit} format={format} />}
        </span>
      </div>
      <div
        className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${label}: ${format(used)} of ${format(limit)} used`}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", barTone)}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      {overridden && (
        <p className="mt-1 text-[10px] text-amber-600/80 dark:text-amber-400/80">
          Plan default: {format(defaultLimit)} — customized by Focura admin
        </p>
      )}
    </li>
  );
}

interface AiUsageSectionProps {
  workspaceId: string;
}

/**
 * "AI Usage" section — a workspace's AI spend report (calls, tokens, estimated
 * cost) read from `AiUsageLog`, plus the effective AI limits (plan defaults,
 * honoring any Focura-admin overrides) so owners see their raised caps. The
 * backend restricts this endpoint to workspace owners and admins; the section
 * is also only rendered for admins/owners by the parent page. Purely read-only.
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
  const { data: quota } = useAiQuota(workspaceId, true);
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

  const maxOutputOverridden =
    quota != null && quota.defaults.maxOutputTokens !== quota.maxOutputTokens;

  // Single source of truth for "customized": the backend's `overrides` object
  // only contains fields a Focura admin actually set on this workspace.
  const hasOverrides = Boolean(
    quota && Object.keys(quota.overrides).length > 0,
  );

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
              <Button
                key={days}
                type="button"
                variant="ghost"
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
              </Button>
            ))}
          </div>

          <div className="relative">
            <Button
              type="button"
              variant="outline"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className={cn(
                "gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
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
            </Button>

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
                  <Button
                    type="button"
                    variant="ghost"
                    role="menuitem"
                    onClick={() => void handleExport("csv")}
                    className="flex w-full items-center justify-start gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-foreground transition-colors"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                    Export as CSV
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    role="menuitem"
                    onClick={() => void handleExport("json")}
                    className="flex w-full items-center justify-start gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-foreground transition-colors"
                  >
                    <FileJson className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                    Export as JSON
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Effective AI limits — plan defaults plus any Focura-admin overrides */}
      {quota && (
        <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-3.5 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-foreground">
                Current AI limits
              </h3>
              {hasOverrides && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  <SlidersHorizontal className="h-3 w-3" aria-hidden="true" />
                  Customized by Focura admin
                </span>
              )}
            </div>
            <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {quota.plan} plan
            </span>
          </div>

          <ul className="mt-3 space-y-3">
            <LimitRow
              label="Calls per day"
              used={quota.usedToday}
              limit={quota.dailyLimit}
              defaultLimit={quota.defaults.daily}
              overridden={quota.overrides.daily != null}
              format={(n) => n.toLocaleString()}
            />
            <LimitRow
              label="Monthly tokens"
              used={quota.tokensUsedThisMonth}
              limit={quota.monthlyTokens}
              defaultLimit={quota.defaults.monthlyTokens}
              overridden={quota.overrides.monthlyTokens != null}
            />
          </ul>

          <div className="mt-3 border-t border-border/60 pt-3">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-foreground">Rate &amp; response</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {quota.burstPerMinute}/min · {quota.hourly}/hr ·{" "}
                {quota.maxOutputTokens.toLocaleString()} tokens/response
                {maxOutputOverridden && (
                  <CustomTag
                    defaultLimit={quota.defaults.maxOutputTokens}
                    format={(n) => n.toLocaleString()}
                  />
                )}
              </span>
            </div>
            {maxOutputOverridden && (
              <p className="mt-1 text-right text-[10px] text-amber-600/80 dark:text-amber-400/80">
                Plan default: {quota.defaults.maxOutputTokens.toLocaleString()}{" "}
                tokens/response — customized by Focura admin
              </p>
            )}
          </div>
        </div>
      )}

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

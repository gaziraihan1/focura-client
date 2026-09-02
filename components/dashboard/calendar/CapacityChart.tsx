"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
// oxlint-disable-next-line react-doctor/prefer-dynamic-import -- recharts only ships when this chart mounts
} from "recharts";
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { ExportButton } from "@/components/dashboard/calendar/ExportButton";
import { useCapacityChart } from "@/hooks/useCapacityChart";
import { Button } from "@/components/ui/Button";

// ─── Component ─────────────────────────────────────────────────────────────

export function CapacityChart() {
  const {
    expanded,
    setExpanded,
    chartContentRef,
    loading,
    isEmpty,
    error,
    refetch,
    weeklyData,
    totalPlannedAll,
    totalCapacityAll,
    overCapacityWeeks,
    maxValue,
  } = useCapacityChart();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
            <AlertCircle className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">Capacity vs Planned</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => refetch()}
            className="flex shrink-0 gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground"
            aria-label="Retry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <BarChart3 className="w-4.5 h-4.5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">Capacity vs Planned</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              No calendar data yet. Start planning tasks to see capacity insights.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 p-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center justify-start gap-3 rounded-lg text-left hover:bg-accent/30"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
            <BarChart3 className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 text-left">
            <h4 className="text-sm font-semibold text-foreground">
              Capacity vs Planned
            </h4>
            <p className="text-xs text-muted-foreground">
              Last 8 weeks |{" "}
              {totalPlannedAll > totalCapacityAll
                ? `${(totalPlannedAll - totalCapacityAll).toFixed(0)}h over capacity`
                : `${(totalCapacityAll - totalPlannedAll).toFixed(0)}h under capacity`}
            </p>
          </div>
        </Button>
        <div className="flex shrink-0 items-center gap-1">
          {expanded && (
            <ExportButton
              chartRef={chartContentRef}
              filename="capacity-chart"
            />
          )}
          {overCapacityWeeks > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
              {overCapacityWeeks} overloaded
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse chart" : "Expand chart"}
            className="rounded-lg p-1"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Chart */}
      {expanded && (
        <div ref={chartContentRef} className="px-4 pb-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <SummaryCard
              label="Total Planned"
              value={`${totalPlannedAll.toFixed(0)}h`}
              color="text-blue-600 dark:text-blue-400"
            />
            <SummaryCard
              label="Total Capacity"
              value={`${totalCapacityAll.toFixed(0)}h`}
              color="text-emerald-600 dark:text-emerald-400"
            />
            <SummaryCard
              label="Weekly Avg Planned"
              value={`${(totalPlannedAll / weeklyData.length).toFixed(1)}h`}
              color="text-blue-600 dark:text-blue-400"
            />
            <SummaryCard
              label="Weekly Avg Capacity"
              value={`${(totalCapacityAll / weeklyData.length).toFixed(1)}h`}
              color="text-emerald-600 dark:text-emerald-400"
            />
          </div>

          {/* Bar chart */}
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{ top: 8, right: 8, left: -16, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  interval={1}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  unit="h"
                  domain={[0, maxValue * 1.2]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number | undefined, name: string | undefined) => [
                    `${(value ?? 0).toFixed(1)}h`,
                    name === "totalPlanned" ? "Planned" : "Capacity",
                  ]}
                  labelFormatter={(label) => (label == null ? "" : String(label))}
                />
                <Legend
                  formatter={(value: string) =>
                    value === "totalPlanned" ? "Planned Hours" : "Capacity Hours"
                  }
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                />
                <ReferenceLine
                  y={0}
                  stroke="hsl(var(--border))"
                />
                <Bar
                  dataKey="totalPlanned"
                  name="totalPlanned"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />
                <Bar
                  dataKey="totalCapacity"
                  name="totalCapacity"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.15}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend / insights */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-primary" />
              Planned hours
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-primary/15" />
              Capacity hours
            </span>
            {overCapacityWeeks > 0 && (
              <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {overCapacityWeeks} week{overCapacityWeeks > 1 ? "s" : ""} over capacity
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Summary Card ──────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: string;
  color: string;
}

function SummaryCard({ label, value, color }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}

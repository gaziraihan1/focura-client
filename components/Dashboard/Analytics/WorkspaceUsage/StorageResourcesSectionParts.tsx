"use client";

import {
  FileText,
  TrendingUp,
  Folder,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import type { ResourceUsageMetrics } from "@/types/workspace-usage.types";

// Theme-aware chart tokens (defined in globals.css) — consistent with the rest
// of the analytics palette in both light and dark mode.
const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-3)",
  "var(--chart-5)",
  "var(--chart-4)",
  "var(--chart-2)",
];


export function StorageBar({ percentage }: { percentage: number }) {
  const color =
    percentage >= 90
      ? "bg-destructive"
      : percentage >= 75
      ? "bg-orange-500"
      : percentage >= 50
      ? "bg-amber-500"
      : "bg-primary";

  return (
    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}

function formatMB(mb: number): string {
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
}

export function StorageUsageCard({
  totalStorage,
  isCritical,
  isWarning,
}: {
  totalStorage: ResourceUsageMetrics["totalStorage"];
  isCritical: boolean;
  isWarning: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Storage Usage</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Workspace total</p>
        </div>
        <div className="text-right">
          <p
            className={`text-xl sm:text-2xl font-bold ${
              isCritical
                ? "text-red-600 dark:text-red-400"
                : isWarning
                ? "text-orange-600 dark:text-orange-400"
                : "text-foreground"
            }`}
          >
            {totalStorage.percentage}%
          </p>
          <p className="text-xs text-muted-foreground">used</p>
        </div>
      </div>
      <StorageBar percentage={totalStorage.percentage} />
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          {formatMB(totalStorage.usedMB)}
        </span>
        <span>/ {formatMB(totalStorage.totalMB)}</span>
      </div>

      {isWarning && !isCritical && (
        <div className="mt-3 p-2 sm:p-2.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <p className="text-xs font-medium text-orange-700 dark:text-orange-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Approaching storage limit
          </p>
        </div>
      )}
    </div>
  );
}

export function TotalFilesCard({
  totalFiles,
  trend,
  growthPct,
}: {
  totalFiles: number;
  trend: Array<{ month: string; count: number }>;
  growthPct: number | null;
}) {
  const maxCount = Math.max(...trend.map((t) => t.count), 1);

  return (
    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Total Files</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Across all projects</p>
        </div>
        <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-chart-1/10">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-chart-1" />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-foreground">{totalFiles}</p>
      {growthPct !== null ? (
        <div
          className={`flex items-center gap-1.5 mt-2 text-xs font-medium ${
            growthPct >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          <TrendingUp className={`w-3.5 h-3.5 ${growthPct < 0 ? "rotate-180" : ""}`} />
          {growthPct >= 0 ? "+" : ""}
          {growthPct}% this month
        </div>
      ) : (
        <p className="text-xs text-muted-foreground mt-2">No uploads in the previous month</p>
      )}
      <div className="mt-3 sm:mt-4 h-8 flex items-end gap-0.5" title="Files uploaded per month (last 6 months)">
        {trend.map((t) => (
          <div
            key={t.month}
            className="flex-1 rounded-t bg-chart-1 opacity-30"
            style={{ height: `${Math.max((t.count / maxCount) * 100, 4)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function StorageGrowthChart({ data }: { data: { month: string; storage: number }[] }) {
  return (
    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">
        Storage Growth Trend
      </h3>
      <div className="h-40 sm:h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 13, fill: "var(--muted-foreground)" }}
              stroke="var(--border)"
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              stroke="var(--border)"
              tickLine={false}
              axisLine={false}
              width={35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
                fontSize: "12px",
              }}
              formatter={(v) => [`${Number(v).toFixed(0)} MB`, "Storage"]}
            />
            <Line
              type="monotone"
              dataKey="storage"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-1)", r: 3, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TopProjectsChart({
  storageByProject,
}: {
  storageByProject: ResourceUsageMetrics["storageByProject"];
}) {
  return (
    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
        <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
        Top Projects by Storage
      </h3>
      <div className="h-40 sm:h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={storageByProject.slice(0, 5)}
            layout="vertical"
            margin={{ left: 0, right: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 13, fill: "var(--muted-foreground)" }}
              stroke="var(--border)"
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="projectName"
              tick={{ fontSize: 13, fill: "var(--muted-foreground)" }}
              stroke="var(--border)"
              tickLine={false}
              width={30}
              tickFormatter={(v: string) => (v.length > 8 ? `${v.slice(0, 8)}...` : v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
                fontSize: "12px",
              }}
              formatter={(v) => [`${Number(v).toFixed(1)} MB`, "Storage"]}
            />
            <Bar dataKey="storageUsedMB" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function FileTypeDistribution({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 sm:mb-5">
          File Type Distribution
        </h3>
        <p className="text-sm text-muted-foreground">
          No files uploaded yet — distribution will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4 sm:mb-5">
        File Type Distribution
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
        <div className="h-44 sm:h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={PIE_COLORS[data.indexOf(entry) % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                  fontSize: "14px",
                }}
                formatter={(v) => [`${Math.round(Number(v))} files`, "Count"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 sm:space-y-2.5">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="text-sm font-medium text-foreground">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 sm:w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${total > 0 ? Math.round((item.value / total) * 100) : 0}%`,
                      backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground w-8 text-right">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// components/Analytics/WorkspaceUsage/StorageResourcesSection.tsx
"use client";

import { HardDrive, FileText, TrendingUp, Folder, AlertTriangle } from "lucide-react";
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

interface StorageResourcesSectionProps {
  resourceUsage: ResourceUsageMetrics;
}

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

const fileTypeData = [
  { name: "Images", value: 35 },
  { name: "PDFs", value: 25 },
  { name: "Docs", value: 20 },
  { name: "Videos", value: 15 },
  { name: "Others", value: 5 },
];

function StorageBar({ percentage }: { percentage: number }) {
  const color =
    percentage >= 90
      ? "bg-red-500"
      : percentage >= 75
      ? "bg-orange-500"
      : percentage >= 50
      ? "bg-amber-500"
      : "bg-blue-500";

  return (
    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}

export function StorageResourcesSection({
  resourceUsage,
}: StorageResourcesSectionProps) {
  const { totalStorage, storageByProject, filesByUser } = resourceUsage;

  const totalFiles = filesByUser.reduce((sum, u) => sum + u.fileCount, 0);

  const storageGrowthData = [
    { month: "Jan", storage: 800 },
    { month: "Feb", storage: 1200 },
    { month: "Mar", storage: 1800 },
    { month: "Apr", storage: 2100 },
    { month: "May", storage: 2300 },
    { month: "Jun", storage: totalStorage.usedMB },
  ];

  const isCritical = totalStorage.percentage >= 90;
  const isWarning = totalStorage.percentage >= 75;

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <HardDrive className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Storage & Resources</h2>
      </div>

      {isCritical && (
        <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                Storage Critical — {totalStorage.percentage}% used
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                Upgrade your plan to avoid service interruption.
              </p>
            </div>
          </div>
          <button className="shrink-0 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors w-full sm:w-auto text-center">
            Upgrade
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
              {totalStorage.usedMB.toFixed(1)} MB
            </span>
            <span>/ {totalStorage.totalMB} MB</span>
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

        <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Total Files</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Across all projects</p>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-900/30">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{totalFiles}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            +12% this month
          </div>
          <div className="mt-3 sm:mt-4 h-8 flex items-end gap-0.5">
            {[40, 55, 45, 70, 60, 80, 75, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-blue-500 opacity-30"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">
            Storage Growth Trend
          </h3>
          <div className="h-40 sm:h-47.5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={storageGrowthData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 13, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                  tickLine={false}
                  axisLine={false}
                  width={35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    fontSize: "12px",
                  }}
                  formatter={(v) => [`${Number(v).toFixed(0)} MB`, "Storage"]}
                />
                <Line
                  type="monotone"
                  dataKey="storage"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 3, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            Top Projects by Storage
          </h3>
          <div className="h-40 sm:h-47.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={storageByProject.slice(0, 5)}
                layout="vertical"
                margin={{ left: 0, right: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 13, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="projectName"
                  tick={{ fontSize: 13, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                  tickLine={false}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    fontSize: "12px",
                  }}
                  formatter={(v) => [`${Number(v).toFixed(1)} MB`, "Storage"]}
                />
                <Bar dataKey="storageUsedMB" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 sm:mb-5">
          File Type Distribution
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
          <div className="h-42.5 sm:h-50">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fileTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {fileTypeData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    fontSize: "14px",
                  }}
                  formatter={(v) => [`${v}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 sm:space-y-2.5">
            {fileTypeData.map((item, i) => (
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
                        width: `${item.value}%`,
                        backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-8 text-right">
                    {item.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
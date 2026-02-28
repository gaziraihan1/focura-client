// components/Analytics/WorkspaceUsage/GrowthInsightsSection.tsx
"use client";

import {
  TrendingUp,
  TrendingDown,
  ListTodo,
  Users,
  Folder,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { WorkspaceGrowthMetrics } from "@/types/workspace-usage.types";

interface GrowthInsightsSectionProps {
  workspaceGrowth: WorkspaceGrowthMetrics;
}

interface GrowthMetricProps {
  label: string;
  value: number;
  change: number;
  icon: React.ElementType;
}

function GrowthMetric({ label, value, change, icon: Icon }: GrowthMetricProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50 border border-border">
      <div
        className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl ${
          isPositive
            ? "bg-green-100 dark:bg-green-900/30"
            : isNeutral
            ? "bg-muted"
            : "bg-red-100 dark:bg-red-900/30"
        }`}
      >
        <Icon
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
            isPositive
              ? "text-green-600 dark:text-green-400"
              : isNeutral
              ? "text-muted-foreground"
              : "text-red-600 dark:text-red-400"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
      <div
        className={`flex items-center gap-0.5 text-xs font-semibold ${
          isPositive
            ? "text-green-600 dark:text-green-400"
            : isNeutral
            ? "text-muted-foreground"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {isPositive && <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        {!isPositive && !isNeutral && <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        {isPositive ? "+" : ""}
        {change}%
      </div>
    </div>
  );
}

type InsightType = "positive" | "warning" | "neutral";

interface Insight {
  id: number;
  text: string;
  type: InsightType;
}

const insightStyles: Record<InsightType, { wrapper: string; dot: string; text: string }> = {
  positive: {
    wrapper: "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800",
    dot: "bg-green-500",
    text: "text-green-900 dark:text-green-100",
  },
  warning: {
    wrapper: "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800",
    dot: "bg-orange-500",
    text: "text-orange-900 dark:text-orange-100",
  },
  neutral: {
    wrapper: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500",
    text: "text-blue-900 dark:text-blue-100",
  },
};

export function GrowthInsightsSection({ workspaceGrowth }: GrowthInsightsSectionProps) {
  const { thisMonth, projectLifecycle, trend } = workspaceGrowth;

  const insights: Insight[] = [
    {
      id: 1,
      text: "Task creation increased significantly this week — strong team engagement.",
      type: "positive",
    },
    {
      id: 2,
      text: "Storage growth accelerating. Consider upgrading your plan soon.",
      type: "warning",
    },
    {
      id: 3,
      text: `${projectLifecycle.active} active projects progressing with ${thisMonth.newTasks} new tasks added this month.`,
      type: "neutral",
    },
  ];

  const growthMetrics: GrowthMetricProps[] = [
    { label: "New Tasks", value: thisMonth.newTasks, change: 18, icon: ListTodo },
    { label: "New Members", value: thisMonth.newUsers, change: 9, icon: Users },
    { label: "New Projects", value: thisMonth.newProjects, change: 4, icon: Folder },
    { label: "Completed", value: projectLifecycle.completed, change: 15, icon: CheckCircle },
  ];

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Growth Insights</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {growthMetrics.map((m) => (
          <GrowthMetric key={m.label} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="lg:col-span-3 bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">6-Month Trend</h3>
          <div className="h-45 sm:h-55">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 14, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    fontSize: "13px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "14px", color: "hsl(var(--muted-foreground))" }}
                />
                <Bar dataKey="tasks" name="Tasks" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="users" name="Users" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="projects" name="Projects" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-foreground">Key Insights</h3>
          </div>
          <div className="space-y-2 sm:space-y-3 flex-1">
            {insights.map((insight) => {
              const styles = insightStyles[insight.type];
              return (
                <div
                  key={insight.id}
                  className={`flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl ${styles.wrapper}`}
                >
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1 shrink-0 ${styles.dot}`} />
                  <p className={`text-xs font-medium leading-relaxed ${styles.text}`}>
                    {insight.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">
              Project Lifecycle
            </p>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {[
                { label: "Created", value: projectLifecycle.created, color: "text-blue-500" },
                { label: "Active", value: projectLifecycle.active, color: "text-green-500" },
                { label: "Completed", value: projectLifecycle.completed, color: "text-purple-500" },
                { label: "Archived", value: projectLifecycle.archived, color: "text-muted-foreground" },
              ].map((item) => (
                <div key={item.label} className="text-center p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-muted/50">
                  <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
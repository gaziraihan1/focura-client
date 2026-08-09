"use client";

import {
  TrendingUp,
  ListTodo,
  Users,
  Folder,
  CheckCircle,
  Lightbulb,
  TrendingDown,
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
// oxlint-disable-next-line react-doctor/prefer-dynamic-import -- recharts only ships when this chart mounts
} from "recharts";
import type {
  GrowthInsightType,
  WorkspaceGrowthMetrics,
} from "@/types/workspace-usage.types";

interface GrowthInsightsSectionProps {
  workspaceGrowth: WorkspaceGrowthMetrics;
}

interface GrowthMetricProps {
  label: string;
  value: number;
  change: number | null;
  icon: React.ElementType;
}

function GrowthMetric({ label, value, change, icon: Icon }: GrowthMetricProps) {
  const hasChange = change !== null && change !== 0;
  const isPositive = change !== null && change > 0;

  return (
    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50 border border-border">
      <div className={`p-2 rounded-lg sm:rounded-xl shrink-0 ${
        isPositive ? "bg-green-100 dark:bg-green-900/30"
        : hasChange ? "bg-red-100 dark:bg-red-900/30"
        : "bg-muted"
      }`}>
        <Icon className={`w-3.5 h-3.5 ${
          isPositive ? "text-green-600 dark:text-green-400"
          : hasChange ? "text-red-600 dark:text-red-400"
          : "text-muted-foreground"
        }`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground truncate">{label}</p>
        {/* Smaller font on mobile — text-xl at 2-col (~160px) clips */}
        <p className="text-base sm:text-xl font-bold text-foreground leading-tight">{value}</p>
      </div>
      {/* Badge: only shown when there is a real previous-month baseline */}
      {hasChange && (
        <div className={`text-xs font-semibold shrink-0 ${
          isPositive ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
        }`}>
          <span className="hidden sm:inline">
            {isPositive && <TrendingUp className="w-3 h-3 inline mr-0.5" />}
            {!isPositive && <TrendingDown className="w-3 h-3 inline mr-0.5" />}
          </span>
          {isPositive ? "+" : ""}{change}%
        </div>
      )}
    </div>
  );
}

const insightStyles: Record<GrowthInsightType, { wrapper: string; dot: string; text: string }> = {
  positive: {
    wrapper: "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800",
    dot:     "bg-green-500",
    text:    "text-green-900 dark:text-green-100",
  },
  warning: {
    wrapper: "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800",
    dot:     "bg-orange-500",
    text:    "text-orange-900 dark:text-orange-100",
  },
  neutral: {
    wrapper: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800",
    dot:     "bg-blue-500",
    text:    "text-blue-900 dark:text-blue-100",
  },
};

export function GrowthInsightsSection({ workspaceGrowth }: GrowthInsightsSectionProps) {
  const { thisMonth, projectLifecycle, trend, changes, insights } = workspaceGrowth;

  const growthMetrics: GrowthMetricProps[] = [
    { label: "New Tasks",    value: thisMonth.newTasks,          change: changes.newTasks,    icon: ListTodo    },
    { label: "New Members",  value: thisMonth.newUsers,          change: changes.newUsers,    icon: Users       },
    { label: "New Projects", value: thisMonth.newProjects,       change: changes.newProjects, icon: Folder      },
    { label: "Completed",    value: projectLifecycle.completed,  change: null,                icon: CheckCircle },
  ];

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        <h2 className="text-base sm:text-lg font-semibold text-foreground">
          Growth Insights
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {growthMetrics.map((m) => (
          <GrowthMetric key={m.label} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* 6-month trend chart — h-44/h-56 are valid Tailwind scale values */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">
            6-Month Trend
          </h3>
          <div className="h-44 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  stroke="var(--border)"
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  stroke="var(--border)"
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                  }}
                />
                <Bar dataKey="tasks"    name="Tasks"    fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="users"    name="Users"    fill="var(--chart-3)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="projects" name="Projects" fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key insights + lifecycle */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-foreground">Key Insights</h3>
          </div>

          <div className="space-y-2 sm:space-y-3 flex-1">
            {insights.map((insight) => {
              const styles = insightStyles[insight.type] ?? insightStyles.neutral;
              // Backend always returns a valid type, but keep a safe fallback.
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
                { label: "Created",   value: projectLifecycle.created,   color: "text-chart-1"          },
                { label: "Active",    value: projectLifecycle.active,    color: "text-chart-2"          },
                { label: "Done",      value: projectLifecycle.completed, color: "text-chart-3"          },
                { label: "Archived",  value: projectLifecycle.archived,  color: "text-muted-foreground" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-muted/50"
                >
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
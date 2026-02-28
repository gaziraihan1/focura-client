// components/Analytics/WorkspaceUsage/FeatureUsageSection.tsx
"use client";

import {
  ListTodo,
  MessageCircle,
  Clock,
  FileUp,
  AtSign,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type {
  WorkspaceGrowthMetrics,
  ProjectActivityMetrics,
} from "@/types/workspace-usage.types";

interface FeatureUsageSectionProps {
  workspaceGrowth: WorkspaceGrowthMetrics;
  projectActivity: ProjectActivityMetrics;
}

interface FeatureCardProps {
  icon: React.ElementType;
  label: string;
  count: number;
  change: number;
  accentColor: string;
  bgColor: string;
}

function MiniBar({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 h-8 mt-3">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-blue-500 opacity-40"
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  label,
  count,
  change,
  accentColor,
  bgColor,
}: FeatureCardProps) {
  const isPositive = change >= 0;
  return (
    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:shadow-sm hover:border-primary/20 transition-all duration-200">
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${bgColor}`}>
          <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentColor}`} />
        </div>
        <span
          className={`flex items-center gap-0.5 text-xs font-semibold ${
            isPositive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          ) : (
            <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          )}
          {isPositive ? "+" : ""}
          {change}%
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-0.5 sm:mb-1">{label}</p>
      <p className="text-xl font-bold text-foreground">{count.toLocaleString()}</p>
      <MiniBar data={[40, 55, 65, 70, 75, 85, 90]} />
    </div>
  );
}

export function FeatureUsageSection({
  workspaceGrowth,
}: FeatureUsageSectionProps) {
  const features: FeatureCardProps[] = [
    {
      icon: ListTodo,
      label: "Tasks Created",
      count: workspaceGrowth.thisMonth.newTasks,
      change: 18,
      accentColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      icon: MessageCircle,
      label: "Comments Added",
      count: 234,
      change: 22,
      accentColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30",
    },
    {
      icon: Clock,
      label: "Time Entries",
      count: 156,
      change: 12,
      accentColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
    },
    {
      icon: FileUp,
      label: "Files Uploaded",
      count: 89,
      change: 15,
      accentColor: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/30",
    },
    {
      icon: AtSign,
      label: "Mentions Used",
      count: 67,
      change: 8,
      accentColor: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/30",
    },
    {
      icon: Bell,
      label: "Notifications",
      count: 423,
      change: 25,
      accentColor: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-900/30",
    },
  ];

  const distributionData = features.map((f) => ({
    name: f.label.split(" ")[0],
    value: f.count,
  }));

  return (
    <section className="space-y-3 sm:space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Feature Usage</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Adoption metrics and engagement patterns
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3">
        {features.map((feature) => (
          <FeatureCard key={feature.label} {...feature} />
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">
          Feature Usage Distribution
        </h3>
        <div className="h-45 sm:h-55">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 13, fill: "hsl(var(--muted-foreground))" }}
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
                  fontSize: "14px",
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
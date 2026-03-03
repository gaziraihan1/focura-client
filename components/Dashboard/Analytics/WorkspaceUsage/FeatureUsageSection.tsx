"use client";

import {
  ListTodo,
  MessageCircle,
  Clock,
  FileUp,
  AtSign,
  Bell,
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
import type { FeatureUsageMetrics } from "@/types/workspace-usage.types";

interface FeatureUsageSectionProps {
  featureUsage: FeatureUsageMetrics;
}

interface FeatureCardProps {
  icon: React.ElementType;
  label: string;
  count: number;
  accentColor: string;
  bgColor: string;
}

function FeatureCard({ icon: Icon, label, count, accentColor, bgColor }: FeatureCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
        <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl ${bgColor}`}>
          <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentColor}`} />
        </div>
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-lg sm:text-2xl font-bold text-foreground">
        {count.toLocaleString()}
      </p>
    </div>
  );
}

export function FeatureUsageSection({ featureUsage }: FeatureUsageSectionProps) {
  const features: FeatureCardProps[] = [
    {
      icon: ListTodo,
      label: "Tasks Created",
      count: featureUsage.tasksCreated,
      accentColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      icon: MessageCircle,
      label: "Comments Added",
      count: featureUsage.commentsAdded,
      accentColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30",
    },
    {
      icon: Clock,
      label: "Time Entries",
      count: featureUsage.timeEntriesLogged,
      accentColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
    },
    {
      icon: FileUp,
      label: "Files Uploaded",
      count: featureUsage.filesUploaded,
      accentColor: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/30",
    },
    {
      icon: AtSign,
      label: "Mentions Used",
      count: featureUsage.mentionsUsed,
      accentColor: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/30",
    },
    {
      icon: Bell,
      label: "Notifications",
      count: featureUsage.notificationsTriggered,
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
        <h2 className="text-base sm:text-lg font-semibold text-foreground">
          Feature Usage
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Last 30 days</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {features.map((feature) => (
          <FeatureCard key={feature.label} {...feature} />
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">
          Feature Usage Distribution
        </h3>
        {/* h-44 = 176px — standard Tailwind scale, no arbitrary values */}
        <div className="h-44 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
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
// oxlint-disable-next-line react-doctor/prefer-dynamic-import -- recharts only ships when this chart mounts
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
    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5 hover:shadow-md hover:border-primary/20 transition-colors duration-300">
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
  // Theme-aware chart tokens (defined in globals.css) — consistent with the rest
  // of the analytics palette in both light and dark mode.
  const features: FeatureCardProps[] = [
    {
      icon: ListTodo,
      label: "Tasks Created",
      count: featureUsage.tasksCreated,
      accentColor: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      icon: MessageCircle,
      label: "Comments Added",
      count: featureUsage.commentsAdded,
      accentColor: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      icon: Clock,
      label: "Time Entries",
      count: featureUsage.timeEntriesLogged,
      accentColor: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      icon: FileUp,
      label: "Files Uploaded",
      count: featureUsage.filesUploaded,
      accentColor: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      icon: AtSign,
      label: "Mentions Used",
      count: featureUsage.mentionsUsed,
      accentColor: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
    {
      icon: Bell,
      label: "Notifications",
      count: featureUsage.notificationsTriggered,
      accentColor: "text-chart-1",
      bgColor: "bg-chart-1/10",
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
                stroke="var(--border)"
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
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
                width={40}
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
              <Bar
                dataKey="value"
                fill="var(--primary)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
// lib/analytics-utils.ts

import { TasksByPriorityItem } from "@/hooks/useAnalytics";
import { AlertCircle, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatHours(hours: number): string {
  if (hours === 0) return "0h";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  return `${hours.toFixed(1)}h`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Task statuses
    TODO: "text-gray-600 dark:text-gray-400 bg-gray-500/10",
    IN_PROGRESS: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    IN_REVIEW: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
    BLOCKED: "text-red-600 dark:text-red-400 bg-red-500/10",
    COMPLETED: "text-green-600 dark:text-green-400 bg-green-500/10",
    CANCELLED: "text-gray-600 dark:text-gray-400 bg-gray-500/10",

    // Project statuses
    PLANNING: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10",
    ACTIVE: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    ON_HOLD: "text-orange-600 dark:text-orange-400 bg-orange-500/10",
    ARCHIVED: "text-gray-600 dark:text-gray-400 bg-gray-500/10",

    // Priorities
    URGENT: "text-red-600 dark:text-red-400 bg-red-500/10",
    HIGH: "text-orange-600 dark:text-orange-400 bg-orange-500/10",
    MEDIUM: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10",
    LOW: "text-green-600 dark:text-green-400 bg-green-500/10",
  };

  return colors[status] || "text-gray-600 dark:text-gray-400 bg-gray-500/10";
}

export function getHealthColor(
  health: "healthy" | "at-risk" | "critical",
): string {
  const colors = {
    healthy:
      "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/30",
    "at-risk":
      "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    critical: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30",
  };
  return colors[health];
}

export function getWorkloadColor(
  status: "normal" | "high" | "overloaded",
): string {
  const colors = {
    normal: "text-green-600 dark:text-green-400 bg-green-500/10",
    high: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10",
    overloaded: "text-red-600 dark:text-red-400 bg-red-500/10",
  };
  return colors[status];
}

export function getRiskColor(risk: "low" | "medium" | "high"): string {
  const colors = {
    low: "text-green-600 dark:text-green-400",
    medium: "text-yellow-600 dark:text-yellow-400",
    high: "text-red-600 dark:text-red-400",
  };
  return colors[risk];
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days <= 7) return `Due in ${days}d`;
  return formatDate(d);
}

// Chart colors using Tailwind CSS variables
export const chartColors = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  success: "rgb(34 197 94)",
  warning: "rgb(251 146 60)",
  danger: "rgb(239 68 68)",
  info: "rgb(59 130 246)",
  purple: "rgb(168 85 247)",
  chart1: "hsl(var(--chart-1))",
  chart2: "hsl(var(--chart-2))",
  chart3: "hsl(var(--chart-3))",
  chart4: "hsl(var(--chart-4))",
  chart5: "hsl(var(--chart-5))",
};

export function calculateTrendPercentage(
  current: number,
  previous: number,
): {
  value: number;
  direction: "up" | "down" | "stable";
} {
  if (previous === 0) {
    return { value: 100, direction: current > 0 ? "up" : "stable" };
  }

  const percentage = ((current - previous) / previous) * 100;
  const direction = percentage > 0 ? "up" : percentage < 0 ? "down" : "stable";

  return {
    value: Math.abs(Math.round(percentage)),
    direction,
  };
}

export function getInitials(name: string | null): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface PriorityDistributionProps {
  data: TasksByPriorityItem[]
}
export function priorityDistribution({data}: PriorityDistributionProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const priorityConfig = {
    URGENT: {
      label: 'Urgent',
      color: 'bg-red-500',
      textColor: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500/10',
      icon: AlertCircle,
    },
    HIGH: {
      label: 'High',
      color: 'bg-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10',
      icon: AlertTriangle,
    },
    MEDIUM: {
      label: 'Medium',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      icon: Clock,
    },
    LOW: {
      label: 'Low',
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
      icon: CheckCircle,
    },
  };

  const maxCount = Math.max(...data.map((item) => item.count), 1);

  return {
    total,
    priorityConfig,
    maxCount
  }
}
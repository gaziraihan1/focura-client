import { ExecutiveKPIs, TaskStatusItem } from "@/hooks/useAnalytics";
import { formatHours } from "@/utils/analytics.utils";
import { AlertCircle, CheckCircle2, Folder, HardDrive, LayoutGrid, Timer, TrendingUp, Users } from "lucide-react";

interface KpisCardProps {
    kpis: ExecutiveKPIs
}
export function kpisCard ({kpis}: KpisCardProps) {
    const cards = [
    {
      label: 'Total Projects',
      value: kpis.totalProjects,
      icon: Folder,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Active Projects',
      value: kpis.activeProjects,
      icon: LayoutGrid,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Total Tasks',
      value: kpis.totalTasks,
      icon: CheckCircle2,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-500/10',
    },
    {
      label: 'Completed',
      value: kpis.completedTasks,
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Overdue',
      value: kpis.overdueTasks,
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      label: 'Completion Rate',
      value: `${kpis.completionRate}%`,
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Team Members',
      value: kpis.totalMembers,
      icon: Users,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      label: 'Active Members',
      value: kpis.activeMembers,
      icon: Users,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-500/10',
      subtitle: 'Last 7 days',
    },
    {
      label: 'Hours Logged',
      value: formatHours(kpis.totalHours),
      icon: Timer,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Storage Used',
      value: `${kpis.storageUsed.toFixed(1)} MB`,
      icon: HardDrive,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-500/10',
    },
  ];
  
  return {cards}
}

interface ChartData {
    data: TaskStatusItem[]
}
export function statusChartData({data}: ChartData) {
    const total = data.reduce((sum, item) => sum + item.count, 0);

  // Calculate cumulative percentages for conic gradient
  let cumulative = 0;
  const segments = data.map((item) => {
    const start = cumulative;
    const percentage = (item.count / total) * 100;
    cumulative += percentage;
    return {
      ...item,
      start,
      end: cumulative,
    };
  });

  const colors = [
    'rgb(156 163 175)', // gray - TODO
    'rgb(59 130 246)',  // blue - IN_PROGRESS
    'rgb(168 85 247)',  // purple - IN_REVIEW
    'rgb(239 68 68)',   // red - BLOCKED
    'rgb(34 197 94)',   // green - COMPLETED
    'rgb(156 163 175)', // gray - CANCELLED
  ];

  const conicGradient = segments
    .map((segment, index) => {
      const color = colors[index % colors.length];
      return `${color} ${segment.start}% ${segment.end}%`;
    })
    .join(', ');

    return {
        colors,
        conicGradient,
        total
    }
}
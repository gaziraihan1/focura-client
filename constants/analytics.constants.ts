import { ExecutiveKPIs, TaskStatusItem } from "@/hooks/useAnalytics";
import { formatHours } from "@/utils/analytics.utils";
import { AlertCircle, CheckCircle2, Folder, HardDrive, LayoutGrid, Timer, TrendingUp, Users, type LucideIcon } from "lucide-react";

interface KpisCardProps {
    kpis: ExecutiveKPIs
}
// Static, literal class pairs so Tailwind v4 generates each utility.
const KPI_TOKEN_CLASSES: Array<{ color: string; bgColor: string }> = [
  { color: 'text-chart-1', bgColor: 'bg-chart-1/10' },
  { color: 'text-chart-2', bgColor: 'bg-chart-2/10' },
  { color: 'text-chart-3', bgColor: 'bg-chart-3/10' },
  { color: 'text-chart-4', bgColor: 'bg-chart-4/10' },
  { color: 'text-chart-5', bgColor: 'bg-chart-5/10' },
];

interface KpiCard {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  subtitle?: string;
}

export function kpisCard ({kpis}: KpisCardProps) {
    const cards: KpiCard[] = [
    {
      label: 'Total Projects',
      value: kpis.totalProjects,
      icon: Folder,
      ...KPI_TOKEN_CLASSES[0],
    },
    {
      label: 'Active Projects',
      value: kpis.activeProjects,
      icon: LayoutGrid,
      ...KPI_TOKEN_CLASSES[1],
    },
    {
      label: 'Total Tasks',
      value: kpis.totalTasks,
      icon: CheckCircle2,
      ...KPI_TOKEN_CLASSES[2],
    },
    {
      label: 'Completed',
      value: kpis.completedTasks,
      icon: CheckCircle2,
      ...KPI_TOKEN_CLASSES[3],
    },
    {
      label: 'Overdue',
      value: kpis.overdueTasks,
      icon: AlertCircle,
      ...KPI_TOKEN_CLASSES[4],
    },
    {
      label: 'Completion Rate',
      value: `${kpis.completionRate}%`,
      icon: TrendingUp,
      ...KPI_TOKEN_CLASSES[0],
    },
    {
      label: 'Team Members',
      value: kpis.totalMembers,
      icon: Users,
      ...KPI_TOKEN_CLASSES[1],
    },
    {
      label: 'Active Members',
      value: kpis.activeMembers,
      icon: Users,
      ...KPI_TOKEN_CLASSES[2],
      subtitle: 'Last 7 days',
    },
    {
      label: 'Hours Logged',
      value: formatHours(kpis.totalHours),
      icon: Timer,
      ...KPI_TOKEN_CLASSES[3],
    },
    {
      label: 'Storage Used',
      value: `${kpis.storageUsed.toFixed(1)} MB`,
      icon: HardDrive,
      ...KPI_TOKEN_CLASSES[4],
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

  // Theme-aware chart tokens (defined in globals.css) - keeps the donut
  // consistent with the rest of the analytics palette in both themes.
  const colors = [
    'var(--chart-1)', // TODO
    'var(--chart-2)',  // IN_PROGRESS
    'var(--chart-3)',  // IN_REVIEW
    'var(--chart-4)',  // BLOCKED
    'var(--chart-5)',  // COMPLETED
    'var(--chart-1)',  // CANCELLED
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
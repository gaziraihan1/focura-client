import { TaskStats } from "@/hooks/useTask";
import { motion } from "framer-motion";
import {
  ListFilter,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from "lucide-react";

// interface TaskStats {
//   totalTasks: number;
//   inProgress: number;
//   completed: number;
//   dueToday: number;
//   overdue: number;
// }

interface TaskStatsGridProps {
  stats: TaskStats;
}

export function TaskStatsGrid({ stats }: TaskStatsGridProps) {
  const statCards = [
    {
      label: "Total",
      value: stats.totalTasks || 0,
      icon: ListFilter,
      color: "blue",
    },
    {
      label: "In Progress",
      value: stats.inProgress || 0,
      icon: Clock,
      color: "purple",
    },
    {
      label: "Completed",
      value: stats.completed || 0,
      icon: CheckCircle2,
      color: "green",
    },
    {
      label: "Due Today",
      value: stats.dueToday || 0,
      icon: Calendar,
      color: "orange",
    },
    {
      label: "Overdue",
      value: stats.overdue || 0,
      icon: AlertCircle,
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  delay: number;
}

function StatCard({ label, value, icon: Icon, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-xl bg-card border border-border"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500/10`}>
          <Icon size={20} className={`text-${color}-500`} />
        </div>
      </div>
    </motion.div>
  );
}
import { motion } from "framer-motion";
import { 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo, 
  TrendingUp,
  Users
} from "lucide-react";

interface TaskStats {
  personal: number;
  assigned: number;
  created?: number;
  dueToday: number;
  overdue: number;
  totalTasks?: number;
  inProgress?: number;
  completed?: number;
  byStatus?: Record<string, number>;
}

interface TaskStatsCardsProps {
  stats: TaskStats;
  activeTab?: "all" | "personal" | "assigned";
}

export function TaskStatsCards({ stats, activeTab = "all" }: TaskStatsCardsProps) {
  const getStatCards = () => {
    switch (activeTab) {
      case "personal":
        return [
          {
            label: "Personal Tasks",
            value: stats.personal,
            icon: User,
            color: "blue",
            bgClass: "bg-blue-500/10",
            iconClass: "text-blue-500",
          },
          {
            label: "In Progress",
            value: stats.inProgress ?? 0,
            icon: TrendingUp,
            color: "yellow",
            bgClass: "bg-yellow-500/10",
            iconClass: "text-yellow-500",
          },
          {
            label: "Completed",
            value: stats.completed ?? 0,
            icon: CheckCircle2,
            color: "green",
            bgClass: "bg-green-500/10",
            iconClass: "text-green-500",
          },
          {
            label: "Overdue",
            value: stats.overdue,
            icon: AlertCircle,
            color: "red",
            bgClass: "bg-red-500/10",
            iconClass: "text-red-500",
          },
        ];

      case "assigned":
        return [
          {
            label: "Assigned to Me",
            value: stats.assigned,
            icon: Users,
            color: "purple",
            bgClass: "bg-purple-500/10",
            iconClass: "text-purple-500",
          },
          {
            label: "In Progress",
            value: stats.inProgress ?? 0,
            icon: TrendingUp,
            color: "yellow",
            bgClass: "bg-yellow-500/10",
            iconClass: "text-yellow-500",
          },
          {
            label: "Completed",
            value: stats.completed ?? 0,
            icon: CheckCircle2,
            color: "green",
            bgClass: "bg-green-500/10",
            iconClass: "text-green-500",
          },
          {
            label: "Overdue",
            value: stats.overdue,
            icon: AlertCircle,
            color: "red",
            bgClass: "bg-red-500/10",
            iconClass: "text-red-500",
          },
        ];

      case "all":
      default:
        return [
          {
            label: "Total Tasks",
            value: stats.totalTasks ?? 0,
            icon: ListTodo,
            color: "indigo",
            bgClass: "bg-indigo-500/10",
            iconClass: "text-indigo-500",
          },
          {
            label: "Personal",
            value: stats.personal,
            icon: User,
            color: "blue",
            bgClass: "bg-blue-500/10",
            iconClass: "text-blue-500",
          },
          {
            label: "Assigned",
            value: stats.assigned,
            icon: Users,
            color: "purple",
            bgClass: "bg-purple-500/10",
            iconClass: "text-purple-500",
          },
          {
            label: "Due Today",
            value: stats.dueToday,
            icon: Clock,
            color: "orange",
            bgClass: "bg-orange-500/10",
            iconClass: "text-orange-500",
          },
          {
            label: "Overdue",
            value: stats.overdue,
            icon: AlertCircle,
            color: "red",
            bgClass: "bg-red-500/10",
            iconClass: "text-red-500",
          },
          {
            label: "In Progress",
            value: stats.inProgress ?? 0,
            icon: TrendingUp,
            color: "yellow",
            bgClass: "bg-yellow-500/10",
            iconClass: "text-yellow-500",
          },
          {
            label: "Completed",
            value: stats.completed ?? 0,
            icon: CheckCircle2,
            color: "green",
            bgClass: "bg-green-500/10",
            iconClass: "text-green-500",
          },
        ];
    }
  };

  const statCards = getStatCards();

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${
      activeTab === "all" ? "lg:grid-cols-4 xl:grid-cols-7" : "lg:grid-cols-4"
    } gap-4`}>
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-4 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgClass}`}>
              <stat.icon size={20} className={stat.iconClass} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
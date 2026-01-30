import { motion } from "framer-motion";
import {
  FolderKanban,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
} from "lucide-react";

interface WorkspaceStatsProps {
  stats: {
    totalProjects: number;
    completedTasks: number;
    completionRate: number;
    overdueTasks: number;
    totalMembers: number;
  };
  maxMembers: number;
}

export function WorkspaceStats({ stats, maxMembers }: WorkspaceStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl bg-card border border-border"
      >
        <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
          <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10">
            <FolderKanban className="text-blue-500" size={16} />
          </div>
          <TrendingUp className="text-muted-foreground" size={12} />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
          {stats.totalProjects}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">Projects</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl bg-card border border-border"
      >
        <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
          <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10">
            <CheckCircle2 className="text-green-500" size={16} />
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {stats.completionRate}%
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
          {stats.completedTasks}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl bg-card border border-border"
      >
        <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
          <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/10">
            <Clock className="text-orange-500" size={16} />
          </div>
          <AlertCircle className="text-orange-500" size={12} />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
          {stats.overdueTasks}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">Overdue</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl bg-card border border-border"
      >
        <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
          <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10">
            <Users className="text-purple-500" size={16} />
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {maxMembers} max
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
          {stats.totalMembers}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">Members</p>
      </motion.div>
    </div>
  );
}
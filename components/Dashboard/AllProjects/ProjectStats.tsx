// components/Projects/ProjectStats.tsx
"use client";

import { motion } from "framer-motion";
import { FolderKanban, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";

interface ProjectStatsProps {
  total: number;
  active: number;
  completed: number;
  totalTasks: number;
}

export function ProjectStats({ total, active, completed, totalTasks }: ProjectStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
    >
      <StatsCard
        icon={<FolderKanban className="w-5 h-5" />}
        label="Total Projects"
        value={total}
        color="blue"
      />
      <StatsCard
        icon={<Sparkles className="w-5 h-5" />}
        label="Active"
        value={active}
        color="purple"
      />
      <StatsCard
        icon={<CheckCircle2 className="w-5 h-5" />}
        label="Completed"
        value={completed}
        color="green"
      />
      <StatsCard
        icon={<TrendingUp className="w-5 h-5" />}
        label="Total Tasks"
        value={totalTasks}
        color="orange"
      />
    </motion.div>
  );
}

function StatsCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "blue" | "purple" | "green" | "orange";
}) {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-600 dark:text-blue-400",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-600 dark:text-purple-400",
    green: "from-green-500/10 to-green-600/5 border-green-500/20 text-green-600 dark:text-green-400",
    orange: "from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-600 dark:text-orange-400",
  };

  return (
    <div
      className={`p-2 rounded-xl bg-linear-to-br border backdrop-blur-sm ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm opacity-80">{label}</p>
        </div>
      </div>
    </div>
  );
}
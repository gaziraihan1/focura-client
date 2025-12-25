"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, ChevronRight, Building2 } from "lucide-react";
import { ProjectData } from "@/types/project.types";

interface ProjectListItemProps {
  project: ProjectData;
  index: number;
  onNavigate: () => void;
}

export function ProjectListItem({ project, index, onNavigate }: ProjectListItemProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PLANNING: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      ACTIVE: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      ON_HOLD: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      COMPLETED: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      ARCHIVED: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
    };
    return colors[status] || "bg-gray-500/10 text-gray-500";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      URGENT: "bg-red-500/10 text-red-600 dark:text-red-400",
      HIGH: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      MEDIUM: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      LOW: "bg-green-500/10 text-green-600 dark:text-green-400",
    };
    return colors[priority] || "bg-gray-500/10 text-gray-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ x: 4 }}
      onClick={onNavigate}
      className="group cursor-pointer rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 p-2 sm:p-4 lg:p-6"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        {project.icon ? (
          <div className="text-2xl">{project.icon}</div>
        ) : (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0"
            style={{ backgroundColor: project.color || "#667eea" }}
          >
            {project.name.charAt(0)}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="lg:text-lg font-bold text-foreground truncate group-hover:text-primary transition">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-muted-foreground truncate">
                  {project.description}
                </p>
              )}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                  project.priority
                )}`}
              >
                {project.priority}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
            {project.workspace && (
              <div className="flex flex-wrap items-center gap-1.5">
                <Building2 size={14} />
                <span>{project.workspace.name}</span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>{project._count?.tasks || project.stats?.totalTasks || 0} tasks</span>
            </div>
            {project.dueDate && (
              <div className="flex flex-wrap items-center gap-1.5">
                <Calendar size={14} />
                <span>{new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    </motion.div>
  );
}
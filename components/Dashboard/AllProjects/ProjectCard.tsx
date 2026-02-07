// components/Projects/ProjectCard.tsx
"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, ChevronRight, Building2 } from "lucide-react";
import { ProjectData } from "@/types/project.types";
import { AccessDeniedModal } from "../Projects/WorkspaceProjects/AceessDeniedModal";

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  onNavigate: () => void;
  showModal: boolean;
  onCloseModal: () => void;
}

export function ProjectCard({ project, index, onNavigate, showModal, onCloseModal }: ProjectCardProps) {
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -4 }}
        onClick={onNavigate}
        className="group cursor-pointer rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
      >
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {project.icon ? (
                <div className="text-3xl">{project.icon}</div>
              ) : (
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: project.color }}
                >
                  {project.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition">
                  {project.name}
                </h3>
                {project.workspace && (
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <Building2 size={12} />
                    {project.workspace.name}
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {project.description}
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
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

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} />
              <span>{project._count?.tasks || project.stats?.totalTasks || 0} tasks</span>
            </div>
            {project.dueDate && (
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>{new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal - rendered separately, not replacing the card */}
      {showModal && <AccessDeniedModal isOpen={showModal} onClose={onCloseModal} />}
    </>
  );
}
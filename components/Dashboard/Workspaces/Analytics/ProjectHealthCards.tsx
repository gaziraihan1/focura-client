'use client';

import { ProjectHealth } from '@/hooks/useAnalytics';
import { formatDate, getHealthColor } from '@/utils/analytics.utils';
import { Folder, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface ProjectHealthCardsProps {
  data: ProjectHealth[];
}

export function ProjectHealthCards({ data }: ProjectHealthCardsProps) {
  const healthIcons = {
    healthy: <CheckCircle2 className="w-4 h-4" />,
    'at-risk': <AlertCircle className="w-4 h-4" />,
    critical: <AlertCircle className="w-4 h-4" />,
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-6">Project Health</h2>

      <div className="space-y-4">
        {data.map((project) => (
          <div
            key={project.projectId}
            className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <Folder className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{project.projectName}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {project.completedTasks} of {project.totalTasks} tasks
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border shrink-0 ml-4 ${getHealthColor(
                  project.health
                )}`}
              >
                {healthIcons[project.health]}
                <span className="capitalize">{project.health}</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    project.health === 'healthy'
                      ? 'bg-green-500'
                      : project.health === 'at-risk'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className={`px-2 py-1 rounded ${
                project.status === 'ACTIVE'
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : project.status === 'PLANNING'
                  ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                  : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
              }`}>
                {project.status}
              </span>
              {project.dueDate && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Due {formatDate(project.dueDate)}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No projects yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
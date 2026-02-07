import { CheckCircle2, FolderKanban } from 'lucide-react'
import React from 'react'
import { ProjectDetails as Details } from '@/hooks/useProjects'
import { statusColors } from './ProjectCard';

interface ProjectDetailsProps {
    project?: Details;
    joined?: boolean;
}

export default function ProjectDetails({project, joined}: ProjectDetailsProps) {
    
  return (
    <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold shrink-0"
              style={{
                backgroundColor: `${project?.color || "#667eea"}20`,
              }}
            >
              {project?.icon ? (
                <span className="text-2xl">{project.icon}</span>
              ) : (
                <FolderKanban
                  size={20}
                  style={{ color: project?.color || "#667eea" }}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {project?.name}
              </h3>
              {project?.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            {project?.status && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  statusColors[project.status] || "bg-muted text-foreground"
                }`}
              >
                {project.status.replace("_", " ")}
              </span>
            )}
            {joined && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 whitespace-nowrap">
                <CheckCircle2 size={14} />
                Joined
              </span>
            )}
          </div>
        </div>

  )
}

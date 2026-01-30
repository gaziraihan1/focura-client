import { ProjectDetails } from '@/hooks/useProjects'
import { Crown } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface ProjectsTopPerformerProps {
    project: ProjectDetails
}

export default function ProjectsTopPerformer({project}: ProjectsTopPerformerProps) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground">Top Performer</span>
              </div>
              <div className="flex items-center gap-2">
                {project?.stats?.topPerformer?.image ? (
                  <Image
                  width={32}
                  height={32}
                    src={project.stats.topPerformer.image}
                    alt={project.stats.topPerformer.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                    {project?.stats?.topPerformer?.name.charAt(0)}
                  </div>
                )}
                <span className="font-semibold text-foreground text-sm">
                  {project?.stats?.topPerformer?.name}
                </span>
              </div>
            </div>
  )
}

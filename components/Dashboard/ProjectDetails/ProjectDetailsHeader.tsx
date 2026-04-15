import { ProjectDetails } from '@/hooks/useProjects';
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import ProjectDropdown from './ProjectDropdown';

interface ProjectDetailsHeaderProps {
  project: ProjectDetails
}

export default function ProjectDetailsHeader({project}: ProjectDetailsHeaderProps) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-accent rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold text-white"
                  style={{ backgroundColor: project.color }}
                >
                  {project.icon || project.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-lg md:text-3xl font-bold text-foreground truncate">{project.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {project.workspace?.name || 'Workspace'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ProjectDropdown />
          </div>
        </div>
  )
}

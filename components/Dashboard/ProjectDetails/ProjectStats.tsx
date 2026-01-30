import { ProjectDetails } from '@/hooks/useProjects';
import React from 'react'
interface ProjectStatsProps {
    activeTab: string;
    setActiveTab: (v: string) => void;
    project: ProjectDetails;
}

export default function ProjectStats({activeTab, setActiveTab, project}: ProjectStatsProps) {
  return (
    <div className="border-b border-border">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`pb-4 px-2 font-medium transition border-b-2 ${
                activeTab === 'tasks'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Tasks ({project.stats.totalTasks})
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`pb-4 px-2 font-medium transition border-b-2 ${
                activeTab === 'members'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Members ({project.stats.totalMembers})
            </button>
          </div>
        </div>

  )
}

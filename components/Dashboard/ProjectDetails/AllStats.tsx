import React from 'react'
import StatCard from './StatCard'
import { Calendar, CheckSquare, TrendingUp, Users } from 'lucide-react'
import ProjectsTopPerformer from './ProjectsTopPerformer';
import PerformerEmptyState from './PerformerEmptyState';
import { ProjectDetails } from '@/hooks/useProjects';

interface AllStatsProps {
    completionRate: number;
    project: ProjectDetails;
}


export default function AllStats({completionRate, project}: AllStatsProps) {
  return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard 
            icon={CheckSquare}
            label="Total Tasks"
            value={project.stats.totalTasks}
            color="text-blue-500"
          />
          <StatCard
            icon={Users}
            label="Team Members"
            value={project.stats.totalMembers}
            color="text-green-500"
          />
          <StatCard
            icon={Calendar}
            label="Project Days"
            value={project.stats.projectDays}
            color="text-purple-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Completion"
            value={`${completionRate}%`}
            color="text-orange-500"
          />
          {project.stats.topPerformer ? (
            <ProjectsTopPerformer project={project}/>
          ) : (
            <PerformerEmptyState />
          )}
        </div>
  )
}

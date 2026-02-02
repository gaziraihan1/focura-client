"use client"
import StatCard from '@/components/Dashboard/ProjectDetails/StatCard';
import { useProjectDetails } from '@/hooks/useProjects';
import { useWorkspaceProjectsPage } from '@/hooks/useProjectsPage';
import { LogOutIcon } from 'lucide-react';
import { useParams } from 'next/navigation'
import React from 'react'

interface StatCard {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | number;
  color: string;
}

export default function TeamPage() {
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;
  const controller = useWorkspaceProjectsPage({workspaceSlug});
  console.log(controller.workspace?._count.members)
  console.log(controller.projects[0]?._count?.members);
  console.log(controller.workspace?.members);
  console.log(controller.projectsData)
  const {data: projectMembersDetails} = useProjectDetails(controller.projects[0]?.id);
  console.log(projectMembersDetails?.members[0].user)

  const stats:StatCard[] = [
    {
      icon: LogOutIcon,
      label: 'Workspace',
      value: controller.workspace?._count.members,
      color: "sf"
    }
  ]

  return (
    <div>
    {/* Header */}
    <div>
      {
        stats.map((s,i) => (
          <StatCard key={i} icon={s.icon} color={s.color} value={s.value} label={s.label}/>
        ))
      }
    </div>
    {/* Tabs */}
    {/* Data shown */}
    </div>
  )
}

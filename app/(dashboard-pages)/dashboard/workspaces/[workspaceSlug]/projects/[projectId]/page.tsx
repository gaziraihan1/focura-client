"use client";

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { useProjectDetails } from '@/hooks/useProjects';
import TasksTab from '@/components/Dashboard/ProjectDetails/TaskTab';
import MembersTab from '@/components/Dashboard/ProjectDetails/MembersTab';
import LoadingState from '@/components/Dashboard/ProjectDetails/LoadingState';
import ProjectDetailsHeader from '@/components/Dashboard/ProjectDetails/ProjectDetailsHeader';
import ProjectStats from '@/components/Dashboard/ProjectDetails/ProjectStats';
import AllStats from '@/components/Dashboard/ProjectDetails/AllStats';
import { useUserProfile } from '@/hooks/useUser';
import { AccessDeniedProject } from '@/components/Dashboard/ProjectDetails/AccessDeniedProject';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;

  const [activeTab, setActiveTab] = useState('tasks');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const { data: response, isLoading, error } = useProjectDetails(projectId);
  const project = response;

  const { userId } = useUserProfile();

  const isMember = useMemo(() => {
    if (!project?.members || !userId) return false;
    
    return project.members.some(m => 
      m.userId === userId || m.user?.id === userId
    );
  }, [project?.members, userId]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Project not found</h2>
        <p className="text-muted-foreground mb-4">
          {error ? 'Failed to load project details' : 'This project does not exist or you do not have access'}
        </p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Check access
  if (!isMember && !project.isAdmin) {
    return (
      <AccessDeniedProject
        projectName={project.name}
        workspaceName={project.workspace?.name}
      />
    );
  }

  const completionRate =
    project.stats.totalTasks > 0
      ? Math.round((project.stats.completedTasks / project.stats.totalTasks) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background px-2 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <ProjectDetailsHeader project={project} />

        {project.description && (
          <div className="rounded-xl bg-card border border-border p-4">
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        )}

        <AllStats completionRate={completionRate} project={project} />

        <ProjectStats activeTab={activeTab} setActiveTab={setActiveTab} project={project} />

        {activeTab === 'tasks' && (
          <TasksTab
            project={project}
            showCreateTask={showCreateTask}
            setShowCreateTask={setShowCreateTask}
          />
        )}

        {activeTab === 'members' && (
          <MembersTab
            project={project}
            showAddMember={showAddMember}
            setShowAddMember={setShowAddMember}
          />
        )}
      </div>
    </div>
  );
}
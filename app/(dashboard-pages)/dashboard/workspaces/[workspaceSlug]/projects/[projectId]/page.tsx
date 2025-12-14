// app/dashboard/projects/[projectId]/page.tsx
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Users,
  CheckSquare,
  Calendar,
  TrendingUp,
  ChevronRight,
  Crown,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useProjectDetails } from '@/hooks/useProjects';
import StatCard from '@/components/Dashboard/ProjectDetails/StatCard';
import TasksTab from '@/components/Dashboard/ProjectDetails/TaskTab';
import MembersTab from '@/components/Dashboard/ProjectDetails/MembersTab';
import Image from 'next/image';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;

  const [activeTab, setActiveTab] = useState('tasks');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const { data: response, isLoading, error } = useProjectDetails(projectId);
  const project = response;
  console.log(response)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
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

  const completionRate =
    project.stats.totalTasks > 0
      ? Math.round((project.stats.completedTasks / project.stats.totalTasks) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-accent rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold text-white"
                  style={{ backgroundColor: project.color }}
                >
                  {project.icon || project.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {project.workspace?.name || 'Workspace'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {project.description && (
          <div className="rounded-xl bg-card border border-border p-4">
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        )}

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
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground">Top Performer</span>
              </div>
              <div className="flex items-center gap-2">
                {project.stats.topPerformer.image ? (
                  <Image
                  width={32}
                  height={32}
                    src={project.stats.topPerformer.image}
                    alt={project.stats.topPerformer.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                    {project.stats.topPerformer.name.charAt(0)}
                  </div>
                )}
                <span className="font-semibold text-foreground text-sm">
                  {project.stats.topPerformer.name}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Top Performer</span>
              </div>
              <p className="text-sm text-muted-foreground">No completed tasks yet</p>
            </div>
          )}
        </div>

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
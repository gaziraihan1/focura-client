"use client";

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { useProjectDetailsBySlug } from '@/hooks/useProjects';
import TasksTab      from '@/components/Dashboard/ProjectDetails/TaskTab';
import MembersTab    from '@/components/Dashboard/ProjectDetails/MembersTab';
import LoadingState  from '@/components/Dashboard/ProjectDetails/LoadingState';
import ProjectDetailsHeader from '@/components/Dashboard/ProjectDetails/ProjectDetailsHeader';
import ProjectStats  from '@/components/Dashboard/ProjectDetails/ProjectStats';
import AllStats      from '@/components/Dashboard/ProjectDetails/AllStats';
import { useUserProfile } from '@/hooks/useUser';
import { AccessDeniedProject } from '@/components/Dashboard/ProjectDetails/AccessDeniedProject';
import { AnnouncementList }  from '@/components/Dashboard/Workspaces/Announcement/AnnouncementList';
import { AnnouncementModal } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementModal';
import {
  useAnnouncementFilters,
  useProjectAnnouncements,
  useDeleteAnnouncement,
  useTogglePinAnnouncement,
} from '@/hooks/useAnnouncement';
import { useWorkspaceRole } from '@/hooks/useWorkspace';
import { useTeamMembers }   from '@/hooks/useTeam';
import { useAnnouncementModal } from '@/hooks/useAnnouncementPage';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [activeTab,      setActiveTab]      = useState('tasks');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddMember,  setShowAddMember]  = useState(false);
  const [deletingId,     setDeletingId]     = useState<string | null>(null);
  const [pinningId,      setPinningId]      = useState<string | null>(null);

  const projectSlug = params?.projectSlug as string;

  const { data: project, isLoading, error } = useProjectDetailsBySlug(projectSlug);

  // Derive IDs from the project response
  const workspaceId = project?.workspaceId ?? '';
  const projectId   = project?.id          ?? '';

  // Announcement hooks — only active when on the announcements tab
  const { filters, setPage } = useAnnouncementFilters();
  const { data: announcementData, isLoading: announcementsLoading } = useProjectAnnouncements(
    workspaceId,
    projectId,
    filters,
  );

    const { open: openModal, modalProps } = useAnnouncementModal(workspaceId, projectId);


  const workspaceRole = useWorkspaceRole(workspaceId);
  const { data: members = [] } = useTeamMembers(workspaceId);

  // Project managers/leads can also create — canManage from workspace role covers
  // admins/owners; we also check the current user's project role below
  const { userId } = useUserProfile();

  const currentProjectMember = useMemo(
    () => project?.members?.find((m) => m.userId === userId || m.user?.id === userId),
    [project?.members, userId],
  );

  const canManage =
    workspaceRole.isOwner ||
    workspaceRole.isAdmin ||
    currentProjectMember?.role === 'MANAGER' 

  const deleteAnnouncement = useDeleteAnnouncement(workspaceId);
  const togglePin          = useTogglePinAnnouncement(workspaceId);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await deleteAnnouncement.mutateAsync(id); }
    finally { setDeletingId(null); }
  };

  const handleTogglePin = async (id: string) => {
    setPinningId(id);
    try { await togglePin.mutateAsync(id); }
    finally { setPinningId(null); }
  };

  const isMember = useMemo(() => {
    if (!project?.members || !userId) return false;
    return project.members.some((m) => m.userId === userId || m.user?.id === userId);
  }, [project?.members, userId]);

  if (isLoading) return <LoadingState />;

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

        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {/* Tab header with create button */}
            {canManage && (
              <div className="flex justify-end">
                <button
                  onClick={openModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  New Announcement
                </button>
              </div>
            )}

            <AnnouncementList
              announcements={announcementData?.data ?? []}
              pagination={announcementData?.pagination ?? {
                page: 1, pageSize: 10, totalCount: 0,
                totalPages: 0, hasNext: false, hasPrev: false,
              }}
              canManage={canManage}
              isLoading={announcementsLoading}
              deletingId={deletingId}
              pinningId={pinningId}
              currentPage={filters.page ?? 1}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
              onPageChange={setPage}
            />
          </div>
        )}

        {activeTab === 'members' && (
          <MembersTab
            project={project}
            showAddMember={showAddMember}
            setShowAddMember={setShowAddMember}
          />
        )}
      </div>

      {/* Create modal — locked to this project, no scope picker */}
      <AnnouncementModal
        {...modalProps}
        members={members.map((m) => ({
          userId: m.id,
          user: { id: m.id, name: m.name, image: m.image ?? null },
        }))}
        lockedProjectId={projectId}   // locks scope, shows read-only pill
      />
    </div>
  );
}
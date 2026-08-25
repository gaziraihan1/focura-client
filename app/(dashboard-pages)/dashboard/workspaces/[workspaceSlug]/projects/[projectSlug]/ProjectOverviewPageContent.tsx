"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useProjectDetailsBySlug } from "@/hooks/useProjects";
import { useUserProfile } from "@/hooks/useUser";
import { useProjectMilestones, useProjectSprints, useProjectSections, useProjectViews } from "@/hooks/useProjectFeatures";
import { AccessDeniedProject } from "@/components/dashboard/projects/project-details/AccessDeniedProject";
import LoadingState from "@/components/dashboard/projects/project-details/LoadingState";
import { ProjectData } from "@/types/project.types";
import { ProjectHeader } from "@/components/dashboard/workspace/project-overview/ProjectHeader";
import { QuickAccessGrid } from "@/components/dashboard/workspace/project-overview/QuickAccessGrid";
import { TaskProgressCard } from "@/components/dashboard/workspace/project-overview/TaskProgressCard";
import { AtAGlanceCards } from "@/components/dashboard/workspace/project-overview/AtAGlanceCards";
import { StatsRibbon } from "@/components/dashboard/workspace/project-overview/StatsRibbon";

function daysUntil(dateStr: string | undefined): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

interface ProjectOverviewPageContentProps {
  workspaceSlug: string;
  projectSlug: string;
}

export function ProjectOverviewPageContent({ workspaceSlug, projectSlug }: ProjectOverviewPageContentProps) {
  const router = useRouter();
  const base = `/dashboard/workspaces/${workspaceSlug}/projects/${projectSlug}`;

  const { data: project, isLoading, error } = useProjectDetailsBySlug(projectSlug);
  const { data: milestoneStats } = useProjectMilestones(project?.id);
  const { data: sprintStats } = useProjectSprints(project?.id);
  const { data: sectionItems = [] } = useProjectSections(project?.id);
  const { data: viewItems = [] } = useProjectViews(project?.id);
  const { userId, isLoading: userLoading } = useUserProfile();

  const isMember = useMemo(() => {
    if (!project?.members || !userId) return false;
    return project.members.some((m) => m.userId === userId || m.user?.id === userId);
  }, [project?.members, userId]);

  const canManage = useMemo(() => {
    if (!project || !userId) return false;
    if (project.isAdmin) return true;
    return !!project.members?.some(
      (m) =>
        (m.userId === userId || m.user?.id === userId) && m.role === "MANAGER",
    );
  }, [project, userId]);

  if (isLoading || userLoading) return <LoadingState />;

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-1">Project not found</h2>
          <p className="text-sm text-muted-foreground">
            {error ? "Failed to load project details." : "This project does not exist or you don't have access."}
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
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

  const stats = project.stats ?? {};
  const totalTasks = stats.totalTasks ?? 0;
  const completedTasks = stats.completedTasks ?? 0;
  const inProgressTasks = stats.inProgressTasks ?? 0;
  const totalMembers = project.members?.length ?? 0;
  const totalAnnouncements = stats.totalAnnouncement ?? 0;

  const completionPct =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const accentColor = (project as ProjectData).color ?? "#667eea";

  const dueIn = daysUntil((project as ProjectData).dueDate);
  const dueLabel =
    dueIn === null
      ? "No deadline"
      : dueIn < 0
      ? `${Math.abs(dueIn)}d overdue`
      : dueIn === 0
      ? "Due today"
      : `${dueIn}d left`;

  const isOverdue = dueIn !== null && dueIn < 0;

  const navigate = (path: string) => router.push(path);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <ProjectHeader project={project} accentColor={accentColor} completionPct={completionPct} isOverdue={isOverdue} dueLabel={dueLabel} totalMembers={totalMembers} />

      <StatsRibbon
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        inProgressTasks={inProgressTasks}
        totalMembers={totalMembers}
        completionPct={completionPct}
        accentColor={accentColor}
      />

      <TaskProgressCard
        base={base}
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        inProgressTasks={inProgressTasks}
        accentColor={accentColor}
        onViewAll={() => navigate(`${base}/tasks`)}
      />

      <QuickAccessGrid
        base={base}
        totalTasks={totalTasks}
        totalAnnouncements={totalAnnouncements}
        totalMembers={totalMembers}
        accentColor={accentColor}
        milestoneCount={milestoneStats?.total ?? 0}
        sprintCount={sprintStats?.sprints?.length ?? 0}
        sectionCount={sectionItems.length}
        viewCount={viewItems.length}
        canManage={canManage}
        onNavigate={navigate}
      />

      <AtAGlanceCards
        project={project as ProjectData}
        isOverdue={isOverdue}
        dueLabel={dueLabel}
        totalMembers={totalMembers}
        canManage={canManage}
        onManage={() => navigate(`${base}/settings?tab=members`)}
      />
    </div>
  );
}

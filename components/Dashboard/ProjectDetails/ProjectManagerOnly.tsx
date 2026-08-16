"use client";

import { useUserProfile } from "@/hooks/useUser";
import { ProjectDetails } from "@/hooks/useProjects";
import { Loader2, Lock } from "lucide-react";

interface ProjectManagerOnlyProps {
  project?: ProjectDetails;
  children: React.ReactNode;
}

/**
 * Page-level gate for manager-only project pages (Settings, Analytics, Time
 * Reports, Milestones, Sprints, Sections, Views). Collaborators and viewers
 * see an Access Restricted screen instead of the page content.
 *
 * Access matches the backend: workspace owner/admin (project.isAdmin is
 * recomputed per-user on the slug endpoint) OR a project MANAGER member.
 */
export function ProjectManagerOnly({ project, children }: ProjectManagerOnlyProps) {
  const { userId, isLoading: userLoading } = useUserProfile();

  const currentProjectMember = project?.members?.find(
    (m) => m.userId === userId || m.user?.id === userId,
  );
  const canManage = !!project?.isAdmin || currentProjectMember?.role === "MANAGER";

  if (userLoading || !project || !userId) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <Lock size={24} className="text-muted-foreground/50" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Access Restricted</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Only project managers and workspace admins can access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

"use client";

import { useUserProfile } from "@/hooks/useUser";
import { ProjectDetails } from "@/hooks/useProjects";
import { Loader2, Lock } from "lucide-react";

interface ProjectMemberOnlyProps {
  project?: ProjectDetails;
  children: React.ReactNode;
}

/**
 * Page-level gate for member-visible project pages (e.g. Time Reports).
 * Any member of the project — or a workspace admin/owner (project.isAdmin is
 * recomputed per-user on the slug endpoint) — sees the content; everyone else
 * sees an Access Restricted screen.
 */
export function ProjectMemberOnly({ project, children }: ProjectMemberOnlyProps) {
  const { userId, isLoading: userLoading } = useUserProfile();

  const currentProjectMember = project?.members?.find(
    (m) => m.userId === userId || m.user?.id === userId,
  );
  const canAccess = !!project?.isAdmin || !!currentProjectMember;

  if (userLoading || !project || !userId) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <Lock size={24} className="text-muted-foreground/50" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Access Restricted</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Only project members and workspace admins can access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

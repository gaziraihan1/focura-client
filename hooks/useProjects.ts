import { Task } from "@/types/task.types";
import { Announcement } from "@/types/announcement.types";

// ─── Types (kept here for backward compatibility) ─────────────────────────────

export interface ProjectMember {
  id: string;
  userId: string;
  role: "MANAGER" | "COLLABORATOR" | "VIEWER";
  joinedAt: string;
  user: { id: string; name: string; email: string; image?: string };
}

export interface ProjectDetails {
  id: string;
  slug: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  status: string;
  priority: string;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  workspace?: { id: string; name: string; slug: string; ownerId: string };
  members: ProjectMember[];
  tasks: Task[];
  announcement: Announcement[];
  stats: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    totalMembers: number;
    projectDays: number;
    topPerformer?: { id: string; name: string; image?: string };
    totalAnnouncement: number;
    inProgressTasks: number;
  };
  isAdmin: boolean;
  workspaceId: string;
  _count: { tasks: number; members: number; announcement: number };
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
  priority?: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  startDate?: string;
  dueDate?: string;
  workspaceId: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
  priority?: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  startDate?: string;
  dueDate?: string;
}

export interface AddProjectMemberDto {
  userId: string;
  role?: "MANAGER" | "COLLABORATOR" | "VIEWER";
}

export type ProjectRole = "MANAGER" | "COLLABORATOR" | "VIEWER";

export interface ProjectRoleResult {
  role: ProjectRole | null;
  isManager: boolean;
  isCollaborator: boolean;
  isViewer: boolean;
  canManageProject: boolean;
  canEditProject: boolean;
  canDeleteProject: boolean;
  canManageMembers: boolean;
  canAddMembers: boolean;
  canRemoveMembers: boolean;
  canUpdateMemberRoles: boolean;
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canCommentOnTasks: boolean;
  canViewProject: boolean;
  canViewTasks: boolean;
  currentMember: ProjectMember | null;
  userId: string | null;
  isLoading: boolean;
  hasAccess: boolean;
  isWorkspaceAdmin: boolean;
}

// ─── Re-exports from sub-modules (maintains backward compatibility) ────────────

export { projectKeys } from "./projectKeys";
export { useProjects, useAllUserProjects, useProjectDetails, useProjectDetailsBySlug } from "./useProjectQueries";
export { useCreateProject, useUpdateProject, useDeleteProject, useAddProjectMember, useUpdateProjectMemberRole, useRemoveProjectMember } from "./useProjectMutations";
export { useProjectRole, useProjectPermission, useProjectRoleCheck } from "./useProjectRole";

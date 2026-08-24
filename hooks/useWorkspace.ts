import { useSession } from "next-auth/react";
import { useMemo } from "react";
import type { ProjectDetails } from "./useProjects";

// ─── Types (kept here for backward compatibility) ─────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  color?: string;
  isPublic: boolean;
  allowInvites: boolean;
  plan: "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";
  maxMembers: number;
  maxStorage: number;
  ownerId: string;
  owner: { id: string; name: string; email: string; image?: string };
  members: WorkspaceMember[];
  _count: { projects: number; members: number };
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "GUEST";
  joinedAt: string;
  userId: string;
  user: { id: string; name: string; email: string; image?: string };
}

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  color?: string;
  logo?: string;
  isPublic?: boolean;
  // NOTE: `plan` is intentionally absent — the backend ignores/strips it on
  // creation and always starts workspaces on FREE (a paid tier can only be
  // granted by the billing flow or a Focura admin).
}

export interface WorkspaceStats {
  totalProjects: number;
  totalTasks: number;
  totalMembers: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "GUEST";

export interface WorkspaceRoleResult {
  role: WorkspaceRole | null;
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
  isGuest: boolean;
  canManageWorkspace: boolean;
  canManageMembers: boolean;
  /** Backend enforces role changes (updateMemberRole) as OWNER-only. */
  canChangeRoles: boolean;
  canCreateProjects: boolean;
  canEditProjects: boolean;
  canDeleteProjects: boolean;
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
  canEditSettings: boolean;
  canDeleteWorkspace: boolean;
  canViewContent: boolean;
  currentMember: WorkspaceMember | null;
  userId: string | null;
  isLoading: boolean;
  hasAccess: boolean;
}

export interface WorkspaceOverview {
  workspace: Workspace;
  stats: WorkspaceStats;
  projects: ProjectDetails[];
}

export interface StorageLimitInfo {
  maxFileSizeMB: number;
  maxDailyUploads: number | null;
  uploadsPerMinute: number | null;
  uploadsPerHour: number | null;
}

export interface WorkspaceStorageInfo {
  plan: Workspace["plan"];
  usedBytes: number;
  maxBytes: number | null;
  remainingBytes: number | null;
  usedPct: number | null;
  usedFormatted: string;
  maxFormatted: string | null;
  isNearLimit: boolean;
  isFull: boolean;
  limits: StorageLimitInfo;
}

// ─── Re-exports from sub-modules (maintains backward compatibility) ────────────

export { workspaceKeys } from "./workspaceKeys";
export {
  useWorkspaces,
  useWorkspace,
  useWorkspaceOverview,
  useWorkspaceMembers,
  useWorkspaceStats,
  useWorkspaceStorage,
} from "./useWorkspaceQueries";
export {
  useCreateWorkspace,
  useUpdateWorkspace,
  useDeleteWorkspace,
  useInviteMember,
  useRemoveMember,
  useUpdateMemberRole,
  useLeaveWorkspace,
} from "./useWorkspaceMutations";
export {
  useWorkspaceRole,
  useWorkspacePermission,
  useWorkspaceRoleCheck,
  useWorkspaceRoleFromWorkspace,
} from "./useWorkspaceRole";

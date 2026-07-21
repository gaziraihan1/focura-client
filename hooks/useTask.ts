import { Attachment, TaskComment } from "@/types/task.types";

// ─── Types (kept here for backward compatibility) ─────────────────────────────

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "BLOCKED" | "COMPLETED" | "CANCELLED";
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  dueDate: string | null;
  startDate?: string;
  estimatedHours?: number;
  createdBy: { id: string; name: string; image?: string };
  assignees: Array<{ user: { id: string; name: string; image?: string } }>;
  project?: { id: string; slug: string; name: string; color: string; workspace: { id: string; name: string } };
  _count: { comments: number; subtasks: number; files: number };
  createdAt: string;
  updatedAt: string;
  focusRequired?: boolean;
  focusLevel?: number;
  energyType?: "LOW" | "MEDIUM" | "HIGH";
  distractionCost?: number;
  timeTracking?: { hoursSinceCreation: number; hoursUntilDue: number | null; isOverdue: boolean; isDueToday: boolean; timeProgress: number | null };
}

export interface TaskStats {
  personal: number;
  assigned: number;
  created: number;
  overdue: number;
  dueToday: number;
  byStatus: Record<string, number>;
  totalTasks?: number;
  inProgress?: number;
  completed?: number;
}

export type UserPlan = "FREE" | "PRO";
export type WorkspacePlan = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";

export interface PersonalQuotaInfo {
  plan: UserPlan;
  dailyLimit: number;
  usedToday: number;
  remaining: number;
  resetAt: string;
  perMinuteLimit: number | null;
}

export interface MemberQuotaInfo {
  userId: string;
  name: string | null;
  email: string;
  image: string | null;
  usedToday: number;
  memberLimit: number | null;
  remaining: number | null;
}

export interface WorkspaceQuotaInfo {
  plan: WorkspacePlan;
  dailyWorkspaceLimit: number | null;
  dailyPerMemberLimit: number | null;
  workspaceUsedToday: number;
  workspaceRemaining: number | null;
  perMinuteLimit: number | null;
  isUnlimited: boolean;
  resetAt: string;
  members: MemberQuotaInfo[];
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId?: string | null;
  workspaceId?: string | null;
  status: Task["status"];
  priority: Task["priority"];
  startDate?: string;
  dueDate?: string;
  estimatedHours?: number | null;
  assigneeIds?: string[];
  labelIds?: string[];
  intent?: "EXECUTION" | "PLANNING" | "REVIEW" | "LEARNING" | "COMMUNICATION";
  energyType?: "LOW" | "MEDIUM" | "HIGH";
  focusRequired?: boolean;
}

export interface TaskFilters {
  type?: "all" | "personal" | "assigned" | "created";
  status?: string;
  priority?: string;
  search?: string;
  projectId?: string;
  workspaceId?: string;
  assigneeId?: string;
  labelIds?: string[];
  userId?: string;
  focusRequired?: boolean;
}

export interface TaskPagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TaskSort {
  sortBy?: "dueDate" | "priority" | "status" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface TasksResponse {
  data: Task[];
  pagination: TaskPagination;
}

export interface TaskOverview {
  task: Task;
  comments: TaskComment[];
  attachments: Attachment[];
}

// ─── Re-exports from sub-modules (maintains backward compatibility) ────────────

export { taskKeys, commentKeys, attachmentKeys, taskOverviewKeys } from "./taskKeys";
export { useTasks, useTaskOverview, useTaskStats, useTask, useTaskComments, useTaskActivity, useTaskAttachments } from "./useTaskQueries";
export { useCreateTask, useUpdateTask, useDeleteTask, useUpdateTaskStatus, useAddComment, useUploadAttachment, useDeleteAttachment } from "./useTaskMutations";
export { usePersonalQuota, useWorkspaceQuota } from "./useTaskQuotas";

export enum UserPlan {
  FREE = "FREE",
  PRO = "PRO",
  BUSINESS = "BUSINESS",
  ENTERPRISE = "ENTERPRISE",
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  password: string | null;
  emailVerified: Date | null;
  image: string | null;
  lastProfileUpdateAt: Date | null;
  bio: string | null;
  timezone: string | null;
  role: UserRole;
  plan: UserPlan;
  theme: string | null;
  notifications: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}


export enum WorkspacePlan {
  FREE = "FREE",
  PRO = "PRO",
  BUSINESS = "BUSINESS",
  ENTERPRISE = "ENTERPRISE",
}

export enum WorkspaceRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  GUEST = "GUEST",
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  color: string | null;
  isPublic: boolean;
  allowInvites: boolean;
  plan: WorkspacePlan;
  maxMembers: number;
  maxStorage: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export interface WorkspaceMember {
  id: string;
  role: WorkspaceRole;
  joinedAt: Date;
  userId: string;
  workspaceId: string | null;
  user: User;
}

export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export interface WorkspaceInvitation {
  id: string;
  email: string;
  role: WorkspaceRole;
  token: string;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
  workspaceId: string | null;
  invitedById: string;
}


export enum ProjectStatus {
  PLANNING = "PLANNING",
  ACTIVE = "ACTIVE",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export enum ProjectRole {
  MANAGER = "MANAGER",
  COLLABORATOR = "COLLABORATOR",
  VIEWER = "VIEWER",
}

export enum Priority {
  URGENT = "URGENT",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  status: ProjectStatus;
  priority: Priority;
  startDate: Date | null;
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string | null;
  createdById: string;
}

export interface ProjectWithDetails extends Project {
  workspace?: Workspace;
  createdBy: User;
  members: ProjectMember[];
  tasks: Task[];
  stats?: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    totalMembers: number;
    projectDays: number;
    topPerformer?: {
      id: string;
      name: string;
      image?: string;
    };
  };
  isAdmin?: boolean;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
  user: User;
}

export interface ProjectSection {
  id: string;
  name: string;
  position: number;
  projectId: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string | null;
  startDate: Date;
  endDate: Date;
  projectId: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  completed: boolean;
  projectId: string;
}

export enum ProjectViewType {
  KANBAN = "KANBAN",
  LIST = "LIST",
  CALENDAR = "CALENDAR",
  TIMELINE = "TIMELINE",
}

export interface ProjectView {
  id: string;
  projectId: string;
  name: string;
  type: ProjectViewType;
  filters: Record<string, any> | null;
  sort: Record<string, any> | null;
}

export interface ProjectFavorite {
  id: string;
  projectId: string;
  userId: string;
  createdAt: Date;
}


export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  BLOCKED = "BLOCKED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum TaskEnergy {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum TaskEffort {
  QUICK = "QUICK",
  MEDIUM = "MEDIUM",
  DEEP = "DEEP",
}

export enum TaskIntent {
  EXECUTION = "EXECUTION",
  PLANNING = "PLANNING",
  REVIEW = "REVIEW",
  LEARNING = "LEARNING",
  COMMUNICATION = "COMMUNICATION",
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  focusRequired: boolean;
  focusLevel: number | null;
  energyType: TaskEnergy | null;
  intent: TaskIntent | null;
  distractionCost: number | null;
  status: TaskStatus;
  priority: Priority;
  startDate: Date | null;
  dueDate: Date | null;
  completedAt: Date | null;
  estimatedHours: number | null;
  actualHours: number | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  projectId: string | null;
  createdById: string;
  parentId: string | null;
  workspaceId: string | null;
}

export interface TaskWithDetails extends Task {
  project?: Project & {
    workspace: Workspace;
  };
  createdBy: User;
  parent?: Task;
  subtasks: Task[];
  assignees: TaskAssignee[];
  labels: TaskLabel[];
  comments: Comment[];
  files: File[];
  timeEntries: TimeEntry[];
  dependencies: TaskDependency[];
  blockedBy: TaskDependency[];
  recurrence?: TaskRecurrence;
  timeTracking?: TaskTimeTracking;
  _count: {
    comments: number;
    subtasks: number;
    files: number;
  };
}

export interface TaskAssignee {
  id: string;
  assignedAt: Date;
  taskId: string;
  userId: string;
  user: User;
}

export enum DependencyType {
  BLOCKING = "BLOCKING",
  RELATED = "RELATED",
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnId: string;
  type: DependencyType;
}

export enum RecurrencePattern {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  CUSTOM = "CUSTOM",
}

export interface TaskRecurrence {
  id: string;
  taskId: string;
  pattern: RecurrencePattern;
  interval: number;
  days: string[] | null;
  endsAt: Date | null;
}


export interface Label {
  id: string;
  name: string;
  color: string;
  description: string | null;
  workspaceId: string | null;
  createdById: string;
}

export interface TaskLabel {
  id: string;
  taskId: string;
  labelId: string;
  task: Task;
  label: Label;
}


export interface Comment {
  id: string;
  content: string;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
  taskId: string;
  userId: string;
  parentId: string | null;
  user: User;
  replies: Comment[];
}


export interface File {
  id: string;
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnail: string | null;
  folder: string | null;
  uploadedAt: Date;
  workspaceId: string | null;
  uploadedById: string;
  projectId: string | null;
  taskId: string | null;
  uploadedBy: User;
}


export enum FocusType {
  POMODORO = "POMODORO",
  SHORT_BREAK = "SHORT_BREAK",
  LONG_BREAK = "LONG_BREAK",
  DEEP_WORK = "DEEP_WORK",
  CUSTOM = "CUSTOM",
}

export interface FocusSession {
  id: string;
  duration: number;
  type: FocusType;
  completed: boolean;
  startedAt: Date;
  endedAt: Date | null;
  userId: string;
  taskId: string | null;
}

export interface TimeEntry {
  id: string;
  description: string | null;
  duration: number;
  billable: boolean;
  startedAt: Date;
  endedAt: Date | null;
  userId: string;
  taskId: string;
}

export interface TaskTimeTracking {
  hoursSinceCreation: number;
  hoursUntilDue: number | null;
  isOverdue: boolean;
  isDueToday: boolean;
  timeProgress: number | null; // percentage of estimated time used
}


export enum ActivityType {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",
  COMPLETED = "COMPLETED",
  ASSIGNED = "ASSIGNED",
  UNASSIGNED = "UNASSIGNED",
  COMMENTED = "COMMENTED",
  UPLOADED = "UPLOADED",
  MOVED = "MOVED",
  STATUS_CHANGED = "STATUS_CHANGED",
  PRIORITY_CHANGED = "PRIORITY_CHANGED",
}

export enum EntityType {
  TASK = "TASK",
  PROJECT = "PROJECT",
  COMMENT = "COMMENT",
  FILE = "FILE",
  WORKSPACE = "WORKSPACE",
  MEMBER = "MEMBER",
}

export interface Activity {
  id: string;
  action: ActivityType;
  entityType: EntityType;
  entityId: string;
  metadata: Record<string, any> | null;
  createdAt: Date;
  userId: string;
  workspaceId: string;
  taskId: string | null;
  user: User;
}


export enum NotificationType {
  TASK_ASSIGNED = "TASK_ASSIGNED",
  TASK_COMPLETED = "TASK_COMPLETED",
  MEMBER_JOINED = "MEMBER_JOINED",
  MEMBER_REMOVED = "MEMBER_REMOVED",
  ROLE_UPDATED = "ROLE_UPDATED",
  TASK_COMMENTED = "TASK_COMMENTED",
  TASK_DUE_SOON = "TASK_DUE_SOON",
  TASK_OVERDUE = "TASK_OVERDUE",
  MENTION = "MENTION",
  WORKSPACE_INVITE = "WORKSPACE_INVITE",
  PROJECT_UPDATE = "PROJECT_UPDATE",
  FILE_SHARED = "FILE_SHARED",
  DEADLINE_REMINDER = "DEADLINE_REMINDER",
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl: string | null;
  createdAt: Date;
  readAt: Date | null;
  userId: string;
  senderId: string | null;
  sender?: User;
}


export interface Integration {
  id: string;
  name: string;
  provider: string;
  accessToken: string | null;
  refreshToken: string | null;
  config: Record<string, any> | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string | null;
}


// Task API Types
export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  focusRequired?: boolean;
  focusLevel?: number;
  energyType?: TaskEnergy;
  intent?: TaskIntent;
  distractionCost?: number;
  projectId?: string | null;
  workspaceId: string;
  parentId?: string;
  startDate?: string;
  dueDate?: string;
  estimatedHours?: number | null;
  assigneeIds?: string[];
  labelIds?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  focusRequired?: boolean;
  focusLevel?: number;
  energyType?: TaskEnergy;
  intent?: TaskIntent;
  distractionCost?: number;
  projectId?: string | null;
  parentId?: string;
  startDate?: string | null;
  dueDate?: string | null;
  completedAt?: string | null;
  estimatedHours?: number | null;
  actualHours?: number | null;
  position?: number;
}

// Project API Types
export interface CreateProjectDto {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: ProjectStatus;
  priority?: Priority;
  startDate?: string;
  dueDate?: string;
  workspaceId: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: ProjectStatus;
  priority?: Priority;
  startDate?: string;
  dueDate?: string;
}

// Workspace API Types
export interface CreateWorkspaceDto {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  color?: string;
  isPublic?: boolean;
  allowInvites?: boolean;
}

export interface UpdateWorkspaceDto {
  name?: string;
  description?: string;
  logo?: string;
  color?: string;
  isPublic?: boolean;
  allowInvites?: boolean;
}

// Member Management Types
export interface AddProjectMemberDto {
  userId: string;
  role?: ProjectRole;
}

export interface UpdateProjectMemberRoleDto {
  role: ProjectRole;
}

export interface InviteWorkspaceMemberDto {
  email: string;
  role?: WorkspaceRole;
}

// Comment API Types
export interface CreateCommentDto {
  content: string;
  taskId: string;
  parentId?: string;
}

export interface UpdateCommentDto {
  content: string;
}

// Label API Types
export interface CreateLabelDto {
  name: string;
  color: string;
  description?: string;
  workspaceId: string;
}

export interface UpdateLabelDto {
  name?: string;
  color?: string;
  description?: string;
}

// Time Entry API Types
export interface CreateTimeEntryDto {
  taskId: string;
  description?: string;
  duration?: number;
  startedAt: string;
  endedAt?: string;
  billable?: boolean;
}

// Focus Session API Types
export interface CreateFocusSessionDto {
  duration: number;
  type: FocusType;
  taskId?: string;
}


export interface TaskFilters {
  status?: TaskStatus[];
  priority?: Priority[];
  assigneeIds?: string[];
  labelIds?: string[];
  projectIds?: string[];
  workspaceId?: string;
  dueDate?: {
    from?: string;
    to?: string;
  };
  search?: string;
  focusRequired?: boolean;
  energyType?: TaskEnergy[];
  intent?: TaskIntent[];
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: Priority[];
  workspaceId?: string;
  search?: string;
}

export interface TaskSortOptions {
  field: "createdAt" | "updatedAt" | "dueDate" | "priority" | "status" | "title";
  order: "asc" | "desc";
}


export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}


// Partial update type helper
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Require specific fields
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Omit timestamps for create operations
export type OmitTimestamps<T> = Omit<T, "createdAt" | "updatedAt">;

// Select specific fields
export type SelectFields<T, K extends keyof T> = Pick<T, K>;
import { Label } from "@/hooks/useLabels";

// types/task.types.ts
export interface User {
  id: string;
  name: string;
  email?: string;
  image?: string;
}

export interface TimeTracking {
  hoursSinceCreation: number;
  hoursUntilDue: number | null;
  isOverdue: boolean;
  isDueToday: boolean;
  timeProgress: number | null;
}

export interface Project {
  id: string;
  slug:string;
  name: string;
  color: string;
  workspaceId?: string;
  workspace?: {
    id: string;
    name: string;
    slug: string
  };
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED"
}

export interface TaskAssignee {
  user: User;
  userId: string;
  taskId: string;
  role: "OWNER" | "ADMIN" | "MEMBER"
}

export interface TaskComment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  parentId: string | null;
  edited: boolean
}

export interface Activity {
  id: string;
  description: string;
  createdAt: string;
  user: User;
}

// types/task.types.ts

export interface Attachment {
  id: string;
  name: string;              // Cloudinary public_id
  originalName: string;      // Original filename
  size: number;              // Bytes
  mimeType: string;          // e.g., "image/png"
  url: string;               // Download URL
  thumbnail?: string;
  uploadedAt: string;
  uploadedBy: {
    id: string;
    name: string | null;
    image?: string | null;
  };
  
  // ❌ REMOVE these old fields:
  // fileName: string;
  // fileSize: number;
  // fileUrl: string;
  // fileType: string;
}

export type TaskStatus = 
  | "TODO" 
  | "IN_PROGRESS" 
  | "IN_REVIEW" 
  | "BLOCKED" 
  | "COMPLETED" 
  | "CANCELLED";

export type TaskPriority = 
  | "URGENT" 
  | "HIGH" 
  | "MEDIUM" 
  | "LOW";

export type EnergyType = 
  | "LOW" 
  | "MEDIUM" 
  | "HIGH";

  type IntentType = 
  | "EXECUTION"
  | "PLANNING"
  | "REVIEW"
  | "LEARNING"
  | "COMMUNICATION"

interface LabelTypes {
  id: string;
  labelId: string;
  taskId: string;
  label:Label
}
export interface GitHubPrChecks {
  totalChecks: number;
  passingChecks: number;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  startDate: string | null;
  completedAt: string | null;
  estimatedHours: number | null;
  actualHours: number | null;
  createdAt: string;
  updatedAt: string;
  projectId: string | null;
  sectionId?: string | null;
  sprintId?: string | null;
  milestoneId?: string | null;
  sprint?: { id: string; name: string } | null;
  milestone?: { id: string; title: string; status?: string; progress?: number } | null;
  recurrenceId?: string | null;
  recurrence?: {
    id: string;
    pattern: "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";
    interval: number;
    days: number[] | null;
    endsAt: string | null;
    lastOccurredAt?: string | null;
  } | null;
  intent: IntentType

  focusRequired?: boolean;
  focusLevel?: number;
  energyType?: EnergyType;
  distractionCost?: number;

  githubRepo?: string | null;

  githubPrUrl?: string | null;
  githubPrNumber?: number | null;
  githubPrStatus?: 'open' | 'merged' | 'closed' | null;
  githubPrChecks?: GitHubPrChecks | null;

  githubIssueUrl?: string | null;
  githubIssueNumber?: number | null;
  githubIssueState?: 'open' | 'closed' | null;

  githubBranchName?: string | null;
  githubBranchUrl?: string | null;
  githubBranchProtected?: boolean | null;

  githubCommitSha?: string | null;
  githubCommitUrl?: string | null;
  githubCommitMessage?: string | null;
  githubCommitAuthor?: string | null;

  githubWorkflowStatus?: 'success' | 'failure' | 'pending' | 'cancelled' | null;
  githubWorkflowName?: string | null;
  githubWorkflowUrl?: string | null;
  githubWorkflowRunId?: string | null;

  githubReleaseName?: string | null;
  githubReleaseUrl?: string | null;
  githubReleaseTagName?: string | null;

  githubMilestoneTitle?: string | null;
  githubMilestoneUrl?: string | null;
  githubMilestoneState?: 'open' | 'closed' | null;

  githubProjectNumber?: number | null;
  githubProjectUrl?: string | null;
  githubProjectTitle?: string | null;

  githubDiscussionNumber?: number | null;
  githubDiscussionUrl?: string | null;
  githubDiscussionCategory?: string | null;

  githubLabels?: string[] | null;

  // Slack Integration Fields
  slackChannelId?: string | null;
  slackMessageTs?: string | null;
  slackThreadTs?: string | null;
  slackMessageUrl?: string | null;
  slackUserId?: string | null;
  slackUserDisplayName?: string | null;

  createdBy: User;
  assignees: TaskAssignee[];
  project?: Project;
  labels:LabelTypes[]

  timeTracking?: TimeTracking;

  _count: {
    comments: number;
    subtasks: number;
    files: number;
  };
}



export interface TaskAssignee {
  user: User;
}

export interface TaskTimeTracking {
  isOverdue?: boolean;
  isDueToday?: boolean;
}

export interface TeamTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: TaskAssignee[];
  createdBy: User;
  dueDate?: string;
  intent?: string;
  energyType?: string;
  focusRequired?: boolean;
  timeTracking?: TaskTimeTracking;
}


export interface TaskSidebarProps {
  task: Task;
  isPersonalTask: boolean;
  isUpdatingStatus: boolean;
  onStatusChange: (status: Task['status']) => void;
  canChangeStatus?: boolean;
}


export interface StatusOption {
  value: TaskStatus;
  label: string;
}

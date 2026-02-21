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
  name: string;
  color: string;
  workspaceId?: string;
  workspace?: {
    id: string;
    name: string;
    slug: string
  };
}

export interface TaskAssignee {
  user: User;
  userId: string;
  taskId: string;
}

export interface TaskComment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
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
  intent: IntentType
  
  focusRequired?: boolean;
  focusLevel?: number;
  energyType?: EnergyType;
  distractionCost?: number;
  
  createdBy: User;
  assignees: TaskAssignee[];
  project?: Project;
  
  timeTracking?: TimeTracking;
  
  _count?: {
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

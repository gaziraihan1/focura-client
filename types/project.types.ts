
export type ViewMode = "grid" | "list";

export interface ProjectFilters {
  status: string;
  priority: string;
  workspace: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  status: string;
  priority: string;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  workspaceId?: string;
  workspace?: {
    id: string;
    name: string;
    slug?: string;
    ownerId: string;
  };
  _count?: {
    tasks: number;
  };
  stats?: {
    totalTasks: number;
    completedTasks?: number;
  };
  isAdmin: boolean;
}

export interface WorkspaceData {
  id: string;
  name: string;
  slug?: string;
}
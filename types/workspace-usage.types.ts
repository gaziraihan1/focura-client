export type DateRangeFilter = '7d' | '30d' | '90d' | 'custom';

export interface WorkspaceUsageData {
  projectActivity: ProjectActivityMetrics;
  userEngagement: UserEngagementMetrics;
  resourceUsage: ResourceUsageMetrics;
  workspaceLoad: WorkspaceLoadMetrics;
  workspaceGrowth: WorkspaceGrowthMetrics;
  isAdmin: boolean;
}

export interface ProjectActivityMetrics {
  mostActive: Array<{
    id: string;
    name: string;
    color: string | null;
    activityScore: number;
    taskCount: number;
    commentCount: number;
    lastActivity: Date;
  }>;
  lowActivity: Array<{
    id: string;
    name: string;
    color: string | null;
    taskCount: number;
    daysSinceLastActivity: number;
  }>;
  tasksPerProjectTrend: Array<{
    projectId: string;
    projectName: string;
    trend: Array<{ date: string; count: number }>;
  }>;
}

export interface UserEngagementMetrics {
  activeUsers: {
    online: number;
    thisWeek: number;
    thisMonth: number;
  };
  inactiveUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    lastActive: Date | null;
    daysSinceActive: number;
  }>;
  collaborationIndex: Array<{
    userId: string;
    userName: string | null;
    userEmail: string;
    userImage: string | null;
    commentsCount: number;
    tasksCreated: number;
    tasksAssigned: number;
    collaborationScore: number;
  }>;
}

export interface ResourceUsageMetrics {
  storageByProject: Array<{
    projectId: string;
    projectName: string;
    storageUsedMB: number;
    fileCount: number;
    percentage: number;
  }>;
  filesByUser: Array<{
    userId: string;
    userName: string | null;
    userEmail: string;
    fileCount: number;
    storageUsedMB: number;
  }>;
  totalStorage: {
    usedMB: number;
    totalMB: number;
    percentage: number;
  };
}

export interface WorkspaceLoadMetrics {
  tasksPerUser: Array<{
    userId: string;
    userName: string | null;
    userEmail: string;
    userImage: string | null;
    activeTasks: number;
    overdueTasks: number;
    capacityLevel: 'UNDERUTILIZED' | 'OPTIMAL' | 'NEAR_CAPACITY' | 'OVERLOADED';
  }>;
  projectsNearingDeadlines: Array<{
    projectId: string;
    projectName: string;
    dueDate: Date;
    daysRemaining: number;
    completionPercentage: number;
    status: string;
  }>;
  averageTaskCompletion: {
    byUser: Array<{
      userId: string;
      userName: string | null;
      completionRate: number;
      avgCompletionDays: number;
    }>;
    byProject: Array<{
      projectId: string;
      projectName: string;
      completionRate: number;
      avgCompletionDays: number;
    }>;
  };
}

export interface WorkspaceGrowthMetrics {
  thisMonth: {
    newUsers: number;
    newProjects: number;
    newTasks: number;
  };
  trend: Array<{
    month: string;
    users: number;
    projects: number;
    tasks: number;
  }>;
  projectLifecycle: {
    created: number;
    active: number;
    completed: number;
    archived: number;
  };
}
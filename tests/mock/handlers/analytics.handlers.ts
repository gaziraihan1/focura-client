// tests/mock/handlers/analytics.handlers.ts
import { http, HttpResponse } from 'msw'
import type {
  AnalyticsOverview,
  TaskTrends,
  ProjectHealth,
  MemberContribution,
  TimeSummary,
  ActivityTrends,
  WorkloadMember,
} from '@/hooks/useAnalytics'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const mockAnalyticsOverview: AnalyticsOverview = {
  kpis: {
    totalProjects: 5,
    activeProjects: 3,
    totalTasks: 42,
    completedTasks: 18,
    overdueTasks: 4,
    completionRate: 42.8,
    totalMembers: 8,
    activeMembers: 6,
    totalHours: 120,
    storageUsed: 2048,
  },
  taskStatus: [
    { status: 'TODO', count: 10, percentage: 23.8 },
    { status: 'IN_PROGRESS', count: 14, percentage: 33.3 },
    { status: 'COMPLETED', count: 18, percentage: 42.8 },
  ],
  projectStatus: [
    { status: 'ACTIVE', count: 3 },
    { status: 'PLANNING', count: 2 },
  ],
  tasksByPriority: [
    { priority: 'HIGH', count: 12 },
    { priority: 'MEDIUM', count: 20 },
    { priority: 'LOW', count: 10 },
  ],
  deadlineRisk: {
    dueIn3Days: [],
    dueIn7DaysCount: 3,
    highPriorityNearDeadline: [],
    riskLevel: 'medium',
  },
}

export const mockTaskTrends: TaskTrends = {
  completionTrend: [
    { date: new Date('2024-01-01'), count: 2 },
    { date: new Date('2024-01-02'), count: 5 },
  ],
  overdueTrend: [
    { weekStart: new Date('2024-01-01'), count: 1 },
  ],
}

export const mockProjectHealth: ProjectHealth[] = [
  {
    projectId: 'project-1',
    projectName: 'Test Project',
    status: 'ACTIVE',
    progress: 60,
    totalTasks: 10,
    completedTasks: 6,
    remainingTasks: 4,
    dueDate: new Date('2024-12-31'),
    health: 'healthy',
  },
  {
    projectId: 'project-2',
    projectName: 'At Risk Project',
    status: 'ACTIVE',
    progress: 20,
    totalTasks: 10,
    completedTasks: 2,
    remainingTasks: 8,
    dueDate: new Date('2024-06-01'),
    health: 'at-risk',
  },
]

export const mockMemberContribution: MemberContribution[] = [
  {
    userId: 'user-1',
    userName: 'Test User',
    userEmail: 'test@focura.com',
    userImage: null,
    role: 'OWNER',
    completedTasks: 10,
    totalHours: 40,
    commentsCount: 15,
    filesCount: 3,
    contributionScore: 85,
  },
]

export const mockTimeSummary: TimeSummary = {
  totalHours: 120,
  avgHoursPerMember: 15,
  projectBreakdown: [
    { projectId: 'project-1', projectName: 'Test Project', hours: 80 },
    { projectId: 'project-2', projectName: 'At Risk Project', hours: 40 },
  ],
}

export const mockActivityTrends: ActivityTrends = {
  volumeTrend: [
    {
      date: new Date('2024-01-01'),
      created: 3,
      updated: 5,
      completed: 2,
      assigned: 1,
      total: 11,
    },
  ],
  mostActiveDay: {
    day: 'Monday',
    count: 24,
    mostCommonAction: 'TASK_UPDATED',
  },
}

export const mockWorkload: WorkloadMember[] = [
  {
    userId: 'user-1',
    userName: 'Test User',
    userEmail: 'test@focura.com',
    assignedTasks: 5,
    status: 'normal',
  },
  {
    userId: 'user-2',
    userName: 'Busy User',
    userEmail: 'busy@focura.com',
    assignedTasks: 20,
    status: 'overloaded',
  },
]

const ok = (data: unknown) => HttpResponse.json({ success: true, data })

export const analyticsHandlers = [
  http.get(`${BASE}/api/v1/analytics/:workspaceId/overview`, () =>
    ok(mockAnalyticsOverview)
  ),

  http.get(`${BASE}/api/v1/analytics/:workspaceId/tasks/trends`, () =>
    ok(mockTaskTrends)
  ),

  http.get(`${BASE}/api/v1/analytics/:workspaceId/projects/health`, () =>
    ok(mockProjectHealth)
  ),

  http.get(`${BASE}/api/v1/analytics/:workspaceId/members/contribution`, () =>
    ok(mockMemberContribution)
  ),

  http.get(`${BASE}/api/v1/analytics/:workspaceId/time/summary`, () =>
    ok(mockTimeSummary)
  ),

  http.get(`${BASE}/api/v1/analytics/:workspaceId/activity/trends`, () =>
    ok(mockActivityTrends)
  ),

  http.get(`${BASE}/api/v1/analytics/:workspaceId/workload`, () =>
    ok(mockWorkload)
  ),
]
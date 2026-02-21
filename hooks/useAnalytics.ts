'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

// ==================== TYPES ====================

export interface ExecutiveKPIs {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
  totalMembers: number;
  activeMembers: number;
  totalHours: number;
  storageUsed: number;
}

export interface TaskStatusItem {
  status: string;
  count: number;
  percentage: number;
}

export interface ProjectStatusItem {
  status: string;
  count: number;
}

export interface TasksByPriorityItem {
  priority: string;
  count: number;
}

export interface DeadlineRiskTask {
  id: string;
  title: string;
  dueDate: Date;
  priority: string;
  assignedTo?: string;
}

export interface DeadlineRisk {
  dueIn3Days: DeadlineRiskTask[];
  dueIn7DaysCount: number;
  highPriorityNearDeadline: DeadlineRiskTask[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface AnalyticsOverview {
  kpis: ExecutiveKPIs;
  taskStatus: TaskStatusItem[];
  projectStatus: ProjectStatusItem[];
  tasksByPriority: TasksByPriorityItem[];
  deadlineRisk: DeadlineRisk;
}

export interface TrendDataPoint {
  date: Date;
  count: number;
}

export interface OverdueTrendPoint {
  weekStart: Date;
  count: number;
}

export interface TaskTrends {
  completionTrend: TrendDataPoint[];
  overdueTrend: OverdueTrendPoint[];
}

export interface ProjectHealth {
  projectId: string;
  projectName: string;
  status: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  dueDate: Date | null;
  health: 'healthy' | 'at-risk' | 'critical';
}

export interface MemberContribution {
  userId: string;
  userName: string | null;
  userEmail: string;
  userImage: string | null;
  role: string;
  completedTasks: number;
  totalHours: number;
  commentsCount: number;
  filesCount: number;
  contributionScore: number;
}

export interface TimeSummary {
  totalHours: number;
  avgHoursPerMember: number;
  projectBreakdown: Array<{
    projectId: string;
    projectName: string;
    hours: number;
  }>;
}

export interface ActivityTrendPoint {
  date: Date;
  created: number;
  updated: number;
  completed: number;
  assigned: number;
  total: number;
}

export interface MostActiveDay {
  day: string;
  count: number;
  mostCommonAction: string;
}

export interface ActivityTrends {
  volumeTrend: ActivityTrendPoint[];
  mostActiveDay: MostActiveDay;
}

export interface WorkloadMember {
  userId: string;
  userName: string | null;
  userEmail: string;
  assignedTasks: number;
  status: 'normal' | 'high' | 'overloaded';
}

// ==================== QUERY KEYS ====================

export const analyticsKeys = {
  all: (workspaceId: string) => ['analytics', workspaceId] as const,
  overview: (workspaceId: string) => [...analyticsKeys.all(workspaceId), 'overview'] as const,
  taskTrends: (workspaceId: string, days: number) =>
    [...analyticsKeys.all(workspaceId), 'tasks', 'trends', days] as const,
  projectHealth: (workspaceId: string) =>
    [...analyticsKeys.all(workspaceId), 'projects', 'health'] as const,
  memberContribution: (workspaceId: string) =>
    [...analyticsKeys.all(workspaceId), 'members', 'contribution'] as const,
  timeSummary: (workspaceId: string, days: number) =>
    [...analyticsKeys.all(workspaceId), 'time', 'summary', days] as const,
  activityTrends: (workspaceId: string, days: number) =>
    [...analyticsKeys.all(workspaceId), 'activity', 'trends', days] as const,
  workload: (workspaceId: string) =>
    [...analyticsKeys.all(workspaceId), 'workload'] as const,
};

// ==================== HOOKS ====================

export function useAnalyticsOverview(workspaceId: string) {
  return useQuery({
    queryKey: analyticsKeys.overview(workspaceId),
    queryFn: async () => {
      const response = await api.get<AnalyticsOverview>(
        `/api/analytics/${workspaceId}/overview`
      );
      return response?.data as AnalyticsOverview;
    },
    enabled: !!workspaceId,
    retry: false, // ✅ Don't retry on 403 errors
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useTaskTrends(workspaceId: string, days: number = 30) {
  return useQuery({
    queryKey: analyticsKeys.taskTrends(workspaceId, days),
    queryFn: async () => {
      const response = await api.get<TaskTrends>(
        `/api/analytics/${workspaceId}/tasks/trends?days=${days}`
      );
      return response?.data as TaskTrends;
    },
    enabled: !!workspaceId,
    retry: false, // ✅ Don't retry on 403 errors
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProjectHealth(workspaceId: string) {
  return useQuery({
    queryKey: analyticsKeys.projectHealth(workspaceId),
    queryFn: async () => {
      const response = await api.get<ProjectHealth[]>(
        `/api/analytics/${workspaceId}/projects/health`
      );
      return response?.data as ProjectHealth[];
    },
    enabled: !!workspaceId,
    retry: false, // ✅ Don't retry on 403 errors
    staleTime: 3 * 60 * 1000,
  });
}

export function useMemberContribution(workspaceId: string) {
  return useQuery({
    queryKey: analyticsKeys.memberContribution(workspaceId),
    queryFn: async () => {
      const response = await api.get<MemberContribution[]>(
        `/api/analytics/${workspaceId}/members/contribution`
      );
      return response?.data as MemberContribution[];
    },
    enabled: !!workspaceId,
    retry: false, // ✅ Don't retry on 403 errors
    staleTime: 5 * 60 * 1000,
  });
}

export function useTimeSummary(workspaceId: string, days: number = 7) {
  return useQuery({
    queryKey: analyticsKeys.timeSummary(workspaceId, days),
    queryFn: async () => {
      const response = await api.get<TimeSummary>(
        `/api/analytics/${workspaceId}/time/summary?days=${days}`
      );
      return response?.data as TimeSummary;
    },
    enabled: !!workspaceId,
    retry: false, // ✅ Don't retry on 403 errors
    staleTime: 5 * 60 * 1000,
  });
}

export function useActivityTrends(workspaceId: string, days: number = 30) {
  return useQuery({
    queryKey: analyticsKeys.activityTrends(workspaceId, days),
    queryFn: async () => {
      const response = await api.get<ActivityTrends>(
        `/api/analytics/${workspaceId}/activity/trends?days=${days}`
      );
      return response?.data as ActivityTrends;
    },
    enabled: !!workspaceId,
    retry: false, // ✅ Don't retry on 403 errors
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorkload(workspaceId: string) {
  return useQuery({
    queryKey: analyticsKeys.workload(workspaceId),
    queryFn: async () => {
      const response = await api.get<WorkloadMember[]>(
        `/api/analytics/${workspaceId}/workload`
      );
      return response?.data as WorkloadMember[];
    },
    enabled: !!workspaceId,
    retry: false, // ✅ Don't retry on 403 errors
    staleTime: 2 * 60 * 1000,
  });
}
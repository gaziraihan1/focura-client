'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface ProjectAnalyticsKPIs {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
  totalMembers: number;
  totalHours: number;
  storageUsed: number;
}

export interface ProjectTaskStatusItem {
  status: string;
  count: number;
  percentage: number;
}

export interface ProjectTaskPriorityItem {
  priority: string;
  count: number;
  percentage: number;
}

export interface ProjectDeadlineRiskTask {
  id: string;
  title: string;
  dueDate: Date | null;
  priority: string;
}

export interface ProjectDeadlineRisk {
  dueIn3DaysCount: number;
  dueIn7DaysCount: number;
  highPriorityNearDeadline: ProjectDeadlineRiskTask[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ProjectMemberContribution {
  userId: string;
  userName: string | null;
  userEmail: string;
  userImage: string | null;
  role: string;
  completedTasks: number;
  totalHours: number;
  commentsCount: number;
  contributionScore: number;
}

export interface ProjectTimeSummary {
  totalHours: number;
  avgHoursPerMember: number;
  topContributors: Array<{
    userId: string;
    userName: string | null;
    userEmail: string;
    hours: number;
  }>;
}

export interface ProjectCompletionTrend {
  date: Date;
  count: number;
}

export interface ProjectAnalyticsOverview {
  kpis: ProjectAnalyticsKPIs | null;
  taskStatus: ProjectTaskStatusItem[] | null;
  priority: ProjectTaskPriorityItem[] | null;
  completionTrend: ProjectCompletionTrend[] | null;
  deadlineRisk: ProjectDeadlineRisk | null;
}


export const projectAnalyticsKeys = {
  all: (workspaceId: string) => ['project-analytics', workspaceId] as const,
  overview: (workspaceId: string, projectId: string) =>
    [...projectAnalyticsKeys.all(workspaceId), projectId, 'overview'] as const,
  completionTrend: (workspaceId: string, projectId: string, days: number) =>
    [...projectAnalyticsKeys.all(workspaceId), projectId, 'completion-trend', days] as const,
  memberContribution: (workspaceId: string, projectId: string) =>
    [...projectAnalyticsKeys.all(workspaceId), projectId, 'members', 'contribution'] as const,
  timeSummary: (workspaceId: string, projectId: string, days: number) =>
    [...projectAnalyticsKeys.all(workspaceId), projectId, 'time', 'summary', days] as const,
  deadlineRisk: (workspaceId: string, projectId: string) =>
    [...projectAnalyticsKeys.all(workspaceId), projectId, 'deadline-risk'] as const,
};


export function useProjectAnalyticsOverview(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: projectAnalyticsKeys.overview(workspaceId, projectId),
    queryFn: async () => {
      const response = await api.get<ProjectAnalyticsOverview>(
        `/api/v1/analytics/${workspaceId}/projects/${projectId}/overview`
      );
      return response?.data as ProjectAnalyticsOverview;
    },
    enabled: !!workspaceId && !!projectId,
    retry: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useProjectCompletionTrend(
  workspaceId: string,
  projectId: string,
  days: number = 30,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: projectAnalyticsKeys.completionTrend(workspaceId, projectId, days),
    queryFn: async () => {
      const response = await api.get<ProjectCompletionTrend[]>(
        `/api/v1/analytics/${workspaceId}/projects/${projectId}/tasks/trends?days=${days}`
      );
      return response?.data as ProjectCompletionTrend[];
    },
    enabled: !!workspaceId && !!projectId && (options?.enabled ?? true),
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
}

export function useProjectMemberContribution(
  workspaceId: string,
  projectId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: projectAnalyticsKeys.memberContribution(workspaceId, projectId),
    queryFn: async () => {
      const response = await api.get<ProjectMemberContribution[]>(
        `/api/v1/analytics/${workspaceId}/projects/${projectId}/members/contribution`
      );
      return response?.data as ProjectMemberContribution[];
    },
    enabled: !!workspaceId && !!projectId && (options?.enabled ?? true),
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useProjectTimeSummary(
  workspaceId: string,
  projectId: string,
  days: number = 7,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: projectAnalyticsKeys.timeSummary(workspaceId, projectId, days),
    queryFn: async () => {
      const response = await api.get<ProjectTimeSummary>(
        `/api/v1/analytics/${workspaceId}/projects/${projectId}/time/summary?days=${days}`
      );
      return response?.data as ProjectTimeSummary;
    },
    enabled: !!workspaceId && !!projectId && (options?.enabled ?? true),
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useProjectDeadlineRisk(
  workspaceId: string,
  projectId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: projectAnalyticsKeys.deadlineRisk(workspaceId, projectId),
    queryFn: async () => {
      const response = await api.get<ProjectDeadlineRisk>(
        `/api/v1/analytics/${workspaceId}/projects/${projectId}/deadline-risk`
      );
      return response?.data as ProjectDeadlineRisk;
    },
    enabled: !!workspaceId && !!projectId && (options?.enabled ?? true),
    retry: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import {
  useProjectAnalyticsOverview,
  useProjectCompletionTrend,
  useProjectMemberContribution,
  useProjectTimeSummary,
  useProjectDeadlineRisk,
  projectAnalyticsKeys,
} from '@/hooks/useProjectAnalytics'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const mockOverview = {
  kpis: {
    totalTasks: 20,
    completedTasks: 8,
    inProgressTasks: 5,
    overdueTasks: 2,
    completionRate: 40,
    totalMembers: 4,
    totalHours: 120,
    storageUsed: 500,
  },
  taskStatus: [
    { status: 'TODO', count: 5, percentage: 25 },
    { status: 'IN_PROGRESS', count: 5, percentage: 25 },
  ],
  priority: [
    { priority: 'HIGH', count: 8, percentage: 40 },
  ],
  completionTrend: [],
  deadlineRisk: {
    dueIn3DaysCount: 2,
    dueIn7DaysCount: 5,
    highPriorityNearDeadline: [],
    riskLevel: 'medium',
  },
}

describe('projectAnalyticsKeys', () => {
  it('generates correct key structures', () => {
    expect(projectAnalyticsKeys.overview('ws-1', 'proj-1')).toEqual([
      'project-analytics', 'ws-1', 'proj-1', 'overview',
    ])
    expect(projectAnalyticsKeys.completionTrend('ws-1', 'proj-1', 30)).toEqual([
      'project-analytics', 'ws-1', 'proj-1', 'completion-trend', 30,
    ])
    expect(projectAnalyticsKeys.memberContribution('ws-1', 'proj-1')).toEqual([
      'project-analytics', 'ws-1', 'proj-1', 'members', 'contribution',
    ])
  })
})

describe('useProjectAnalyticsOverview', () => {
  it('fetches project analytics overview', async () => {
    server.use(
      http.get(`${BASE}/api/v1/analytics/:wsId/projects/:projId/overview`, () => {
        return HttpResponse.json({ data: mockOverview })
      })
    )

    const { result } = renderHook(
      () => useProjectAnalyticsOverview('ws-1', 'proj-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.kpis?.totalTasks).toBe(20)
    expect(result.current.data?.kpis?.completionRate).toBe(40)
  })

  it('is disabled when IDs are empty', () => {
    const { result } = renderHook(
      () => useProjectAnalyticsOverview('', 'proj-1'),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

describe('useProjectCompletionTrend', () => {
  it('fetches completion trend', async () => {
    server.use(
      http.get(`${BASE}/api/v1/analytics/:wsId/projects/:projId/tasks/trends`, () => {
        return HttpResponse.json({ data: [{ date: new Date().toISOString(), count: 3 }] })
      })
    )

    const { result } = renderHook(
      () => useProjectCompletionTrend('ws-1', 'proj-1', 30),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  })
})

describe('useProjectMemberContribution', () => {
  it('fetches member contributions', async () => {
    server.use(
      http.get(`${BASE}/api/v1/analytics/:wsId/projects/:projId/members/contribution`, () => {
        return HttpResponse.json({
          data: [{
            userId: 'u1', userName: 'Alice', userEmail: 'a@test.com',
            userImage: null, role: 'MANAGER', completedTasks: 5,
            totalHours: 40, commentsCount: 10, contributionScore: 85,
          }],
        })
      })
    )

    const { result } = renderHook(
      () => useProjectMemberContribution('ws-1', 'proj-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].userName).toBe('Alice')
  })
})

describe('useProjectTimeSummary', () => {
  it('fetches time summary', async () => {
    server.use(
      http.get(`${BASE}/api/v1/analytics/:wsId/projects/:projId/time/summary`, () => {
        return HttpResponse.json({
          data: {
            totalHours: 100,
            avgHoursPerMember: 25,
            topContributors: [],
          },
        })
      })
    )

    const { result } = renderHook(
      () => useProjectTimeSummary('ws-1', 'proj-1', 7),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.totalHours).toBe(100)
  })
})

describe('useProjectDeadlineRisk', () => {
  it('fetches deadline risk', async () => {
    server.use(
      http.get(`${BASE}/api/v1/analytics/:wsId/projects/:projId/deadline-risk`, () => {
        return HttpResponse.json({
          data: {
            dueIn3DaysCount: 3,
            dueIn7DaysCount: 7,
            highPriorityNearDeadline: [],
            riskLevel: 'high',
          },
        })
      })
    )

    const { result } = renderHook(
      () => useProjectDeadlineRisk('ws-1', 'proj-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.riskLevel).toBe('high')
    expect(result.current.data?.dueIn3DaysCount).toBe(3)
  })
})

import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { useWorkspaceUsage, useExportWorkspaceUsage, workspaceUsageKeys } from '@/hooks/useWorkspaceUsage'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

const mockUsageData = {
  snapshot: {
    totalMembers: 10,
    activeMembers: 7,
    totalTasks: 150,
    totalProjects: 5,
    storageUsedMB: 512,
    activityEvents: 1200,
    avgDailyUsers: 5,
    engagementScore: 70,
  },
  projectActivity: { mostActive: [], lowActivity: [], tasksPerProjectTrend: [] },
  userEngagement: { activeUsers: { online: 2, thisWeek: 7, thisMonth: 10 }, inactiveUsers: [], collaborationIndex: [], dailyActiveUsers: [] },
  resourceUsage: { storageByProject: [], filesByUser: [], totalStorage: { usedMB: 512, totalMB: 10240, percentage: 5 } },
  workspaceLoad: { tasksPerUser: [], projectsNearingDeadlines: [], averageTaskCompletion: { byUser: [], byProject: [] } },
  workspaceGrowth: { thisMonth: { newUsers: 2, newProjects: 1, newTasks: 30 }, trend: [], projectLifecycle: { created: 5, active: 4, completed: 1, archived: 0 } },
  featureUsage: { tasksCreated: 150, commentsAdded: 300, timeEntriesLogged: 50, filesUploaded: 25, mentionsUsed: 10, notificationsTriggered: 400 },
  planLimits: { currentPlan: 'PRO', memberCount: 10, memberLimit: 25, storageUsedMB: 512, storageLimitMB: 10240, projectCount: 5, projectLimit: 20, automationCount: 0, automationLimit: 10 },
  isAdmin: true,
}

describe('useWorkspaceUsage', () => {
  it('fetches workspace usage data', async () => {
    server.use(
      http.get('*/api/v1/workspace-usage/ws-1/usage', () => {
        return HttpResponse.json({ data: mockUsageData })
      })
    )

    const { result } = renderHook(
      () => useWorkspaceUsage('ws-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.snapshot.totalMembers).toBe(10)
    expect(result.current.data?.snapshot.engagementScore).toBe(70)
  })

  it('is disabled when enabled is false', () => {
    const { result } = renderHook(
      () => useWorkspaceUsage('ws-1', { enabled: false }),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('is disabled when workspaceId is undefined', () => {
    const { result } = renderHook(
      () => useWorkspaceUsage(undefined),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('uses different query keys for different date ranges', async () => {
    server.use(
      http.get('*/api/v1/workspace-usage/ws-1/usage', () => {
        return HttpResponse.json({ data: mockUsageData })
      })
    )

    const { result, rerender } = renderHook(
      ({ dateRange }) => useWorkspaceUsage('ws-1', { dateRange }),
      { wrapper: createWrapper(), initialProps: { dateRange: '7d' as const } }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const firstFetchCount = result.current.dataUpdatedAt

    // Change date range - should trigger new fetch
    rerender({ dateRange: '30d' })

    await waitFor(() => expect(result.current.dataUpdatedAt).toBeGreaterThan(firstFetchCount))
  })
})

describe('workspaceUsageKeys', () => {
  it('generates correct query keys', () => {
    expect(workspaceUsageKeys.all).toEqual(['workspace-usage'])
    expect(workspaceUsageKeys.detail('ws-1', '30d')).toEqual(['workspace-usage', 'ws-1', '30d'])
    expect(workspaceUsageKeys.detail('ws-2', '7d')).toEqual(['workspace-usage', 'ws-2', '7d'])
  })
})

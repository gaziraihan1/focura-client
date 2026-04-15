// tests/hooks/useAnalytics.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import {
  useAnalyticsOverview,
  useTaskTrends,
  useProjectHealth,
  useMemberContribution,
  useTimeSummary,
  useActivityTrends,
  useWorkload,
} from '@/hooks/useAnalytics'

const WS_ID = 'ws-1'

// ─── useAnalyticsOverview ─────────────────────────────────────────────────────

describe('useAnalyticsOverview', () => {
  it('fetches analytics overview', async () => {
    const { result } = renderHook(
      () => useAnalyticsOverview(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.kpis.totalProjects).toBe(5)
    expect(result.current.data?.kpis.completionRate).toBe(42.8)
    expect(result.current.data?.kpis.activeMembers).toBe(6)
  })

  it('returns correct task status breakdown', async () => {
    const { result } = renderHook(
      () => useAnalyticsOverview(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.taskStatus).toHaveLength(3)
    expect(result.current.data?.taskStatus[0].status).toBe('TODO')
    expect(result.current.data?.taskStatus[0].count).toBe(10)
  })

  it('returns deadline risk info', async () => {
    const { result } = renderHook(
      () => useAnalyticsOverview(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.deadlineRisk.riskLevel).toBe('medium')
    expect(result.current.data?.deadlineRisk.dueIn7DaysCount).toBe(3)
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useAnalyticsOverview(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useTaskTrends ────────────────────────────────────────────────────────────

describe('useTaskTrends', () => {
  it('fetches task trends with default 30 days', async () => {
    const { result } = renderHook(
      () => useTaskTrends(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.completionTrend).toHaveLength(2)
    expect(result.current.data?.overdueTrend).toHaveLength(1)
  })

  it('fetches task trends with custom days', async () => {
    const { result } = renderHook(
      () => useTaskTrends(WS_ID, 7),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.completionTrend).toBeDefined()
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useTaskTrends(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useProjectHealth ─────────────────────────────────────────────────────────

describe('useProjectHealth', () => {
  it('fetches project health for all projects', async () => {
    const { result } = renderHook(
      () => useProjectHealth(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })

  it('identifies healthy projects', async () => {
    const { result } = renderHook(
      () => useProjectHealth(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const healthy = result.current.data?.filter(p => p.health === 'healthy')
    expect(healthy).toHaveLength(1)
    expect(healthy?.[0].projectName).toBe('Test Project')
    expect(healthy?.[0].progress).toBe(60)
  })

  it('identifies at-risk projects', async () => {
    const { result } = renderHook(
      () => useProjectHealth(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const atRisk = result.current.data?.filter(p => p.health === 'at-risk')
    expect(atRisk).toHaveLength(1)
    expect(atRisk?.[0].projectName).toBe('At Risk Project')
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useProjectHealth(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useMemberContribution ────────────────────────────────────────────────────

describe('useMemberContribution', () => {
  it('fetches member contributions', async () => {
    const { result } = renderHook(
      () => useMemberContribution(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].userName).toBe('Test User')
    expect(result.current.data?.[0].contributionScore).toBe(85)
    expect(result.current.data?.[0].completedTasks).toBe(10)
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useMemberContribution(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useTimeSummary ───────────────────────────────────────────────────────────

describe('useTimeSummary', () => {
  it('fetches time summary with default 7 days', async () => {
    const { result } = renderHook(
      () => useTimeSummary(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.totalHours).toBe(120)
    expect(result.current.data?.avgHoursPerMember).toBe(15)
    expect(result.current.data?.projectBreakdown).toHaveLength(2)
  })

  it('fetches time summary with custom days', async () => {
    const { result } = renderHook(
      () => useTimeSummary(WS_ID, 30),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.totalHours).toBeDefined()
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useTimeSummary(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useActivityTrends ────────────────────────────────────────────────────────

describe('useActivityTrends', () => {
  it('fetches activity trends', async () => {
    const { result } = renderHook(
      () => useActivityTrends(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.volumeTrend).toHaveLength(1)
    expect(result.current.data?.mostActiveDay.day).toBe('Monday')
    expect(result.current.data?.mostActiveDay.count).toBe(24)
  })

  it('returns correct volume trend shape', async () => {
    const { result } = renderHook(
      () => useActivityTrends(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const point = result.current.data?.volumeTrend[0]
    expect(point).toHaveProperty('created')
    expect(point).toHaveProperty('updated')
    expect(point).toHaveProperty('completed')
    expect(point).toHaveProperty('total')
    expect(point?.total).toBe(11)
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useActivityTrends(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useWorkload ──────────────────────────────────────────────────────────────

describe('useWorkload', () => {
  it('fetches workload for all members', async () => {
    const { result } = renderHook(
      () => useWorkload(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })

  it('identifies overloaded members', async () => {
    const { result } = renderHook(
      () => useWorkload(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const overloaded = result.current.data?.filter(m => m.status === 'overloaded')
    expect(overloaded).toHaveLength(1)
    expect(overloaded?.[0].userName).toBe('Busy User')
    expect(overloaded?.[0].assignedTasks).toBe(20)
  })

  it('identifies normal workload members', async () => {
    const { result } = renderHook(
      () => useWorkload(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const normal = result.current.data?.filter(m => m.status === 'normal')
    expect(normal).toHaveLength(1)
    expect(normal?.[0].userName).toBe('Test User')
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useWorkload(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})
// tests/hooks/useCalendar.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { server } from '../mock/server'
import { http, HttpResponse } from 'msw'
import { createWrapper } from '../utils/renderWithProviders'

import {
  useCalendarAggregates,
  useCalendarInsights,
  useGoalCheckpoints,
  useSystemEvents,
  initializeCalendar,
  recalculateAggregate,
} from '@/hooks/useCalendar'

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ── Shared filter fixture ─────────────────────────────────────────────────────

const defaultFilters = {
  startDate: new Date('2024-06-01T00:00:00.000Z'),
  endDate:   new Date('2024-06-30T00:00:00.000Z'),
}

const workspaceFilters = {
  ...defaultFilters,
  workspaceId: 'ws-1',
}

// ── useCalendarAggregates ─────────────────────────────────────────────────────

describe('useCalendarAggregates', () => {
  it('fetches and returns aggregates', async () => {
    const { result } = renderHook(
      () => useCalendarAggregates(defaultFilters),
      { wrapper: createWrapper() }
    )

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data[0].id).toBe('agg-1')
    expect(result.current.data[0].workloadScore).toBe(72)
  })

  it('returns over-capacity aggregate correctly', async () => {
    const { result } = renderHook(
      () => useCalendarAggregates(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    const overCapacity = result.current.data.find((d) => d.overCapacity)
    expect(overCapacity).toBeDefined()
    expect(overCapacity?.id).toBe('agg-2')
    expect(overCapacity?.criticalTasks).toBe(4)
    expect(overCapacity?.isReviewDay).toBe(true)
  })

  it('accepts workspaceId filter', async () => {
    const { result } = renderHook(
      () => useCalendarAggregates(workspaceFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toBeDefined()
    expect(result.current.error).toBeNull()
  })

  it('sets error state when API fails', async () => {
    server.use(
      http.get(`${BASE}/api/calendar/aggregates`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useCalendarAggregates(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).not.toBeNull()
    expect(result.current.data).toHaveLength(0)
  })

  it('sets error state when API returns success:false', async () => {
    server.use(
      http.get(`${BASE}/api/calendar/aggregates`, () =>
        HttpResponse.json({ success: false, message: 'Unauthorized' })
      )
    )

    const { result } = renderHook(
      () => useCalendarAggregates(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Unauthorized')
    expect(result.current.data).toHaveLength(0)
  })

  it('refetch re-triggers the request', async () => {
    const { result } = renderHook(
      () => useCalendarAggregates(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      result.current.refetch()
    })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toHaveLength(2)
  })
})

// ── useCalendarInsights ───────────────────────────────────────────────────────

describe('useCalendarInsights', () => {
  it('fetches and returns insights', async () => {
    const { result } = renderHook(
      () => useCalendarInsights(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.data?.burnoutRisk).toBe('LOW')
    expect(result.current.data?.totalPlannedHours).toBe(40)
    expect(result.current.data?.overloadedDays).toBe(2)
  })

  it('returns time allocation breakdown', async () => {
    const { result } = renderHook(
      () => useCalendarInsights(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data?.timeAllocation?.deepWork).toBe(60)
    expect(result.current.data?.timeAllocation?.meetings).toBe(20)
  })

  it('handles nullable timeAllocation gracefully', async () => {
    server.use(
      http.get(`${BASE}/api/calendar/insights`, () =>
        HttpResponse.json({
          success: true,
          data: {
            totalPlannedHours: 58,
            totalCapacityHours: 40,
            commitmentGap: -18,
            overloadedDays: 5,
            focusDays: 0,
            burnoutRisk: 'CRITICAL',
            timeAllocation: null,
          },
        })
      )
    )

    const { result } = renderHook(
      () => useCalendarInsights(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data?.burnoutRisk).toBe('CRITICAL')
    expect(result.current.data?.timeAllocation).toBeNull()
  })

  it('sets error state when API fails', async () => {
    server.use(
      http.get(`${BASE}/api/calendar/insights`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useCalendarInsights(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).not.toBeNull()
    expect(result.current.data).toBeNull()
  })

  it('sets error from API message when success:false', async () => {
    server.use(
      http.get(`${BASE}/api/calendar/insights`, () =>
        HttpResponse.json({ success: false, message: 'Failed to fetch insights' })
      )
    )

    const { result } = renderHook(
      () => useCalendarInsights(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Failed to fetch insights')
  })

  it('refetch re-triggers the request', async () => {
    const { result } = renderHook(
      () => useCalendarInsights(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      result.current.refetch()
    })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).not.toBeNull()
  })
})

// ── useGoalCheckpoints ────────────────────────────────────────────────────────

describe('useGoalCheckpoints', () => {
  it('fetches and returns goal checkpoints', async () => {
    const { result } = renderHook(
      () => useGoalCheckpoints(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data[0].id).toBe('goal-1')
    expect(result.current.data[0].type).toBe('MONTHLY')
  })

  it('returns both completed and incomplete goals', async () => {
    const { result } = renderHook(
      () => useGoalCheckpoints(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    const incomplete = result.current.data.filter((g) => !g.completed)
    const complete   = result.current.data.filter((g) => g.completed)

    expect(incomplete).toHaveLength(1)
    expect(complete).toHaveLength(1)
    expect(complete[0].id).toBe('goal-2')
  })

  it('creates a new goal checkpoint', async () => {
    const { result } = renderHook(
      () => useGoalCheckpoints(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    let created: any
    await act(async () => {
      created = await result.current.createGoal({
        title:       'Launch beta',
        type:        'WEEKLY',
        targetDate:  new Date('2024-06-07T00:00:00.000Z'),
        workspaceId: 'ws-1',
      })
    })

    expect(created?.id).toBe('goal-new')
    expect(created?.title).toBe('Launch beta')
    expect(created?.type).toBe('WEEKLY')
    expect(created?.completed).toBe(false)
  })

  it('throws when createGoal fails', async () => {
    server.use(
      http.post(`${BASE}/api/calendar/goals`, () =>
        new HttpResponse(null, { status: 400 })
      )
    )

    const { result } = renderHook(
      () => useGoalCheckpoints(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    await expect(
      act(async () => {
        await result.current.createGoal({
          title:      'Will fail',
          type:       'KPI',
          targetDate: new Date(),
        })
      })
    ).rejects.toThrow()
  })

  it('throws with API message when createGoal returns success:false', async () => {
    server.use(
      http.post(`${BASE}/api/calendar/goals`, () =>
        HttpResponse.json({ success: false, message: 'Quota exceeded' })
      )
    )

    const { result } = renderHook(
      () => useGoalCheckpoints(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    await expect(
      act(async () => {
        await result.current.createGoal({
          title:      'Will fail',
          type:       'KPI',
          targetDate: new Date(),
        })
      })
    ).rejects.toThrow('Quota exceeded')
  })

  it('sets error state when GET fails', async () => {
    server.use(
      http.get(`${BASE}/api/calendar/goals`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useGoalCheckpoints(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).not.toBeNull()
    expect(result.current.data).toHaveLength(0)
  })
})

// ── useSystemEvents ───────────────────────────────────────────────────────────

describe('useSystemEvents', () => {
  it('fetches and returns system events', async () => {
    const { result } = renderHook(
      () => useSystemEvents(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data[0].id).toBe('event-1')
    expect(result.current.data[0].type).toBe('WEEKLY_RESET')
  })

  it('returns both recurring and one-off events', async () => {
    const { result } = renderHook(
      () => useSystemEvents(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    const recurring = result.current.data.filter((e) => e.recurring)
    const oneOff    = result.current.data.filter((e) => !e.recurring)

    expect(recurring).toHaveLength(1)
    expect(oneOff).toHaveLength(1)
    expect(oneOff[0].type).toBe('SPRINT_END')
  })

  it('accepts workspaceId filter', async () => {
    const { result } = renderHook(
      () => useSystemEvents(workspaceFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toBeDefined()
    expect(result.current.error).toBeNull()
  })

  it('sets error state when API fails', async () => {
    server.use(
      http.get(`${BASE}/api/calendar/system-events`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useSystemEvents(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).not.toBeNull()
    expect(result.current.data).toHaveLength(0)
  })

  it('sets error from API message when success:false', async () => {
    server.use(
      http.get(`${BASE}/api/calendar/system-events`, () =>
        HttpResponse.json({ success: false, message: 'Failed to fetch system events' })
      )
    )

    const { result } = renderHook(
      () => useSystemEvents(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Failed to fetch system events')
  })

  it('refetch re-triggers the request', async () => {
    const { result } = renderHook(
      () => useSystemEvents(defaultFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      result.current.refetch()
    })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toHaveLength(2)
  })
})

// ── initializeCalendar (standalone async fn) ──────────────────────────────────

describe('initializeCalendar', () => {
  it('returns true on success', async () => {
    const result = await initializeCalendar()
    expect(result).toBe(true)
  })

  it('returns false when API returns success:false', async () => {
    server.use(
      http.post(`${BASE}/api/calendar/initialize`, () =>
        HttpResponse.json({ success: false, message: 'Already initialized' })
      )
    )

    const result = await initializeCalendar()
    expect(result).toBe(false)
  })

  it('returns false when API throws', async () => {
    server.use(
      http.post(`${BASE}/api/calendar/initialize`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const result = await initializeCalendar()
    expect(result).toBe(false)
  })
})

// ── recalculateAggregate (standalone async fn) ────────────────────────────────

describe('recalculateAggregate', () => {
  it('returns true on success', async () => {
    const result = await recalculateAggregate(new Date('2024-06-01'))
    expect(result).toBe(true)
  })

  it('returns true when called with workspaceId', async () => {
    const result = await recalculateAggregate(new Date('2024-06-01'), 'ws-1')
    expect(result).toBe(true)
  })

  it('returns false when API returns success:false', async () => {
    server.use(
      http.post(`${BASE}/api/calendar/recalculate`, () =>
        HttpResponse.json({ success: false, message: 'Failed to recalculate aggregate' })
      )
    )

    const result = await recalculateAggregate(new Date('2024-06-01'))
    expect(result).toBe(false)
  })

  it('returns false when API throws', async () => {
    server.use(
      http.post(`${BASE}/api/calendar/recalculate`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const result = await recalculateAggregate(new Date('2024-06-01'))
    expect(result).toBe(false)
  })
})
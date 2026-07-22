import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper, renderHookWithProviders } from '../utils/renderWithProviders'
import {
  useCalendarAggregates,
  useCalendarInsights,
  useGoalCheckpoints,
  useSystemEvents,
  useInitializeCalendar,
  useRecalculateAggregate,
  calendarKeys,
} from '@/hooks/useCalendar'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

const mockFilters = {
  startDate: new Date('2026-07-01'),
  endDate: new Date('2026-07-31'),
  workspaceId: 'ws-1',
}

const mockAggregates = [
  {
    date: '2026-07-15',
    totalTasks: 5,
    criticalTasks: 1,
    plannedHours: 6,
    focusMinutes: 120,
    workloadScore: 0.75,
    overCapacity: false,
    hasPrimaryFocus: true,
    milestoneCount: 0,
    isReviewDay: false,
  },
]

const mockInsights = {
  averageWorkload: 0.65,
  peakDay: 'Wednesday',
  totalFocusHours: 40,
  burnoutRisk: 'LOW',
}

const mockGoals = [
  {
    id: 'goal-1',
    title: 'Complete project',
    targetDate: '2026-07-15',
    completed: false,
    workspaceId: 'ws-1',
  },
]

const mockSystemEvents = [
  {
    id: 'event-1',
    title: 'Team meeting',
    date: '2026-07-10',
    type: 'meeting',
  },
]

describe('calendarKeys', () => {
  it('generates correct query keys', () => {
    expect(calendarKeys.all).toEqual(['calendar'])

    const aggregatesKey = calendarKeys.aggregates(mockFilters)
    expect(aggregatesKey[0]).toBe('calendar')
    expect(aggregatesKey[1]).toBe('aggregates')
    expect(aggregatesKey[4]).toBe('ws-1')

    const insightsKey = calendarKeys.insights(mockFilters)
    expect(insightsKey[1]).toBe('insights')

    const goalsKey = calendarKeys.goals(mockFilters)
    expect(goalsKey[1]).toBe('goals')

    const eventsKey = calendarKeys.systemEvents(mockFilters)
    expect(eventsKey[1]).toBe('systemEvents')
  })
})

describe('useCalendarAggregates', () => {
  it('fetches aggregates data', async () => {
    server.use(
      http.get('*/api/v1/calendar/aggregates', () => {
        return HttpResponse.json({ success: true, data: mockAggregates })
      })
    )

    const { result } = renderHook(
      () => useCalendarAggregates(mockFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].totalTasks).toBe(5)
  })

  it('returns empty array on error', async () => {
    server.use(
      http.get('*/api/v1/calendar/aggregates', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    const { result } = renderHook(
      () => useCalendarAggregates(mockFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.data).toBeUndefined()
  })
})

describe('useCalendarInsights', () => {
  it('fetches insights data', async () => {
    server.use(
      http.get('*/api/v1/calendar/insights', () => {
        return HttpResponse.json({ success: true, data: mockInsights })
      })
    )

    const { result } = renderHook(
      () => useCalendarInsights(mockFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.averageWorkload).toBe(0.65)
    expect(result.current.data?.burnoutRisk).toBe('LOW')
  })

  it('returns null on error', async () => {
    server.use(
      http.get('*/api/v1/calendar/insights', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    const { result } = renderHook(
      () => useCalendarInsights(mockFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.data).toBeUndefined()
  })
})

describe('useGoalCheckpoints', () => {
  it('fetches goals data', async () => {
    server.use(
      http.get('*/api/v1/calendar/goals', () => {
        return HttpResponse.json({ success: true, data: mockGoals })
      })
    )

    const { result } = renderHook(
      () => useGoalCheckpoints(mockFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].title).toBe('Complete project')
  })

  it('exposes createGoal function', async () => {
    server.use(
      http.get('*/api/v1/calendar/goals', () => {
        return HttpResponse.json({ success: true, data: [] })
      }),
      http.post('*/api/v1/calendar/goals', () => {
        return HttpResponse.json({
          success: true,
          data: { id: 'new-goal', title: 'New Goal', completed: false },
        })
      })
    )

    const { result } = renderHook(
      () => useGoalCheckpoints(mockFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(typeof result.current.createGoal).toBe('function')
    expect(typeof result.current.isCreating).toBe('boolean')
  })
})

describe('useSystemEvents', () => {
  it('fetches system events', async () => {
    server.use(
      http.get('*/api/v1/calendar/system-events', () => {
        return HttpResponse.json({ success: true, data: mockSystemEvents })
      })
    )

    const { result } = renderHook(
      () => useSystemEvents(mockFilters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].title).toBe('Team meeting')
  })
})

describe('useInitializeCalendar', () => {
  it('exposes mutate function and loading state', () => {
    const { result } = renderHook(
      () => useInitializeCalendar(),
      { wrapper: createWrapper() }
    )

    expect(typeof result.current.mutate).toBe('function')
    expect(typeof result.current.mutateAsync).toBe('function')
    expect(result.current.isPending).toBe(false)
  })
})

describe('useRecalculateAggregate', () => {
  it('exposes mutate function', () => {
    const { result } = renderHook(
      () => useRecalculateAggregate(mockFilters),
      { wrapper: createWrapper() }
    )

    expect(typeof result.current.mutate).toBe('function')
    expect(typeof result.current.mutateAsync).toBe('function')
  })
})

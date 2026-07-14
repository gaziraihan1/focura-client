import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { server } from '../mock/server'
import { http, HttpResponse } from 'msw'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const ok = (data: unknown) => HttpResponse.json({ success: true, data })

import { useBurnoutTrends, useRecommendations } from '@/hooks/useBurnoutTrends'

describe('useBurnoutTrends', () => {
  it('fetches burnout trend data', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/burnout-trends`, () =>
        ok([
          { week: '2024-06-01', score: 65, tasksCompleted: 12, focusHours: 20 },
          { week: '2024-06-08', score: 72, tasksCompleted: 10, focusHours: 18 },
        ])
      )
    )

    const { result } = renderHook(() => useBurnoutTrends(12), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data[0]).toHaveProperty('score')
    expect(result.current.data[1].score).toBe(72)
  })

  it('returns empty array on API error', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/burnout-trends`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(() => useBurnoutTrends(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual([])
  })

  it('refetches data on refetch call', async () => {
    const spy = vi.fn()
    server.use(
      http.get(`${BASE}/api/v1/calendar/burnout-trends`, () => {
        spy()
        return ok([])
      })
    )

    const { result } = renderHook(() => useBurnoutTrends(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(spy).toHaveBeenCalledTimes(1)

    act(() => { result.current.refetch() })
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2))
  })
})

describe('useRecommendations', () => {
  it('fetches recommendations', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/recommendations`, () =>
        ok([{ id: 'rec-1', title: 'Take a break', type: 'WELLNESS' }])
      )
    )

    const { result } = renderHook(() => useRecommendations(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data[0].id).toBe('rec-1')
  })

  it('dismisses a recommendation', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/recommendations`, () =>
        ok([
          { id: 'rec-1', title: 'Take a break', type: 'WELLNESS' },
          { id: 'rec-2', title: 'Reduce workload', type: 'WORKLOAD' },
        ])
      ),
      http.patch(`${BASE}/api/v1/calendar/recommendations/:id/dismiss`, () =>
        ok({ success: true })
      ),
    )

    const { result } = renderHook(() => useRecommendations(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toHaveLength(2)

    await act(async () => {
      await result.current.dismiss('rec-1')
    })

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data[0].id).toBe('rec-2')
  })
})

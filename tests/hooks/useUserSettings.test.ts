import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { server } from '../mock/server'
import { http, HttpResponse } from 'msw'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const ok = (data: any) => HttpResponse.json({ success: true, data })

import { useUserCapacity, useUserSchedule } from '@/hooks/useUserSettings'

describe('useUserCapacity', () => {
  it('fetches user capacity', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/capacity`, () =>
        ok({ maxDailyTasks: 8, maxWeeklyHours: 40, focusHoursGoal: 4 })
      )
    )

    const { result } = renderHook(() => useUserCapacity(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data?.maxDailyTasks).toBe(8)
    expect(result.current.data?.maxWeeklyHours).toBe(40)
  })

  it('returns null on API error', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/capacity`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(() => useUserCapacity(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeTruthy()
  })

  it('updates capacity', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/capacity`, () =>
        ok({ maxDailyTasks: 8, maxWeeklyHours: 40, focusHoursGoal: 4 })
      ),
      http.put(`${BASE}/api/v1/calendar/capacity`, () =>
        ok({ maxDailyTasks: 10, maxWeeklyHours: 40, focusHoursGoal: 5 })
      )
    )

    const { result } = renderHook(() => useUserCapacity(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.updateCapacity({ maxDailyTasks: 10, focusHoursGoal: 5 })
    })

    expect(success).toBe(true)
    expect(result.current.data?.maxDailyTasks).toBe(10)
  })

  it('returns false when update fails', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/capacity`, () => ok({ maxDailyTasks: 8, maxWeeklyHours: 40, focusHoursGoal: 4 })),
      http.put(`${BASE}/api/v1/calendar/capacity`, () =>
        new HttpResponse(null, { status: 400 })
      )
    )

    const { result } = renderHook(() => useUserCapacity(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))

    let success = false
    try {
      await act(async () => {
        success = await result.current.updateCapacity({ maxDailyTasks: 10 })
      })
    } catch {
      success = false
    }

    expect(success).toBe(false)
  })
})

describe('useUserSchedule', () => {
  it('fetches user schedule', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/schedule`, () =>
        ok({ workDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], startTime: '09:00', endTime: '17:00' })
      )
    )

    const { result } = renderHook(() => useUserSchedule(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data?.workDays).toHaveLength(5)
    expect(result.current.data?.startTime).toBe('09:00')
  })

  it('updates schedule', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/schedule`, () =>
        ok({ workDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], startTime: '09:00', endTime: '17:00' })
      ),
      http.put(`${BASE}/api/v1/calendar/schedule`, () =>
        ok({ workDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'], startTime: '10:00', endTime: '16:00' })
      )
    )

    const { result } = renderHook(() => useUserSchedule(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.updateSchedule({ workDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'], startTime: '10:00', endTime: '16:00' })
    })

    expect(success).toBe(true)
    expect(result.current.data?.workDays).toHaveLength(3)
  })
})

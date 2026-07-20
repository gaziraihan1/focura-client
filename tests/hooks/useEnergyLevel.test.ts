import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { server } from '../mock/server'
import { http, HttpResponse } from 'msw'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const ok = (data: any) => HttpResponse.json({ success: true, data })

import { useEnergyLevel, useEnergyHistory } from '@/hooks/useEnergyLevel'

describe('useEnergyLevel', () => {
  it('fetches energy level for a given date', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/energy`, () =>
        ok({ date: '2024-06-15', level: 'MEDIUM', note: 'Feeling okay' })
      )
    )

    const { result } = renderHook(() => useEnergyLevel(new Date('2024-06-15')), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data?.level).toBe('MEDIUM')
    expect(result.current.data?.note).toBe('Feeling okay')
  })

  it('returns null data when API returns no data', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/energy`, () =>
        ok(null)
      )
    )

    const { result } = renderHook(() => useEnergyLevel(new Date('2024-06-15')), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBeNull()
  })

  it('handles API error silently', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/energy`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(() => useEnergyLevel(new Date('2024-06-15')), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBeNull()
  })

  it('logs energy level', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/energy`, () => ok(null)),
      http.post(`${BASE}/api/v1/calendar/energy`, () =>
        ok({ date: '2024-06-15', level: 'HIGH', note: 'Great day' })
      )
    )

    const { result } = renderHook(() => useEnergyLevel(new Date('2024-06-15')), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.logEnergy({ level: 'HIGH', note: 'Great day' })
    })

    expect(success).toBe(true)
    expect(result.current.data?.level).toBe('HIGH')
  })

  it('returns false when logEnergy API fails', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/energy`, () => ok(null)),
      http.post(`${BASE}/api/v1/calendar/energy`, () =>
        new HttpResponse(null, { status: 400 })
      )
    )

    const { result } = renderHook(() => useEnergyLevel(new Date('2024-06-15')), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))

    let success = false
    try {
      await act(async () => {
        success = await result.current.logEnergy({ level: 'HIGH', note: 'Great day' })
      })
    } catch {
      success = false
    }

    expect(success).toBe(false)
  })
})

describe('useEnergyHistory', () => {
  it('fetches energy history for a date range', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/energy/history`, () =>
        ok([
          { date: '2024-06-01', level: 'LOW', note: 'Tired' },
          { date: '2024-06-02', level: 'MEDIUM', note: null },
        ])
      )
    )

    const { result } = renderHook(
      () => useEnergyHistory(new Date('2024-06-01'), new Date('2024-06-30')),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data[0].level).toBe('LOW')
  })

  it('returns empty array on API error', async () => {
    server.use(
      http.get(`${BASE}/api/v1/calendar/energy/history`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useEnergyHistory(new Date('2024-06-01'), new Date('2024-06-30')),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual([])
  })
})

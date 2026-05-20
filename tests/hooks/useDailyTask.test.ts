// tests/hooks/useDailyTasks.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mock/server'
import { createWrapper } from '../utils/renderWithProviders'
import { useDailyTasks } from '@/hooks/useDailyTasks'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const ok = (data: unknown) => HttpResponse.json({ success: true, data })

// ─── useDailyTasks — fetch ────────────────────────────────────────────────────

describe('useDailyTasks', () => {
  it('fetches primary and secondary tasks', async () => {
    const { result } = renderHook(
      () => useDailyTasks('test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.primaryTask?.id).toBe('task-1')
    expect(result.current.primaryTask?.title).toBe('Primary Daily Task')
    expect(result.current.secondaryTasks).toHaveLength(1)
    expect(result.current.secondaryTasks[0].id).toBe('task-2')
    expect(result.current.hasPrimaryTask).toBe(true)
  })

  it('returns empty state when no tasks are set', async () => {
    server.use(
      http.get(`${BASE}/api/v1/daily-tasks`, () =>
        ok({ primaryTask: null, secondaryTasks: [] })
      )
    )

    const { result } = renderHook(
      () => useDailyTasks('test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.primaryTask).toBeNull()
    expect(result.current.secondaryTasks).toHaveLength(0)
    expect(result.current.hasPrimaryTask).toBe(false)
  })

  it('works without workspaceSlug', async () => {
    const { result } = renderHook(
      () => useDailyTasks(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.primaryTask).toBeDefined()
  })
})

// ─── addToPrimary ─────────────────────────────────────────────────────────────

describe('addToPrimary', () => {
  it('adds a task as primary', async () => {
    const { result } = renderHook(
      () => useDailyTasks('test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    let response: { success: boolean } | undefined
    await act(async () => {
      response = await result.current.addToPrimary('task-1')
    })

    expect(response?.success).toBe(true)
  })

  it('returns success false on API error', async () => {
    server.use(
      http.post(`${BASE}/api/v1/daily-tasks`, () =>
        HttpResponse.json({ success: false }, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useDailyTasks('test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    let response: { success: boolean } | undefined
    await act(async () => {
      response = await result.current.addToPrimary('task-1')
    })

    expect(response?.success).toBe(false)
  })
})

// ─── addToSecondary ───────────────────────────────────────────────────────────

describe('addToSecondary', () => {
  it('adds a task as secondary', async () => {
    const { result } = renderHook(
      () => useDailyTasks('test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    let response: { success: boolean } | undefined
    await act(async () => {
      response = await result.current.addToSecondary('task-3')
    })

    expect(response?.success).toBe(true)
  })
})

// ─── removeDailyTask ──────────────────────────────────────────────────────────

describe('removeDailyTask', () => {
  it('removes a task from daily tasks', async () => {
    const { result } = renderHook(
      () => useDailyTasks('test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    let response: { success: boolean } | undefined
    await act(async () => {
      response = await result.current.removeDailyTask('task-2')
    })

    expect(response?.success).toBe(true)
  })

  it('returns success false on API error', async () => {
    server.use(
      http.delete(`${BASE}/api/v1/daily-tasks/:taskId`, () =>
        HttpResponse.json({ success: false }, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useDailyTasks('test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    let response: { success: boolean } | undefined
    await act(async () => {
      response = await result.current.removeDailyTask('task-1')
    })

    expect(response?.success).toBe(false)
  })
})

// ─── loading states ───────────────────────────────────────────────────────────

describe('loading states', () => {
  it('exposes isAdding while mutation is pending', async () => {
    const { result } = renderHook(
      () => useDailyTasks('test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isAdding).toBe(false)
    expect(result.current.isRemoving).toBe(false)
  })
})

// ─── error state ──────────────────────────────────────────────────────────────

describe('error state', () => {
  it('returns null error on success', async () => {
    const { result } = renderHook(
      () => useDailyTasks('test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBeNull()
  })
})
// tests/hooks/useFocusSession.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mock/server'
import { createWrapper } from '../utils/renderWithProviders'
import { useFocusSession, useFocusSessionStats } from '@/hooks/useFocusSession'
import { noActiveSessionHandler } from '../mock/handlers/focusSession.handlers'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ─── useFocusSession — fetch active ───────────────────────────────────────────

describe('useFocusSession — active session', () => {
  it('fetches and exposes active session', async () => {
    const { result } = renderHook(
      () => useFocusSession(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.activeSession?.id).toBe('session-1')
    expect(result.current.activeSession?.type).toBe('POMODORO')
    expect(result.current.activeSession?.duration).toBe(25)
    expect(result.current.activeSession?.task?.title).toBe('Test Task')
  })

  it('returns null when no session is active', async () => {
    server.use(noActiveSessionHandler)

    const { result } = renderHook(
      () => useFocusSession(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.activeSession).toBeNull()
  })

  it('exposes correct initial mutation flags', async () => {
    const { result } = renderHook(
      () => useFocusSession(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isStarting).toBe(false)
    expect(result.current.isCompleting).toBe(false)
    expect(result.current.isCancelling).toBe(false)
    expect(result.current.isMutating).toBe(false)
  })
})

// ─── startSession ─────────────────────────────────────────────────────────────

describe('startSession', () => {
  it('starts a new focus session', async () => {
    server.use(noActiveSessionHandler)

    const { result } = renderHook(
      () => useFocusSession(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      result.current.startSession({
        taskId: 'task-1',
        type: 'POMODORO',
        duration: 25,
      })
    })

    await waitFor(() => expect(result.current.activeSession?.id).toBe('session-new'))
    expect(result.current.activeSession?.type).toBe('POMODORO')
    expect(result.current.activeSession?.duration).toBe(25)
  })

  it('starts a DEEP_WORK session with custom duration', async () => {
    server.use(noActiveSessionHandler)

    const { result } = renderHook(
      () => useFocusSession(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      result.current.startSession({
        taskId: 'task-1',
        type: 'DEEP_WORK',
        duration: 90,
      })
    })

    await waitFor(() => expect(result.current.activeSession).not.toBeNull())
    expect(result.current.activeSession?.duration).toBe(90)
    expect(result.current.activeSession?.type).toBe('DEEP_WORK')
  })

  it('uses default duration and type when not provided', async () => {
    server.use(noActiveSessionHandler)

    const { result } = renderHook(
      () => useFocusSession(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      result.current.startSession({ taskId: 'task-1' })
    })

    await waitFor(() => expect(result.current.activeSession).not.toBeNull())
  })
})

// ─── completeSession ──────────────────────────────────────────────────────────

describe('completeSession', () => {
  it('completes the active session and clears it optimistically', async () => {
    const { result } = renderHook(
      () => useFocusSession(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.activeSession?.id).toBe('session-1'))

    await act(async () => {
      result.current.completeSession()
    })

    // Optimistic clear happens immediately
    await waitFor(() => expect(result.current.activeSession).toBeNull())
  })

  it('rolls back optimistic clear on API error', async () => {
    server.use(
      http.post(`${BASE}/api/focus-sessions/:sessionId/complete`, () =>
        HttpResponse.json({ success: false }, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useFocusSession(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.activeSession?.id).toBe('session-1'))

    await act(async () => {
      result.current.completeSession()
    })

    // Should roll back to previous session after error
    await waitFor(() => expect(result.current.activeSession?.id).toBe('session-1'))
  })
})

// ─── cancelSession ────────────────────────────────────────────────────────────

describe('cancelSession', () => {
  it('cancels the active session and clears it optimistically', async () => {
    const { result } = renderHook(
      () => useFocusSession(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.activeSession?.id).toBe('session-1'))

    await act(async () => {
      result.current.cancelSession()
    })

    await waitFor(() => expect(result.current.activeSession).toBeNull())
  })

  it('rolls back optimistic clear on API error', async () => {
    server.use(
      http.post(`${BASE}/api/focus-sessions/:sessionId/cancel`, () =>
        HttpResponse.json({ success: false }, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useFocusSession(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.activeSession?.id).toBe('session-1'))

    await act(async () => {
      result.current.cancelSession()
    })

    await waitFor(() => expect(result.current.activeSession?.id).toBe('session-1'))
  })
})

// ─── useFocusSessionStats ─────────────────────────────────────────────────────

describe('useFocusSessionStats', () => {
  it('fetches focus session stats', async () => {
    const { result } = renderHook(
      () => useFocusSessionStats(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.totalSessions).toBe(20)
    expect(result.current.data?.totalMinutes).toBe(500)
    expect(result.current.data?.completedToday).toBe(3)
    expect(result.current.data?.averageSessionLength).toBe(25)
    expect(result.current.data?.focusStreak).toBe(5)
  })

  it('throws when stats fetch fails', async () => {
    server.use(
      http.get(`${BASE}/api/focus-sessions/stats`, () =>
        HttpResponse.json({ success: false }, { status: 500 })
      )
    )

    const { result } = renderHook(
      () => useFocusSessionStats(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
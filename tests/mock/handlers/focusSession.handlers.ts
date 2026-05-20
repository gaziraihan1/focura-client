// tests/mock/handlers/focusSession.handlers.ts
import { http, HttpResponse } from 'msw'
import type { FocusSession, FocusSessionStats } from '@/hooks/useFocusSession'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const mockFocusSession: FocusSession = {
  id: 'session-1',
  userId: 'user-1',
  taskId: 'task-1',
  duration: 25,
  type: 'POMODORO',
  completed: false,
  startedAt: '2024-01-01T09:00:00.000Z',
  endedAt: null,
  task: {
    id: 'task-1',
    title: 'Test Task',
    description: 'A task to focus on',
  },
}

export const mockFocusSessionStats: FocusSessionStats = {
  totalSessions: 20,
  totalMinutes: 500,
  completedToday: 3,
  averageSessionLength: 25,
  focusStreak: 5,
}

// api.get returns the full ApiResponse — fetchActiveSession reads result?.success and result.data
const okActive = (data: FocusSession | null) =>
  HttpResponse.json({ success: true, data })

const okStats = (data: FocusSessionStats) =>
  HttpResponse.json({ success: true, data })

const ok = (data: unknown) => HttpResponse.json({ success: true, data })

export const focusSessionHandlers = [
  // Active session
  http.get(`${BASE}/api/v1/focus-sessions/active`, () =>
    okActive(mockFocusSession)
  ),

  // Stats
  http.get(`${BASE}/api/v1/focus-sessions/stats`, () =>
    okStats(mockFocusSessionStats)
  ),

  // Start session
  http.post(`${BASE}/api/v1/focus-sessions/start`, async ({ request }) => {
    const body = await request.json() as Partial<FocusSession>
    return ok({
      ...mockFocusSession,
      ...body,
      id: 'session-new',
      startedAt: new Date().toISOString(),
    })
  }),

  // Complete session
  http.post(`${BASE}/api/v1/focus-sessions/:sessionId/complete`, () =>
    ok({ completed: true })
  ),

  // Cancel session
  http.post(`${BASE}/api/v1/focus-sessions/:sessionId/cancel`, () =>
    ok({ cancelled: true })
  ),
]

// Override for no active session scenario
export const noActiveSessionHandler = http.get(
  `${BASE}/api/v1/focus-sessions/active`,
  () => okActive(null)
)
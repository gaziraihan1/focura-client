// tests/mock/handlers/calendar.handlers.ts
import { http, HttpResponse } from 'msw'
import type {
  CalendarDayAggregate,
  CalendarInsights,
  GoalCheckpoint,
  SystemCalendarEvent,
} from '@/types/calendar.types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ── Fixtures ──────────────────────────────────────────────────────────────────

export const mockAggregate: CalendarDayAggregate = {
  id: 'agg-1',
  userId: 'user-1',
  date: '2024-06-01T00:00:00.000Z',
  totalTasks: 8,
  dueTasks: 3,
  criticalTasks: 1,
  milestoneCount: 0,
  plannedHours: 6,
  actualHours: 5.5,
  focusMinutes: 90,
  workloadScore: 72,
  overCapacity: false,
  hasPrimaryFocus: true,
  isReviewDay: false,
  updatedAt: '2024-06-01T18:00:00.000Z',
}

export const mockAggregateOverCapacity: CalendarDayAggregate = {
  id: 'agg-2',
  userId: 'user-1',
  date: '2024-06-02T00:00:00.000Z',
  totalTasks: 15,
  dueTasks: 8,
  criticalTasks: 4,
  milestoneCount: 1,
  plannedHours: 12,
  actualHours: 10,
  focusMinutes: 30,
  workloadScore: 98,
  overCapacity: true,
  hasPrimaryFocus: false,
  isReviewDay: true,
  updatedAt: '2024-06-02T18:00:00.000Z',
}

export const mockInsights: CalendarInsights = {
  totalPlannedHours: 40,
  totalCapacityHours: 45,
  commitmentGap: 5,
  overloadedDays: 2,
  focusDays: 3,
  burnoutRisk: 'LOW',
  timeAllocation: {
    deepWork: 60,
    meetings: 20,
    admin: 10,
    learning: 10,
    other: 0,
  },
}

export const mockInsightsHighRisk: CalendarInsights = {
  totalPlannedHours: 58,
  totalCapacityHours: 40,
  commitmentGap: -18,
  overloadedDays: 5,
  focusDays: 0,
  burnoutRisk: 'CRITICAL',
  timeAllocation: null,
}

export const mockGoalCheckpoint: GoalCheckpoint = {
  id: 'goal-1',
  userId: 'user-1',
  workspaceId: 'ws-1',
  title: 'Ship v2 release',
  type: 'MONTHLY',
  targetDate: '2024-06-30T00:00:00.000Z',
  completed: false,
  createdAt: '2024-06-01T00:00:00.000Z',
}

export const mockGoalCheckpoint2: GoalCheckpoint = {
  id: 'goal-2',
  userId: 'user-1',
  workspaceId: undefined,
  title: 'Finish Q2 review',
  type: 'QUARTERLY',
  targetDate: '2024-06-30T00:00:00.000Z',
  completed: true,
  createdAt: '2024-06-01T00:00:00.000Z',
}

export const mockSystemEvent: SystemCalendarEvent = {
  id: 'event-1',
  userId: 'user-1',
  workspaceId: 'ws-1',
  title: 'Weekly Reset',
  type: 'WEEKLY_RESET',
  date: '2024-06-03T00:00:00.000Z',
  recurring: true,
  createdAt: '2024-06-01T00:00:00.000Z',
}

export const mockSystemEvent2: SystemCalendarEvent = {
  id: 'event-2',
  userId: undefined,
  workspaceId: 'ws-1',
  title: 'Sprint End',
  type: 'SPRINT_END',
  date: '2024-06-14T00:00:00.000Z',
  recurring: false,
  createdAt: '2024-06-01T00:00:00.000Z',
}

// ── Envelope helpers ──────────────────────────────────────────────────────────
// All these hooks check `result?.success && result.data` so every response
// must be wrapped in { success: true, data: ... }

const ok = (data: unknown) => HttpResponse.json({ success: true, data })

// ── Handlers ──────────────────────────────────────────────────────────────────

export const calendarHandlers = [
  // GET /api/v1/calendar/aggregates
  http.get(`${BASE}/api/v1/calendar/aggregates`, () =>
    ok([mockAggregate, mockAggregateOverCapacity])
  ),

  // GET /api/v1/calendar/insights
  http.get(`${BASE}/api/v1/calendar/insights`, () =>
    ok(mockInsights)
  ),

  // GET /api/v1/calendar/goals
  http.get(`${BASE}/api/v1/calendar/goals`, () =>
    ok([mockGoalCheckpoint, mockGoalCheckpoint2])
  ),

  // POST /api/v1/calendar/goals  (createGoal)
  http.post(`${BASE}/api/v1/calendar/goals`, async ({ request }) => {
    const body = await request.json() as {
      title: string
      type: string
      targetDate: string
      workspaceId?: string
    }
    const created: GoalCheckpoint = {
      id: 'goal-new',
      userId: 'user-1',
      workspaceId: body.workspaceId,
      title: body.title,
      type: body.type as GoalCheckpoint['type'],
      targetDate: body.targetDate,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    return ok(created)
  }),

  // GET /api/v1/calendar/system-events
  http.get(`${BASE}/api/v1/calendar/system-events`, () =>
    ok([mockSystemEvent, mockSystemEvent2])
  ),

  // POST /api/v1/calendar/initialize
  http.post(`${BASE}/api/v1/calendar/initialize`, () =>
    HttpResponse.json({ success: true })
  ),

  // POST /api/v1/calendar/recalculate
  http.post(`${BASE}/api/v1/calendar/recalculate`, () =>
    HttpResponse.json({ success: true })
  ),

  // GET /api/v1/calendar/capacity
  http.get(`${BASE}/api/v1/calendar/capacity`, () =>
    ok({
      weeklyHours: 40,
      dailyCapacityHours: 8,
      deepWorkHours: 4,
    })
  ),

  // PUT /api/v1/calendar/capacity
  http.put(`${BASE}/api/v1/calendar/capacity`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return ok({
      weeklyHours: (body.weeklyHours as number) ?? 40,
      dailyCapacityHours: (body.dailyCapacityHours as number) ?? 8,
      deepWorkHours: (body.deepWorkHours as number) ?? 4,
    })
  }),

  // GET /api/v1/calendar/schedule
  http.get(`${BASE}/api/v1/calendar/schedule`, () =>
    ok({
      workDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      workStartHour: 9,
      workEndHour: 17,
    })
  ),

  // PUT /api/v1/calendar/schedule
  http.put(`${BASE}/api/v1/calendar/schedule`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return ok({
      workDays: (body.workDays as string[]) ?? ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      workStartHour: (body.workStartHour as number) ?? 9,
      workEndHour: (body.workEndHour as number) ?? 17,
    })
  }),

  // GET /api/v1/calendar/energy
  http.get(`${BASE}/api/v1/calendar/energy`, () =>
    ok({ id: 'energy-1', date: '2024-06-15', energyLevel: 7, note: null })
  ),

  // GET /api/v1/calendar/energy/history
  http.get(`${BASE}/api/v1/calendar/energy/history`, () =>
    ok([
      { id: 'energy-1', date: '2024-06-15', energyLevel: 7, note: null },
      { id: 'energy-2', date: '2024-06-14', energyLevel: 5, note: 'Tired' },
    ])
  ),

  // GET /api/v1/calendar/energy/export
  http.get(`${BASE}/api/v1/calendar/energy/export`, () =>
    ok({
      filename: 'energy-history.csv',
      csv: 'date,energyLevel,note\n2024-06-14,5,Tired\n2024-06-15,7,\n',
    })
  ),

  // POST /api/v1/calendar/energy
  http.post(`${BASE}/api/v1/calendar/energy`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return ok({
      id: 'energy-new',
      date: body.date ?? '2024-06-15',
      energyLevel: body.energyLevel ?? 7,
      note: body.note ?? null,
    })
  }),

  // GET /api/v1/calendar/burnout-trends
  http.get(`${BASE}/api/v1/calendar/burnout-trends`, () =>
    ok([
      { weekStart: '2024-06-01', riskLevel: 'LOW', consecutiveHeavyDays: 0, avgDailyLoad: 0.6 },
      { weekStart: '2024-06-08', riskLevel: 'MODERATE', consecutiveHeavyDays: 1, avgDailyLoad: 0.9 },
    ])
  ),

  // GET /api/v1/calendar/recommendations
  http.get(`${BASE}/api/v1/calendar/recommendations`, () =>
    ok([
      { id: 'rec-1', type: 'BURNOUT_PREVENTION', message: 'Take a break', priority: 100, dismissed: false },
      { id: 'rec-2', type: 'FOCUS_SUGGESTION', message: 'Try a Pomodoro', priority: 60, dismissed: false },
    ])
  ),

  // PATCH /api/v1/calendar/recommendations/:id/dismiss
  http.patch(`${BASE}/api/v1/calendar/recommendations/:id/dismiss`, () =>
    ok({ dismissed: true })
  ),

  // POST /api/v1/calendar/recommendations/dismiss-all
  http.post(`${BASE}/api/v1/calendar/recommendations/dismiss-all`, () =>
    ok({ dismissedCount: 2 })
  ),
]
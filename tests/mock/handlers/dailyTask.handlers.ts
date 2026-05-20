// tests/mock/handlers/dailyTasks.handlers.ts
import { http, HttpResponse } from 'msw'
import type { Task } from '@/hooks/useTask'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const mockDailyTask: Task = {
  id: 'task-1',
  title: 'Primary Daily Task',
  description: 'Most important task for today',
  status: 'TODO',
  priority: 'HIGH',
  dueDate: null,
  createdBy: { id: 'user-1', name: 'Test User' },
  assignees: [{ user: { id: 'user-1', name: 'Test User' } }],
  project: {
    id: 'project-1',
    slug: 'test-project',
    name: 'Test Project',
    color: '#6366f1',
    workspace: { id: 'ws-1', name: 'Test Workspace' },
  },
  _count: { comments: 0, subtasks: 0, files: 0 },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

export const mockSecondaryTask: Task = {
  id: 'task-2',
  title: 'Secondary Daily Task',
  description: 'Secondary task for today',
  status: 'IN_PROGRESS',
  priority: 'MEDIUM',
  dueDate: null,
  createdBy: { id: 'user-1', name: 'Test User' },
  assignees: [],
  _count: { comments: 0, subtasks: 0, files: 0 },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

const ok = (data: unknown) => HttpResponse.json({ success: true, data })

export const dailyTaskHandlers = [
  http.get(`${BASE}/api/v1/daily-tasks`, () =>
    ok({
      primaryTask: mockDailyTask,
      secondaryTasks: [mockSecondaryTask],
    })
  ),

  http.post(`${BASE}/api/v1/daily-tasks`, async ({ request }) => {
    const body = await request.json() as { taskId: string; type: string }
    return ok({ taskId: body.taskId, type: body.type })
  }),

  http.delete(`${BASE}/api/v1/daily-tasks/:taskId`, () => ok(null)),
]

export const emptyDailyTaskHandlers = [
  http.get(`${BASE}/api/v1/daily-tasks`, () =>
    ok({ primaryTask: null, secondaryTasks: [] })
  ),
]
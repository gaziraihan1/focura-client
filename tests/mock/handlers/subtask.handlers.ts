// tests/mock/handlers/subtask.handlers.ts
import { http, HttpResponse } from 'msw'
import type { Subtask, SubtaskStats } from '@/types/subtasks.types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const mockSubtaskUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@focura.com',
  image: null,
}

export const mockSubtask: Subtask = {
  id: 'subtask-1',
  title: 'Test Subtask',
  description: null,
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: null,
  estimatedHours: null,
  depth: 1,
  parentId: 'task-1',
  createdById: 'user-1',
  workspaceId: 'ws-1',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  createdBy: mockSubtaskUser,
  assignees: [{ user: mockSubtaskUser }],
  _count: { comments: 0, files: 0 },
}

export const mockSubtaskStats: SubtaskStats = {
  total: 3,
  completed: 1,
  inProgress: 1,
  todo: 1,
  completionRate: 33,
}

const ok = (data: unknown) => HttpResponse.json({ success: true, data })

export const subtaskHandlers = [
  // List subtasks
  http.get(`${BASE}/api/tasks/:parentTaskId/subtasks`, ({ params }) => {
    if (params.parentTaskId === 'empty-task') return ok([])
    return ok([mockSubtask])
  }),

  // Subtask stats
  http.get(`${BASE}/api/tasks/:parentTaskId/subtasks/stats`, () =>
    ok(mockSubtaskStats)
  ),

  // Create subtask
  http.post(`${BASE}/api/tasks/:parentTaskId/subtasks`, async ({ request, params }) => {
    const body = await request.json() as Partial<Subtask>
    return ok({
      ...mockSubtask,
      ...body,
      id: 'subtask-new',
      parentId: params.parentTaskId as string,
    })
  }),

  // Update subtask
  http.put(`${BASE}/api/tasks/:parentTaskId/subtasks/:subtaskId`, async ({ request }) => {
    const body = await request.json() as Partial<Subtask>
    return ok({ ...mockSubtask, ...body })
  }),

  // Update subtask status
  http.patch(
    `${BASE}/api/tasks/:parentTaskId/subtasks/:subtaskId/status`,
    async ({ request }) => {
      const body = await request.json() as { status: string }
      return ok({ ...mockSubtask, status: body.status })
    }
  ),

  // Delete subtask
  http.delete(`${BASE}/api/tasks/:parentTaskId/subtasks/:subtaskId`, () =>
    ok(null)
  ),
]
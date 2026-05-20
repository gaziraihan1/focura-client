// tests/mock/handlers/task.handlers.ts
import { http, HttpResponse } from 'msw'
import type { Task, TaskStats, TasksResponse, PersonalQuotaInfo, WorkspaceQuotaInfo } from '@/hooks/useTask'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
  description: 'A test task',
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: null,
  startDate: undefined,
  estimatedHours: undefined,
  createdBy: { id: 'user-1', name: 'Test User' },
  assignees: [{ user: { id: 'user-1', name: 'Test User' } }],
  project: {
    id: 'project-1',
    slug: 'test-project',
    name: 'Test Project',
    color: '#000000',
    workspace: { id: 'ws-1', name: 'Test Workspace' },
  },
  _count: { comments: 0, subtasks: 0, files: 0 },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

export const mockTaskStats: TaskStats = {
  personal: 2,
  assigned: 3,
  created: 5,
  overdue: 1,
  dueToday: 2,
  byStatus: { TODO: 3, IN_PROGRESS: 1, COMPLETED: 1 },
  totalTasks: 5,
  inProgress: 1,
  completed: 1,
}

export const mockPersonalQuota: PersonalQuotaInfo = {
  plan: 'FREE',
  dailyLimit: 10,
  usedToday: 3,
  remaining: 7,
  resetAt: '2024-01-02T00:00:00.000Z',
  perMinuteLimit: null,
}

export const mockWorkspaceQuota: WorkspaceQuotaInfo = {
  plan: 'FREE',
  dailyWorkspaceLimit: 50,
  dailyPerMemberLimit: 10,
  workspaceUsedToday: 5,
  workspaceRemaining: 45,
  perMinuteLimit: null,
  isUnlimited: false,
  resetAt: '2024-01-02T00:00:00.000Z',
  members: [],
}

export const mockTasksResponse: TasksResponse = {
  data: [mockTask],
  pagination: {
    page: 1,
    pageSize: 10,
    totalCount: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
}

const ok = (data: unknown) => HttpResponse.json({ success: true, data })

export const taskHandlers = [
  // task.handlers.ts — fix the tasks list handler shape
http.get(`${BASE}/api/v1/tasks`, () =>
  HttpResponse.json({
    success: true,
    data: {
      data: [mockTask],               // ← nested exactly as hook expects
      pagination: {
        page: 1,
        pageSize: 10,
        totalCount: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
  })
),

  http.get(`${BASE}/api/v1/tasks/stats`, () => ok(mockTaskStats)),

  http.get(`${BASE}/api/v1/tasks/quota/personal`, () => ok(mockPersonalQuota)),

  http.get(`${BASE}/api/v1/tasks/quota/workspace/:workspaceId`, () => ok(mockWorkspaceQuota)),

  http.get(`${BASE}/api/v1/tasks/:taskId`, ({ params }) => {
    if (params.taskId === 'not-found') {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    }
    return ok(mockTask)
  }),

  http.post(`${BASE}/api/v1/tasks`, async ({ request }) => {
    const body = await request.json() as Partial<Task>
    return ok({ ...mockTask, ...body, id: 'task-new' })
  }),

  http.put(`${BASE}/api/v1/tasks/:taskId`, async ({ request }) => {
    const body = await request.json() as Partial<Task>
    return ok({ ...mockTask, ...body })
  }),

  http.patch(`${BASE}/api/v1/tasks/:taskId/status`, async ({ request }) => {
    const body = await request.json() as { status: Task['status'] }
    return ok({ ...mockTask, status: body.status })
  }),

  http.delete(`${BASE}/api/v1/tasks/:taskId`, () => ok(null)),

  http.get(`${BASE}/api/v1/tasks/:taskId/comments`, () => ok([])),

  http.post(`${BASE}/api/v1/tasks/:taskId/comments`, async ({ request }) => {
    const body = await request.json() as { content: string }
    return ok({ id: 'comment-1', content: body.content, taskId: 'task-1', createdAt: new Date().toISOString() })
  }),

  http.get(`${BASE}/api/v1/tasks/:taskId/activity`, () => ok([])),

  http.get(`${BASE}/api/v1/tasks/:taskId/attachments`, () => ok([])),

  http.delete(`${BASE}/api/v1/tasks/:taskId/attachments/:attachmentId`, () => ok(null)),
  // Add these to taskHandlers array in tests/mock/handlers/task.handlers.ts

http.put(`${BASE}/api/v1/tasks/:taskId/comments/:commentId`, async ({ request, params }) => {
  const body = await request.json() as { content: string }
  return ok({
    id: params.commentId as string,
    content: body.content,
    createdAt: '2024-01-01T00:00:00.000Z',
    user: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
    parentId: null,
    edited: true,
  })
}),

http.delete(`${BASE}/api/v1/tasks/:taskId/comments/:commentId`, () => ok(null)),
]
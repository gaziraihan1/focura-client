// tests/mock/handlers/label.handlers.ts
import { http, HttpResponse } from 'msw'
import type { Label, LabelWithTasks } from '@/hooks/useLabels'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ── Fixtures ──────────────────────────────────────────────────────────────────

export const mockLabel: Label = {
  id: 'label-1',
  name: 'Bug',
  color: '#ef4444',
  description: 'Something is broken',
  workspaceId: 'ws-1',
  createdById: 'user-1',
  workspace: { id: 'ws-1', name: 'Test Workspace', slug: 'test-workspace' },
  createdBy: { id: 'user-1', name: 'Test User', image: null },
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  _count: { tasks: 3 },
}

export const mockLabel2: Label = {
  id: 'label-2',
  name: 'Feature',
  color: '#3b82f6',
  description: 'New functionality',
  workspaceId: 'ws-1',
  createdById: 'user-1',
  workspace: { id: 'ws-1', name: 'Test Workspace', slug: 'test-workspace' },
  createdBy: { id: 'user-1', name: 'Test User', image: null },
  createdAt: new Date('2024-01-02T00:00:00.000Z'),
  _count: { tasks: 7 },
}

export const mockLabelWithTasks: LabelWithTasks = {
  ...mockLabel,
  tasks: [
    {
      task: {
        id: 'task-1',
        title: 'Fix login bug',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        workspace: { id: 'ws-1', name: 'Test Workspace', slug: 'test-workspace' },
        project: { id: 'proj-1', name: 'Test Project', slug: 'test-project' },
      },
    },
    {
      task: {
        id: 'task-2',
        title: 'Fix signup bug',
        status: 'TODO',
        priority: 'MEDIUM',
        workspace: { id: 'ws-1', name: 'Test Workspace', slug: 'test-workspace' },
        project: { id: 'proj-1', name: 'Test Project', slug: 'test-project' },
      },
    },
  ],
}

// ── Envelope helper ───────────────────────────────────────────────────────────
// All hooks read response.data (or response?.data), so wrap everything in { data }

const ok = (data: unknown) => HttpResponse.json({ data })

// ── Handlers ──────────────────────────────────────────────────────────────────

export const labelHandlers = [
  // GET /api/labels  (list, optional ?workspaceId)
  http.get(`${BASE}/api/labels`, ({ request }) => {
    const url = new URL(request.url)
    const workspaceId = url.searchParams.get('workspaceId')

    const labels = workspaceId
      ? [mockLabel, mockLabel2].filter((l) => l.workspaceId === workspaceId)
      : [mockLabel, mockLabel2]

    return ok(labels)
  }),

  // GET /api/labels/popular  — must be before /:id wildcard
  http.get(`${BASE}/api/labels/popular`, () =>
    ok([mockLabel2, mockLabel]) // sorted by task count desc
  ),

  // GET /api/labels/:id
  http.get(`${BASE}/api/labels/:id`, ({ params }) => {
    if (params.id === 'not-found') {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    return ok(mockLabelWithTasks)
  }),

  // POST /api/labels  (create)
  http.post(`${BASE}/api/labels`, async ({ request }) => {
    const body = await request.json() as {
      name: string
      color: string
      description?: string
      workspaceId?: string
    }
    const created: Label = {
      id: 'label-new',
      name: body.name,
      color: body.color,
      description: body.description ?? null,
      workspaceId: body.workspaceId ?? 'ws-1',
      createdById: 'user-1',
      workspace: { id: 'ws-1', name: 'Test Workspace', slug: 'test-workspace' },
      createdBy: { id: 'user-1', name: 'Test User', image: null },
      createdAt: new Date(),
      _count: { tasks: 0 },
    }
    return ok(created)
  }),

  // PATCH /api/labels/:id  (update)
  http.patch(`${BASE}/api/labels/:id`, async ({ params, request }) => {
    const body = await request.json() as { name?: string; color?: string; description?: string | null }
    const updated: Label = {
      ...mockLabel,
      id: params.id as string,
      ...body,
    }
    return ok(updated)
  }),

  // DELETE /api/labels/:id
  http.delete(`${BASE}/api/labels/:id`, ({ params }) => {
    if (params.id === 'not-found') {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    return ok({ message: 'Label deleted successfully', tasksAffected: 3 })
  }),

  // POST /api/labels/:labelId/tasks/:taskId  (add label to task)
  http.post(`${BASE}/api/labels/:labelId/tasks/:taskId`, () =>
    ok({ success: true })
  ),

  // DELETE /api/labels/:labelId/tasks/:taskId  (remove label from task)
  http.delete(`${BASE}/api/labels/:labelId/tasks/:taskId`, () =>
    ok({ success: true })
  ),
]
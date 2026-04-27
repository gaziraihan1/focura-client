// tests/mock/handlers/activity.handlers.ts
import { http, HttpResponse } from 'msw'
import type { Activity, ActivityStats } from '@/hooks/useActivity'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const mockActivity: Activity = {
  id: 'activity-1',
  action: 'CREATED',
  entityType: 'TASK',
  entityId: 'task-1',
  userId: 'user-1',
  workspaceId: 'ws-1',
  taskId: 'task-1',
  metadata: { type: 'PROJECT', projectName: 'Test Project' },
  createdAt: '2024-01-01T00:00:00.000Z',
  user: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
  workspace: { id: 'ws-1', name: 'Test Workspace' },
  task: {
    id: 'task-1',
    title: 'Test Task',
    status: 'TODO',
    priority: 'MEDIUM',
    project: { id: 'project-1', name: 'Test Project', color: '#6366f1' },
  },
}

export const mockActivity2: Activity = {
  id: 'activity-2',
  action: 'STATUS_CHANGED',
  entityType: 'TASK',
  entityId: 'task-1',
  userId: 'user-1',
  workspaceId: 'ws-1',
  taskId: 'task-1',
  metadata: { from: 'TODO', to: 'IN_PROGRESS' },
  createdAt: '2024-01-02T00:00:00.000Z',
  user: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
  workspace: { id: 'ws-1', name: 'Test Workspace' },
  task: {
    id: 'task-1',
    title: 'Test Task',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
  },
}

export const mockActivityStats: ActivityStats = {
  total: 42,
  today: 8,
  byAction: {
    CREATED: 10,
    UPDATED: 15,
    STATUS_CHANGED: 8,
    COMMENTED: 9,
    DELETED: 0,
    COMPLETED: 0,
    ASSIGNED: 0,
    UNASSIGNED: 0,
    UPLOADED: 0,
    MOVED: 0,
    PRIORITY_CHANGED: 0
  },
}

const ok = (data: unknown) => HttpResponse.json({ success: true, data })

export const activityHandlers = [
  // General activities list
  http.get(`${BASE}/api/activities`, () =>
    ok([mockActivity, mockActivity2])
  ),

  // Workspace activities
  http.get(`${BASE}/api/activities/workspace/:workspaceId`, () =>
    ok([mockActivity, mockActivity2])
  ),

  // Task activities
  http.get(`${BASE}/api/activities/task/:taskId`, () =>
    ok([mockActivity, mockActivity2])
  ),

  // Activity stats
  http.get(`${BASE}/api/activities/stats`, () =>
    ok(mockActivityStats)
  ),

  // Delete activity
  http.delete(`${BASE}/api/activities/:activityId`, () => ok(null)),

  // Clear activities
  http.delete(`${BASE}/api/activities/clear/all`, () =>
    ok({ cleared: true })
  ),
]
// tests/mock/handlers/workspace.handlers.ts
import { http, HttpResponse } from 'msw'
import type { Workspace, WorkspaceMember, WorkspaceStats, WorkspaceStorageInfo } from '@/hooks/useWorkspace'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000' || process.env.BACKEND_URL;

export const mockMember: WorkspaceMember = {
  id: 'member-1',
  role: 'OWNER',
  joinedAt: '2024-01-01T00:00:00.000Z',
  userId: 'user-1',
  user: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
}

export const mockWorkspace: Workspace = {
  id: 'ws-1',
  name: 'Test Workspace',
  slug: 'test-ws',
  description: 'A test workspace',
  isPublic: false,
  allowInvites: true,
  plan: 'FREE',
  maxMembers: 5,
  maxStorage: 1000,
  ownerId: 'user-1',
  owner: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
  members: [mockMember],
  _count: { projects: 2, members: 1 },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

export const mockStats: WorkspaceStats = {
  totalProjects: 2,
  totalTasks: 10,
  totalMembers: 1,
  completedTasks: 4,
  overdueTasks: 1,
  completionRate: 40,
}

export const mockStorage: WorkspaceStorageInfo = {
  plan: 'FREE',
  usedBytes: 500,
  maxBytes: 1000,
  remainingBytes: 500,
  usedPct: 50,
  usedFormatted: '500 B',
  maxFormatted: '1 KB',
  isNearLimit: false,
  isFull: false,
  limits: { maxFileSizeMB: 10, maxDailyUploads: 20, uploadsPerMinute: 5, uploadsPerHour: 50 },
}

// ── Wrap every response in { success, data } to match ApiResponse<T> ──────────
const ok = (data: unknown) => HttpResponse.json({ success: true, data })

export const workspaceHandlers = [
  http.get(`${BASE}/api/workspaces`,              () => ok([mockWorkspace])),
  
  http.get(`${BASE}/api/workspaces/:slugOrId`,    () => ok(mockWorkspace)),
  http.post(`${BASE}/api/workspaces`,             async ({ request }) => {
    const body = await request.json() as Partial<Workspace>
    return ok({ ...mockWorkspace, ...body, id: 'ws-new' })
  }),
  http.put(`${BASE}/api/workspaces/:id`,          async ({ request }) => {
    const body = await request.json() as Partial<Workspace>
    return ok({ ...mockWorkspace, ...body })
  }),
  http.delete(`${BASE}/api/workspaces/:id`,       () => ok(null)),
  http.get(`${BASE}/api/workspaces/:id/members`,  () => ok([mockMember])),
  http.post(`${BASE}/api/workspaces/:id/invite`,  () => ok({ success: true })),
  http.delete(`${BASE}/api/workspaces/:id/members/:memberId`, () => ok(null)),
  http.put(`${BASE}/api/workspaces/:id/members/:memberId/role`, async ({ request }) => {
    const body = await request.json() as { role: string }
    return ok({ ...mockMember, role: body.role })
  }),
  http.get(`${BASE}/api/workspaces/:id/stats`,   () => ok(mockStats)),
  http.get(`${BASE}/api/workspaces/:id/storage`,  () => ok(mockStorage)),
  http.post(`${BASE}/api/workspaces/invitations/:token/accept`, () => ok(mockWorkspace)),
  http.post(`${BASE}/api/workspaces/:id/leave`,   () => ok({ success: true })),
]
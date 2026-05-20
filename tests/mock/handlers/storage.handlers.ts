// tests/mock/handlers/storage.handlers.ts
import { http, HttpResponse } from 'msw'
import type {
  StorageInfo,
  WorkspaceSummary,
  WorkspaceStorageOverview,
  MyContribution,
  UserContribution,
  LargestFile,
} from '@/hooks/useStorage'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const mockStorageInfo: StorageInfo = {
  usedMB: 250,
  totalMB: 1000,
  remainingMB: 750,
  percentage: 25,
  plan: 'FREE',
  workspaceId: 'ws-1',
  workspaceName: 'Test Workspace',
}

export const mockMyContribution: MyContribution = {
  usageMB: 50,
  fileCount: 10,
  percentage: 20,
}

export const mockUserContribution: UserContribution = {
  userId: 'user-1',
  userName: 'Test User',
  userEmail: 'test@focura.com',
  usageMB: 50,
  fileCount: 10,
  percentage: 20,
}

export const mockLargestFile: LargestFile = {
  id: 'file-1',
  name: 'large-file.pdf',
  originalName: 'large-file.pdf',
  size: 10485760,
  sizeMB: 10,
  mimeType: 'application/pdf',
  url: 'https://cdn.focura.com/file-1.pdf',
  uploadedAt: new Date('2024-01-01'),
  uploadedBy: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
  task: { id: 'task-1', title: 'Test Task' },
  project: { id: 'project-1', name: 'Test Project' },
}

export const mockWorkspaceSummary: WorkspaceSummary = {
  workspaceId: 'ws-1',
  workspaceName: 'Test Workspace',
  plan: 'FREE',
  usageMB: 250,
  totalMB: 1000,
  remainingMB: 750,
  percentage: 25,
  role: 'OWNER',
  fileCount: 42,
}

export const mockStorageOverview: WorkspaceStorageOverview = {
  storageInfo: mockStorageInfo,
  breakdown: {
    attachments: 100,
    workspaceFiles: 80,
    projectFiles: 70,
    total: 250,
  },
  largestFiles: [mockLargestFile],
  trend: [
    { date: new Date('2024-01-01'), usageMB: 200 },
    { date: new Date('2024-01-02'), usageMB: 250 },
  ],
  fileTypes: [
    { mimeType: 'application/pdf', category: 'document', count: 5, sizeMB: 50 },
    { mimeType: 'image/png', category: 'image', count: 10, sizeMB: 30 },
  ],
  myContribution: mockMyContribution,
  userContributions: [mockUserContribution],
  isAdmin: true,
}

const ok = (data: unknown) => HttpResponse.json({ success: true, data })

export const storageHandlers = [
  // Workspaces summary
  http.get(`${BASE}/api/v1/storage/workspaces`, () =>
    ok([mockWorkspaceSummary])
  ),

  // Workspace overview
  http.get(`${BASE}/api/v1/storage/:workspaceId/overview`, () =>
    ok(mockStorageOverview)
  ),

  // Workspace info
  http.get(`${BASE}/api/v1/storage/:workspaceId/info`, () =>
    ok(mockStorageInfo)
  ),

  // My contribution
  http.get(`${BASE}/api/v1/storage/:workspaceId/my-contribution`, () =>
    ok(mockMyContribution)
  ),

  // User contributions
  http.get(`${BASE}/api/v1/storage/:workspaceId/user-contributions`, () =>
    ok([mockUserContribution])
  ),

  // Largest files
  http.get(`${BASE}/api/v1/storage/:workspaceId/largest-files`, () =>
    ok([mockLargestFile])
  ),

  // Bulk delete
  http.post(`${BASE}/api/v1/storage/:workspaceId/bulk-delete`, async ({ request }) => {
    const body = await request.json() as { fileIds: string[] }
    return ok({ deletedCount: body.fileIds.length, freedMB: body.fileIds.length * 10 })
  }),

  // Check upload
  http.post(`${BASE}/api/v1/storage/:workspaceId/check-upload`, async ({ request }) => {
    const body = await request.json() as { fileSize: number }
    const allowed = body.fileSize < 50 * 1024 * 1024
    return ok({ allowed, reason: allowed ? undefined : 'File too large' })
  }),

  // Delete single file — must come AFTER /workspaces and /:workspaceId routes
  http.delete(`${BASE}/api/v1/storage/files/:fileId`, () =>
    ok({ freedMB: 10 })
  ),
]
// tests/mock/handlers/admin.handlers.ts
import { http, HttpResponse } from 'msw'
import type {
  AdminStats,
  AdminWorkspace,
  AdminWorkspaceDetail,
  AdminUser,
  AdminUserDetail,
  AdminProject,
  AdminBilling,
  AdminActivity,
  AdminPaginatedResponse,
} from '@/types/admin.types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ── Fixtures ──────────────────────────────────────────────────────────────────

export const mockAdminStats: AdminStats = {
  totals: {
    users: 42,
    workspaces: 10,
    projects: 25,
    tasks: 300,
    announcements: 5,
    meetings: 18,
  },
  plans: [
    { plan: 'FREE', count: 7 },
    { plan: 'PRO', count: 3 },
  ],
  featureRequests: {
    pending: 4,
    approved: 2,
    planned: 1,
    completed: 3,
    rejected: 1,
  },
  totalStorageUsedMb: 512,
  recentSignups: [
    {
      id: 'user-1',
      name: 'Test User',
      email: 'test@focura.com',
      image: null,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  ],
  recentWorkspaces: [
    {
      id: 'ws-1',
      name: 'Test Workspace',
      slug: 'test-ws',
      plan: 'FREE',
      createdAt: '2024-01-01T00:00:00.000Z',
      owner: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
      _count: { members: 3, projects: 2 },
    },
  ],
}

export const mockAdminWorkspace: AdminWorkspace = {
  id: 'ws-1',
  name: 'Test Workspace',
  slug: 'test-ws',
  plan: 'FREE',
  createdAt: '2024-01-01T00:00:00.000Z',
  maxMembers: 5,
  maxStorageMb: 1024,
  usedStorageMb: 128,
  owner: { id: 'user-1', name: 'Test User', email: 'test@focura.com', image: null },
  subscription: null,
  _count: { members: 3, projects: 2, tasks: 15 },
}

export const mockAdminWorkspaceDetail: AdminWorkspaceDetail = {
  id: 'ws-1',
  name: 'Test Workspace',
  slug: 'test-ws',
  plan: 'FREE',
  deletedAt: null,
  deletedById: null,
  deleteReason: null,
  description: 'A test workspace',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  maxMembers: 5,
  maxStorageMb: 1024,
  usedStorageMb: 128,
  owner: { id: 'user-1', name: 'Test User', email: 'test@focura.com', image: null },
  subscription: null,
  members: [
    {
      id: 'member-1',
      role: 'OWNER',
      joinedAt: '2024-01-01T00:00:00.000Z',
      user: { id: 'user-1', name: 'Test User', email: 'test@focura.com', image: null },
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Test Project',
      slug: 'test-proj',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      createdAt: '2024-01-01T00:00:00.000Z',
      createdBy: { id: 'user-1', name: 'Test User' },
      _count: { tasks: 10, members: 2 },
    },
  ],
  _count: { members: 3, projects: 2, tasks: 15, meetings: 4, announcements: 1 },
}

export const mockAdminUser: AdminUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@focura.com',
  image: null,
  role: 'USER',
  createdAt: '2024-01-01T00:00:00.000Z',
  lastLoginAt: '2024-06-01T00:00:00.000Z',
  _count: {
    ownedWorkspaces: 1,
    workspaceMember: 2,
    createdTasks: 10,
    comments: 5,
    focusSessions: 3,
    featureRequests: 1,
  },
}

export const mockAdminUserDetail: AdminUserDetail = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@focura.com',
  image: null,
  bannedAt: null,
  banReason: null,
  bannedById: null,
  role: 'USER',
  bio: null,
  timezone: 'UTC',
  createdAt: '2024-01-01T00:00:00.000Z',
  lastLoginAt: '2024-06-01T00:00:00.000Z',
  lastProfileUpdateAt: null,
  ownedWorkspaces: [
    {
      id: 'ws-1',
      name: 'Test Workspace',
      slug: 'test-ws',
      plan: 'FREE',
      _count: { members: 3, projects: 2 },
    },
  ],
  workspaceMemberships: [
    {
      role: 'OWNER',
      joinedAt: '2024-01-01T00:00:00.000Z',
      workspace: { id: 'ws-1', name: 'Test Workspace', slug: 'test-ws', plan: 'FREE' },
    },
  ],
  projectMemberships: [],
  recentTasks: [
    {
      id: 'task-1',
      title: 'Fix bug',
      status: 'TODO',
      priority: 'HIGH',
      createdAt: '2024-01-01T00:00:00.000Z',
      project: { id: 'proj-1', name: 'Test Project' },
      workspace: { id: 'ws-1', name: 'Test Workspace' },
    },
  ],
  featureRequests: [
    { id: 'feature-1', title: 'Dark Mode', status: 'PENDING', createdAt: '2024-01-01T00:00:00.000Z' },
  ],
  taskStats: { total: 10, todo: 4, inProgress: 3, completed: 2, cancelled: 1 },
  storage: { usedMb: 64, fileCount: 12 },
  _count: {
    ownedWorkspaces: 1,
    workspaceMember: 2,
    createdTasks: 10,
    assignedTasks: 5,
    comments: 5,
    focusSessions: 3,
    featureRequests: 1,
    files: 12,
  },
}

export const mockAdminProject: AdminProject = {
  id: 'proj-1',
  name: 'Test Project',
  slug: 'test-proj',
  status: 'ACTIVE',
  priority: 'MEDIUM',
  createdAt: '2024-01-01T00:00:00.000Z',
  dueDate: null,
  completedAt: null,
  workspace: { id: 'ws-1', name: 'Test Workspace', slug: 'test-ws' },
  createdBy: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
  manager: null,
  taskBreakdown: { total: 10, todo: 4, inProgress: 3, completed: 2, cancelled: 1 },
  _count: { tasks: 10, members: 3, files: 2 },
}

export const mockAdminBilling: AdminBilling = {
  subscriptionId: 'sub-1',
  stripeSubscriptionId: 'stripe-sub-1',
  stripeCustomerId: 'stripe-cust-1',
  status: 'ACTIVE',
  billingCycle: 'MONTHLY',
  currentPeriodStart: '2024-01-01T00:00:00.000Z',
  currentPeriodEnd: '2024-02-01T00:00:00.000Z',
  cancelAtPeriodEnd: false,
  canceledAt: null,
  plan: {
    id: 'plan-1',
    name: 'PRO',
    displayName: 'Pro Plan',
    monthlyPriceCents: 1999,
    yearlyPriceCents: 19990,
  },
  workspace: {
    id: 'ws-1',
    name: 'Test Workspace',
    slug: 'test-ws',
    plan: 'PRO',
    owner: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
  },
  recentInvoices: [
    {
      id: 'inv-1',
      amountPaid: 1999,
      currency: 'usd',
      status: 'paid',
      paidAt: '2024-01-01T00:00:00.000Z',
      invoicePdf: null,
    },
  ],
}

export const mockAdminActivity: AdminActivity = {
  id: 'activity-1',
  action: 'TASK_CREATED',
  entityType: 'Task',
  entityId: 'task-1',
  createdAt: '2024-01-01T00:00:00.000Z',
  metadata: {},
  user: { id: 'user-1', name: 'Test User', email: 'test@focura.com', image: null },
  workspace: { id: 'ws-1', name: 'Test Workspace', slug: 'test-ws' },
}

// ── Shared pagination helper ──────────────────────────────────────────────────

function paginatedResponse<T>(items: T[]): AdminPaginatedResponse<T> {
  return {
    data: items,
    pagination: {
      page: 1,
      pageSize: 20,
      totalCount: items.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  }
}

const ok = (data: unknown) => HttpResponse.json({ success: true, data })
const okMessage = (message = 'Success') =>
  HttpResponse.json({ success: true, message })

// ── Handlers ──────────────────────────────────────────────────────────────────

export const adminHandlers = [
  // GET /api/v1/admin/stats  → res.data
  http.get(`${BASE}/api/v1/admin/stats`, () =>
    ok(mockAdminStats)
  ),

  // GET /api/v1/admin/workspaces  → flat AdminPaginatedResponse
  http.get(`${BASE}/api/v1/admin/workspaces`, () =>
    HttpResponse.json(paginatedResponse([mockAdminWorkspace]))
  ),

  // GET /api/v1/admin/workspaces/:slug  → res.data
  http.get(`${BASE}/api/v1/admin/workspaces/:slug`, ({ params }) => {
    if (params.slug === 'not-found') {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    }
    return ok(mockAdminWorkspaceDetail)
  }),

  // POST /api/v1/admin/workspaces/:slug/delete  → { success, message }
  http.post(`${BASE}/api/v1/admin/workspaces/:slug/delete`, () =>
    okMessage('Workspace deleted successfully')
  ),

  // PATCH /api/v1/admin/workspaces/:slug/restore  → { success, message }
  http.patch(`${BASE}/api/v1/admin/workspaces/:slug/restore`, () =>
    okMessage('Workspace restored successfully')
  ),

  // GET /api/v1/admin/users  → flat AdminPaginatedResponse
  http.get(`${BASE}/api/v1/admin/users`, () =>
    HttpResponse.json(paginatedResponse([mockAdminUser]))
  ),

  // GET /api/v1/admin/users/:id  → res.data
  http.get(`${BASE}/api/v1/admin/users/:id`, ({ params }) => {
    if (params.id === 'not-found') {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    }
    return ok(mockAdminUserDetail)
  }),

  // PATCH /api/v1/admin/users/:id/ban  → { success, message }
  http.patch(`${BASE}/api/v1/admin/users/:id/ban`, () =>
    okMessage('User banned successfully')
  ),

  // PATCH /api/v1/admin/users/:id/unban  → { success, message }
  http.patch(`${BASE}/api/v1/admin/users/:id/unban`, () =>
    okMessage('User unbanned successfully')
  ),

  // GET /api/v1/admin/projects  → flat AdminPaginatedResponse
  http.get(`${BASE}/api/v1/admin/projects`, () =>
    HttpResponse.json(paginatedResponse([mockAdminProject]))
  ),

  // GET /api/v1/admin/billing  → flat AdminPaginatedResponse
  http.get(`${BASE}/api/v1/admin/billing`, () =>
    HttpResponse.json(paginatedResponse([mockAdminBilling]))
  ),

  // GET /api/v1/admin/activity  → flat AdminPaginatedResponse
  http.get(`${BASE}/api/v1/admin/activity`, () =>
    HttpResponse.json(paginatedResponse([mockAdminActivity]))
  ),
]
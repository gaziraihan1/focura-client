// tests/mock/handlers/project.handlers.ts
import { http, HttpResponse } from 'msw'
import type { ProjectDetails, ProjectMember } from '@/hooks/useProjects'
import type { Announcement } from '@/types/announcement.types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const mockProjectMember: ProjectMember = {
  id: 'pm-1',
  userId: 'user-1',
  role: 'MANAGER',
  joinedAt: '2024-01-01T00:00:00.000Z',
  user: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
}

export const mockAnnouncement: Announcement = {
  id: 'ann-1',
  title: 'Project Kickoff',
  content: 'Welcome to the project!',
  visibility: 'PUBLIC',
  isPinned: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  workspaceId: 'ws-1',
  projectId: 'project-1',
  project: null,
  createdById: 'user-1',
  createdBy: { id: 'user-1', name: 'Test User', image: null },
  targets: [],
}

export const mockProjectDetails: ProjectDetails = {
  id: 'project-1',
  slug: 'test-project',
  name: 'Test Project',
  description: 'A test project',
  color: '#6366f1',
  icon: undefined,
  status: 'ACTIVE',
  priority: 'MEDIUM',
  startDate: '2024-01-01T00:00:00.000Z',
  dueDate: '2024-12-31T00:00:00.000Z',
  createdAt: '2024-01-01T00:00:00.000Z',
  workspace: {
    id: 'ws-1',
    name: 'Test Workspace',
    slug: 'test-ws',
    ownerId: 'user-1',
  },
  members: [mockProjectMember],
  tasks: [],
  announcement: [mockAnnouncement],
  stats: {
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    totalMembers: 1,
    projectDays: 10,
    totalAnnouncement: 1,
    inProgressTasks: 2
  },
  isAdmin: true,
  workspaceId: 'ws-1',
  _count: { tasks: 0, members: 1, announcement: 1 },
}

const ok = (data: unknown) => HttpResponse.json({ success: true, data })

export const projectHandlers = [
  // ── Project CRUD ────────────────────────────────────────────────────────────

  http.get(`${BASE}/api/v1/projects/workspace/:workspaceId`, () =>
    ok([mockProjectDetails])
  ),

  http.get(`${BASE}/api/v1/projects/user/all`, () =>
    ok([mockProjectDetails])
  ),

  http.get(`${BASE}/api/v1/projects/slug/:slug`, ({ params }) => {
    if (params.slug === 'not-found') {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    }
    return ok(mockProjectDetails)
  }),

  http.get(`${BASE}/api/v1/projects/:projectId`, ({ params }) => {
    if (params.projectId === 'not-found') {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    }
    return ok(mockProjectDetails)
  }),

  http.post(`${BASE}/api/v1/projects`, async ({ request }) => {
    const body = await request.json() as Partial<ProjectDetails>
    return ok({ ...mockProjectDetails, ...body, id: 'project-new' })
  }),

  http.patch(`${BASE}/api/v1/projects/:projectId`, async ({ request }) => {
    const body = await request.json() as Partial<ProjectDetails>
    return ok({ ...mockProjectDetails, ...body })
  }),

  http.delete(`${BASE}/api/v1/projects/:projectId`, () => ok(null)),

  // ── Members ─────────────────────────────────────────────────────────────────

  http.post(`${BASE}/api/v1/projects/:projectId/members`, async ({ request }) => {
    const body = await request.json() as { userId: string; role: string }
    return ok({
      ...mockProjectMember,
      userId: body.userId,
      role: body.role ?? 'COLLABORATOR',
      id: 'pm-new',
    })
  }),

  http.patch(`${BASE}/api/v1/projects/:projectId/members/:memberId`, async ({ request }) => {
    const body = await request.json() as { role: string }
    return ok({ ...mockProjectMember, role: body.role })
  }),

  http.delete(`${BASE}/api/v1/projects/:projectId/members/:memberId`, () => ok(null)),

  // ── Sections ────────────────────────────────────────────────────────────────

  http.get(`${BASE}/api/v1/projects/:projectId/sections`, () =>
    ok([
      { id: 's1', name: 'Backlog', color: '#94a3b8', position: 0, taskStatus: 'TODO', wipLimit: 20, projectId: 'project-1', _count: { tasks: 3 } },
      { id: 's2', name: 'In Progress', color: '#3b82f6', position: 1, taskStatus: 'IN_PROGRESS', wipLimit: 3, projectId: 'project-1', _count: { tasks: 1 } },
    ])
  ),

  http.post(`${BASE}/api/v1/projects/:projectId/sections`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return ok({ id: 's-new', projectId: 'project-1', position: 2, ...body })
  }),

  http.patch(`${BASE}/api/v1/projects/:projectId/sections/:sectionId`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return ok({ id: 's1', projectId: 'project-1', ...body })
  }),

  http.delete(`${BASE}/api/v1/projects/:projectId/sections/:sectionId`, () => ok(null)),

  http.put(`${BASE}/api/v1/projects/:projectId/sections/reorder`, () =>
    ok(null)
  ),

  // ── Sprints ─────────────────────────────────────────────────────────────────

  http.get(`${BASE}/api/v1/projects/:projectId/sprints`, () =>
    ok({
      sprints: [
        { id: 'sp-1', name: 'Sprint 1', status: 'COMPLETED', startDate: '2024-01-01', endDate: '2024-01-14', totalPoints: 20, completedPoints: 18, velocity: 18, projectId: 'project-1', _count: { tasks: 5 } },
        { id: 'sp-2', name: 'Sprint 2', status: 'ACTIVE', startDate: '2024-01-15', endDate: '2024-01-28', totalPoints: 25, completedPoints: 10, projectId: 'project-1', _count: { tasks: 8 } },
      ],
      activeSprint: { id: 'sp-2', name: 'Sprint 2', status: 'ACTIVE', startDate: '2024-01-15', endDate: '2024-01-28', totalPoints: 25, completedPoints: 10, projectId: 'project-1', _count: { tasks: 8 } },
      avgVelocity: 18,
    })
  ),

  http.get(`${BASE}/api/v1/projects/:projectId/sprints/active`, () =>
    ok({ id: 'sp-2', name: 'Sprint 2', status: 'ACTIVE', startDate: '2024-01-15', endDate: '2024-01-28', projectId: 'project-1' })
  ),

  http.post(`${BASE}/api/v1/projects/:projectId/sprints`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return ok({ id: 'sp-new', status: 'PLANNING', projectId: 'project-1', ...body })
  }),

  http.patch(`${BASE}/api/v1/projects/:projectId/sprints/:sprintId`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return ok({ id: 'sp-1', projectId: 'project-1', ...body })
  }),

  http.delete(`${BASE}/api/v1/projects/:projectId/sprints/:sprintId`, () => ok(null)),

  http.post(`${BASE}/api/v1/projects/:projectId/sprints/:sprintId/complete`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return ok({ id: 'sp-1', status: 'COMPLETED', projectId: 'project-1', ...body })
  }),

  // ── Milestones ──────────────────────────────────────────────────────────────

  http.get(`${BASE}/api/v1/projects/:projectId/milestones`, () =>
    ok({
      total: 2,
      completed: 1,
      atRisk: 0,
      delayed: 0,
      onTrack: 1,
      avgProgress: 50,
      milestones: [
        { id: 'm1', title: 'Beta Release', status: 'ON_TRACK', progress: 75, projectId: 'project-1', completed: false, tasksDone: 3, taskProgress: 75 },
        { id: 'm2', title: 'Launch', status: 'COMPLETED', progress: 100, projectId: 'project-1', completed: true, tasksDone: 5, taskProgress: 100 },
      ],
    })
  ),

  http.post(`${BASE}/api/v1/projects/:projectId/milestones`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return ok({ id: 'm-new', status: 'ON_TRACK', progress: 0, completed: false, projectId: 'project-1', ...body })
  }),

  http.patch(`${BASE}/api/v1/projects/:projectId/milestones/:milestoneId`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return ok({ id: 'm1', projectId: 'project-1', ...body })
  }),

  http.delete(`${BASE}/api/v1/projects/:projectId/milestones/:milestoneId`, () => ok(null)),

  http.put(`${BASE}/api/v1/projects/:projectId/milestones/:milestoneId/progress`, async ({ request }) => {
    const body = await request.json() as { progress: number }
    return ok({ id: 'm1', progress: body.progress, projectId: 'project-1' })
  }),

  // ── Views ───────────────────────────────────────────────────────────────────

  http.get(`${BASE}/api/v1/projects/:projectId/views`, () =>
    ok([
      { id: 'v1', name: 'Kanban', type: 'KANBAN', isDefault: true, visibility: 'SHARED', projectId: 'project-1', createdById: 'user-1' },
      { id: 'v2', name: 'My List', type: 'LIST', isDefault: false, visibility: 'PRIVATE', projectId: 'project-1', createdById: 'user-1' },
    ])
  ),

  http.post(`${BASE}/api/v1/projects/:projectId/views`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return ok({ id: 'v-new', isDefault: false, visibility: 'PRIVATE', projectId: 'project-1', createdById: 'user-1', ...body })
  }),

  http.patch(`${BASE}/api/v1/projects/:projectId/views/:viewId`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return ok({ id: 'v1', projectId: 'project-1', ...body })
  }),

  http.delete(`${BASE}/api/v1/projects/:projectId/views/:viewId`, () => ok(null)),

  // ── Favorites ───────────────────────────────────────────────────────────────

  http.get(`${BASE}/api/v1/projects/favorites/mine`, () =>
    ok({
      grouped: [],
      ungrouped: [
        { id: 'f1', projectId: 'project-1', sortOrder: 0, createdAt: '2024-01-01T00:00:00.000Z', project: { id: 'project-1', name: 'Test Project', slug: 'test-project', color: '#6366f1', status: 'ACTIVE', workspace: { slug: 'test-ws' } } },
      ],
    })
  ),

  http.get(`${BASE}/api/v1/projects/:projectId/favorite`, () =>
    ok({ favorited: true })
  ),

  http.post(`${BASE}/api/v1/projects/:projectId/favorite/toggle`, () =>
    ok({ favorited: false })
  ),

  http.put(`${BASE}/api/v1/projects/:projectId/favorite`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return ok({ id: 'f1', projectId: 'project-1', ...body })
  }),
]

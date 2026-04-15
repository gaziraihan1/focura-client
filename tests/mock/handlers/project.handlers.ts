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
  },
  isAdmin: true,
  workspaceId: 'ws-1',
  _count: { tasks: 0, members: 1, announcement: 1 },
}

const ok = (data: unknown) => HttpResponse.json({ success: true, data })

export const projectHandlers = [
  // List projects by workspace
  http.get(`${BASE}/api/projects/workspace/:workspaceId`, () =>
    ok([mockProjectDetails])
  ),

  // All user projects
  http.get(`${BASE}/api/projects/user/all`, () =>
    ok([mockProjectDetails])
  ),

  // Get project by slug
  http.get(`${BASE}/api/projects/slug/:slug`, ({ params }) => {
    if (params.slug === 'not-found') {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    }
    return ok(mockProjectDetails)
  }),

  // Get project by id
  http.get(`${BASE}/api/projects/:projectId`, ({ params }) => {
    if (params.projectId === 'not-found') {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    }
    return ok(mockProjectDetails)
  }),

  // Create project
  http.post(`${BASE}/api/projects`, async ({ request }) => {
    const body = await request.json() as Partial<ProjectDetails>
    return ok({ ...mockProjectDetails, ...body, id: 'project-new' })
  }),

  // Update project
  http.patch(`${BASE}/api/projects/:projectId`, async ({ request }) => {
    const body = await request.json() as Partial<ProjectDetails>
    return ok({ ...mockProjectDetails, ...body })
  }),

  // Delete project
  http.delete(`${BASE}/api/projects/:projectId`, () => ok(null)),

  // Add member
  http.post(`${BASE}/api/projects/:projectId/members`, async ({ request }) => {
    const body = await request.json() as { userId: string; role: string }
    return ok({
      ...mockProjectMember,
      userId: body.userId,
      role: body.role ?? 'COLLABORATOR',
      id: 'pm-new',
    })
  }),

  // Update member role
  http.patch(`${BASE}/api/projects/:projectId/members/:memberId`, async ({ request }) => {
    const body = await request.json() as { role: string }
    return ok({ ...mockProjectMember, role: body.role })
  }),

  // Remove member
  http.delete(`${BASE}/api/projects/:projectId/members/:memberId`, () => ok(null)),
]
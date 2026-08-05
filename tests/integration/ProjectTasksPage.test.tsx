import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import type { Task } from '@/hooks/useTask'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'acme', projectSlug: 'web-app' }),
  useRouter: () => ({ back: vi.fn(), push: vi.fn(), replace: vi.fn() }),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: () => '/dashboard/workspaces/acme/projects/web-app/tasks',
}))

vi.mock('@/hooks/useProjects', () => ({
  useProjectDetailsBySlug: vi.fn(),
  useProjectRole: vi.fn(),
}))

vi.mock('@/hooks/useUser', () => ({
  useUserProfile: vi.fn(),
}))

vi.mock('@/hooks/useTask', () => ({
  useTasks: vi.fn(),
}))

vi.mock('@/hooks/useProjectFeatures', () => ({
  useProjectSections: vi.fn(),
  useProjectSprints: vi.fn(() => ({ data: { sprints: [] } })),
  useProjectMilestones: vi.fn(() => ({ data: { milestones: [] } })),
  useProjectViews: vi.fn(() => ({ data: [] })),
}))

import ProjectTasksPage from '@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/tasks/page'
import { useProjectDetailsBySlug, useProjectRole } from '@/hooks/useProjects'
import { useUserProfile } from '@/hooks/useUser'
import { useTasks } from '@/hooks/useTask'
import { useProjectSections } from '@/hooks/useProjectFeatures'
import { useSearchParams } from 'next/navigation'

const project = {
  id: 'proj1',
  name: 'Web App',
  color: '#667eea',
  slug: 'web-app',
  status: 'ACTIVE',
  workspaceId: 'ws1',
  isAdmin: true,
  members: [{ userId: 'u1', user: { id: 'u1', name: 'User' } }],
  workspace: { id: 'ws1', name: 'Acme', slug: 'acme' },
}

function makeTask(id: string, title: string, status: Task['status'] = 'TODO', sectionId?: string | null): Task {
  return {
    id,
    title,
    description: '',
    status,
    priority: 'MEDIUM',
    dueDate: null,
    sectionId: sectionId ?? null,
    createdBy: { id: 'u1', name: 'User' },
    assignees: [],
    project: { id: 'proj1', slug: 'web-app', name: 'Web App', color: '#667eea', workspace: { id: 'ws1', name: 'Acme' } },
    _count: { comments: 0, subtasks: 0, files: 0 },
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  }
}

function mockProjectAndTasks(tasks: Task[], sections: unknown[] = []) {
  ;(useProjectDetailsBySlug as any).mockReturnValue({ data: project, isLoading: false, error: null })
  ;(useProjectRole as any).mockReturnValue({ canCreateTasks: true })
  ;(useUserProfile as any).mockReturnValue({ userId: 'u1' })
  ;(useTasks as any).mockReturnValue({
    data: {
      data: tasks,
      pagination: {
        page: 1,
        pageSize: 100,
        totalCount: tasks.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
    isLoading: false,
  })
  ;(useProjectSections as any).mockReturnValue({ data: sections })
}

function renderPage(tasks: Task[], sections: unknown[] = []) {
  mockProjectAndTasks(tasks, sections)
  return render(<ProjectTasksPage />, { wrapper: createWrapper() })
}

// The "Showing X to Y of Z results" summary is split across <span> elements,
// so match it on the <p> node's normalized text content instead.
function expectShowing(from: number, to: number, total: number) {
  const expected = `Showing ${from} to ${to} of ${total} results`
  expect(
    screen.getByText((_, node) =>
      !!node &&
      node.tagName === 'P' &&
      (node.textContent ?? '').replace(/\s+/g, ' ').trim() === expected,
    ),
  ).toBeDefined()
}

describe('ProjectTasksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useSearchParams as any).mockReturnValue(new URLSearchParams())
  })

  it('renders the board with tasks grouped into workflow columns', () => {
    renderPage([
      makeTask('t1', 'Write docs', 'TODO'),
      makeTask('t2', 'Fix auth bug', 'IN_PROGRESS'),
      makeTask('t3', 'Design review', 'TODO'),
    ])

    expect(screen.getByText('Write docs')).toBeDefined()
    expect(screen.getByText('Fix auth bug')).toBeDefined()
    expect(screen.getByText('Design review')).toBeDefined()
    expect(screen.getByText('To Do')).toBeDefined()
    expect(screen.getByText('In Progress')).toBeDefined()
  })

  it('filters tasks by section (deep link ?section=<id>)', () => {
    const section = {
      id: 'sec-frontend',
      name: 'Frontend',
      color: '#667eea',
      status: 'ACTIVE',
      position: 0,
      projectId: 'proj1',
    }
    // Simulates opening the tasks page from the sections page "View tasks" link
    ;(useSearchParams as any).mockReturnValue(new URLSearchParams('section=sec-frontend'))
    renderPage([
      makeTask('t1', 'Build navbar', 'TODO', 'sec-frontend'),
      makeTask('t2', 'Write API docs', 'TODO', null),
    ], [section])

    expect(screen.getByText('Build navbar')).toBeDefined()
    expect(screen.queryByText('Write API docs')).toBeNull()
  })

  it('shows the section badge on tasks assigned to a section in both views', () => {
    const section = {
      id: 'sec-frontend',
      name: 'Frontend',
      color: '#667eea',
      status: 'ACTIVE',
      position: 0,
      projectId: 'proj1',
    }
    renderPage([makeTask('t1', 'Build navbar', 'TODO', 'sec-frontend')], [section])

    // Board view: the folder section is not a column, but the card shows the badge
    expect(screen.getByText('Build navbar')).toBeDefined()
    expect(screen.getByText('Frontend')).toBeDefined()

    // List view: the row shows the same badge
    fireEvent.click(screen.getByLabelText('list view'))
    expect(screen.getByText('Frontend')).toBeDefined()
  })

  it('paginates the list view when there are many tasks', async () => {
    const tasks = Array.from({ length: 20 }, (_, i) =>
      makeTask(`t${i + 1}`, `Bugfix ${String(i + 1).padStart(2, '0')}`, 'TODO'),
    )
    renderPage(tasks)

    fireEvent.click(screen.getByLabelText('list view'))

    expectShowing(1, 15, 20)
    expect(screen.getByText('Bugfix 01')).toBeDefined()
    expect(screen.queryByText('Bugfix 16')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Page 2' }))

    expectShowing(16, 20, 20)
    expect(screen.getByText('Bugfix 16')).toBeDefined()
    expect(screen.queryByText('Bugfix 01')).toBeNull()
  })

  it('resets to the first page when the search filter changes', async () => {
    const tasks = Array.from({ length: 20 }, (_, i) =>
      makeTask(`t${i + 1}`, `Bugfix ${String(i + 1).padStart(2, '0')}`, 'TODO'),
    )
    renderPage(tasks)

    fireEvent.click(screen.getByLabelText('list view'))
    fireEvent.click(screen.getByRole('button', { name: 'Page 2' }))
    expectShowing(16, 20, 20)

    // A search that still matches every task — pagination stays visible, and
    // the page must jump back to 1 (otherwise page 2 would keep showing 16–20).
    fireEvent.change(screen.getByPlaceholderText(/Search tasks/i), {
      target: { value: 'Bugfix' },
    })

    await waitFor(() => {
      expectShowing(1, 15, 20)
      expect(screen.getByText('Bugfix 01')).toBeDefined()
      expect(screen.queryByText('Bugfix 16')).toBeNull()
    })
    expect(screen.getByRole('button', { name: 'Page 1' }).getAttribute('aria-current')).toBe('page')
  })
})

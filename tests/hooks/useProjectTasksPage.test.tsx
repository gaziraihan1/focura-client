import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHookWithProviders } from '../utils/renderWithProviders'
import type { Task } from '@/hooks/useTask'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'acme', projectSlug: 'web-app' }),
  useRouter: () => ({ back: vi.fn(), push: vi.fn(), replace: vi.fn() }),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: () => '/x',
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
}))

import { useProjectTasksPage } from '@/hooks/useProjectTasksPage'
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

function mockData(tasks: Task[], sections: unknown[] = [], url = '') {
  ;(useProjectDetailsBySlug as any).mockReturnValue({ data: project, isLoading: false, error: null })
  ;(useProjectRole as any).mockReturnValue({ canCreateTasks: true })
  ;(useUserProfile as any).mockReturnValue({ userId: 'u1' })
  ;(useTasks as any).mockReturnValue({
    data: {
      data: tasks,
      pagination: { page: 1, pageSize: 100, totalCount: tasks.length, totalPages: 1, hasNext: false, hasPrev: false },
    },
    isLoading: false,
  })
  ;(useProjectSections as any).mockReturnValue({ data: sections })
  ;(useSearchParams as any).mockReturnValue(new URLSearchParams(url))
}

describe('useProjectTasksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns tasks, sections and the merged default board columns', () => {
    mockData([
      makeTask('t1', 'Write docs', 'TODO'),
      makeTask('t2', 'Fix auth bug', 'IN_PROGRESS'),
    ])
    const { result } = renderHookWithProviders(() => useProjectTasksPage())

    expect(result.current.tasks).toHaveLength(2)
    expect(result.current.filteredTasks).toHaveLength(2)
    // No workflow sections → the 4 static columns are used
    expect(result.current.boardColumns.map((col) => col.status)).toEqual([
      'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED',
    ])
    expect(result.current.canCreateTasks).toBe(true)
    expect(result.current.isMember).toBe(true)
  })

  it('builds workflow columns from status-mapped sections', () => {
    mockData(
      [makeTask('t1', 'Build navbar', 'IN_PROGRESS', 'sec-frontend')],
      [{ id: 'sec-frontend', name: 'Frontend', color: '#667eea', status: 'ACTIVE', position: 0, projectId: 'proj1', taskStatus: 'IN_PROGRESS' }],
    )
    const { result } = renderHookWithProviders(() => useProjectTasksPage())

    expect(result.current.boardColumns.map((col) => col.status)).toEqual([
      'IN_PROGRESS', 'TODO', 'IN_REVIEW', 'COMPLETED',
    ])
    expect(result.current.sectionsById.get('sec-frontend')?.name).toBe('Frontend')
  })

  it('filters tasks by section from the URL param', () => {
    mockData(
      [
        makeTask('t1', 'Build navbar', 'TODO', 'sec-frontend'),
        makeTask('t2', 'Write API docs', 'TODO', null),
      ],
      [{ id: 'sec-frontend', name: 'Frontend', color: '#667eea', status: 'ACTIVE', position: 0, projectId: 'proj1' }],
      '?section=sec-frontend',
    )
    const { result } = renderHookWithProviders(() => useProjectTasksPage())

    expect(result.current.sectionFilter).toBe('sec-frontend')
    expect(result.current.filteredTasks.map((t) => t.title)).toEqual(['Build navbar'])
  })

  it('falls back to ALL when the section param points to a deleted section', () => {
    mockData(
      [makeTask('t1', 'Build navbar', 'TODO', 'sec-frontend')],
      [],
      '?section=deleted-section',
    )
    const { result } = renderHookWithProviders(() => useProjectTasksPage())

    expect(result.current.sectionFilter).toBe('ALL')
    expect(result.current.filteredTasks).toHaveLength(1)
  })

  it('does not filter by section when the param is absent', () => {
    mockData(
      [
        makeTask('t1', 'Build navbar', 'TODO', 'sec-frontend'),
        makeTask('t2', 'Write API docs', 'TODO', null),
      ],
      [{ id: 'sec-frontend', name: 'Frontend', color: '#667eea', status: 'ACTIVE', position: 0, projectId: 'proj1' }],
    )
    const { result } = renderHookWithProviders(() => useProjectTasksPage())

    expect(result.current.sectionFilter).toBe('ALL')
    expect(result.current.filteredTasks).toHaveLength(2)
  })
})

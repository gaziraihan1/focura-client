import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { renderHookWithProviders } from '../utils/renderWithProviders'
import type { Task } from '@/hooks/useTask'

// Stateful URL mock so router.replace() actually updates what useSearchParams
// returns — lets the tests verify URL-synced filters (section/sprint/milestone
// and the applied view) really get cleared.
const urlState = vi.hoisted(() => {
  let params = new URLSearchParams()
  return {
    get: () => params,
    set: (p: URLSearchParams) => {
      params = p
    },
    replace: (url: string) => {
      const query = url.split('?')[1] ?? ''
      params = new URLSearchParams(query)
    },
  }
})

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'acme', projectSlug: 'web-app' }),
  useRouter: () => ({ back: vi.fn(), push: vi.fn(), replace: urlState.replace }),
  useSearchParams: () => urlState.get(),
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
  useProjectSprints: vi.fn(() => ({ data: { sprints: [] } })),
  useProjectMilestones: vi.fn(() => ({ data: { milestones: [] } })),
  useProjectViews: vi.fn(() => ({ data: [] })),
}))

import { useProjectTasksPage } from '@/hooks/useProjectTasksPage'
import { useProjectDetailsBySlug, useProjectRole } from '@/hooks/useProjects'
import { useUserProfile } from '@/hooks/useUser'
import { useTasks } from '@/hooks/useTask'
import { useProjectSections, useProjectSprints, useProjectMilestones, useProjectViews } from '@/hooks/useProjectFeatures'

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
  urlState.set(new URLSearchParams(url))
}

describe('useProjectTasksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    urlState.set(new URLSearchParams())
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

  it('clearFilters resets all filters including URL-synced ones', () => {
    const section = { id: 'sec-frontend', name: 'Frontend', color: '#667eea', status: 'ACTIVE', position: 0, projectId: 'proj1' }
    const sprint = { id: 's1', name: 'Sprint 1', status: 'ACTIVE' as const, startDate: '2026-08-01', endDate: '2026-08-15', projectId: 'proj1' }
    const milestone = { id: 'm1', title: 'M1', status: 'ON_TRACK' as const, progress: 0, completed: false, projectId: 'proj1' }
    ;(useProjectSprints as any).mockReturnValue({ data: { sprints: [sprint] } })
    ;(useProjectMilestones as any).mockReturnValue({ data: { milestones: [milestone] } })
    mockData(
      [makeTask('t1', 'Build navbar', 'TODO', 'sec-frontend')],
      [section],
      '?section=sec-frontend&sprint=s1&milestone=m1',
    )
    const { result } = renderHookWithProviders(() => useProjectTasksPage())

    expect(result.current.sectionFilter).toBe('sec-frontend')
    expect(result.current.sprintFilter).toBe('s1')
    expect(result.current.milestoneFilter).toBe('m1')

    // Give plain-state filters non-default values so clearFilters has real
    // work to do (and triggers the re-render that re-reads the URL params).
    act(() => {
      result.current.setSearch('nav')
      result.current.setPriorityFilter('HIGH')
      result.current.setStatusFilter('IN_PROGRESS')
    })
    expect(result.current.search).toBe('nav')
    expect(result.current.priorityFilter).toBe('HIGH')
    expect(result.current.statusFilter).toBe('IN_PROGRESS')

    act(() => result.current.clearFilters())

    expect(result.current.search).toBe('')
    expect(result.current.priorityFilter).toBe('ALL')
    expect(result.current.statusFilter).toBe('ALL')
    expect(result.current.sectionFilter).toBe('ALL')
    expect(result.current.sprintFilter).toBe('ALL')
    expect(result.current.milestoneFilter).toBe('ALL')
    expect(urlState.get().has('section')).toBe(false)
    expect(urlState.get().has('sprint')).toBe(false)
    expect(urlState.get().has('milestone')).toBe(false)
  })

  it('resetView drops the applied view and clears URL params', () => {
    const view = { id: 'v1', name: 'My List', type: 'LIST' as const, isDefault: false, visibility: 'PRIVATE' as const, createdById: 'u1', projectId: 'proj1' }
    ;(useProjectViews as any).mockReturnValue({ data: [view] })
    mockData(
      [makeTask('t1', 'Write docs', 'TODO')],
      [{ id: 'sec-frontend', name: 'Frontend', color: '#667eea', status: 'ACTIVE', position: 0, projectId: 'proj1' }],
      '?view=v1&section=sec-frontend',
    )
    const { result } = renderHookWithProviders(() => useProjectTasksPage())

    expect(result.current.activeViewId).toBe('v1')
    expect(result.current.sectionFilter).toBe('sec-frontend')

    act(() => result.current.resetView())

    expect(result.current.activeViewId).toBeNull()
    expect(result.current.viewMode).toBe('board')
    expect(urlState.get().has('view')).toBe(false)
    expect(urlState.get().has('section')).toBe(false)
  })
})

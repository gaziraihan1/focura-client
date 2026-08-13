import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import toast from 'react-hot-toast'
import { useWorkspaceTasksPage } from '@/hooks/useWorkspaceTasksPage'

const h = vi.hoisted(() => {
  const workspace = {
    id: 'ws-1',
    name: 'Test Workspace',
    slug: 'test-ws',
    plan: 'FREE',
  }
  const baseTask = {
    id: 't1',
    title: 'Task One',
    workspaceId: 'ws-1',
    project: null,
  }
  return {
    workspace,
    tasks: [baseTask] as Array<Record<string, unknown>>,
    hasPrimaryTask: false,
    activeSession: null as Record<string, unknown> | null,
    addToPrimary: vi.fn(),
    addToSecondary: vi.fn(),
    removeDailyTask: vi.fn(),
    completeSession: vi.fn(),
  }
})

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspace: () => ({ data: h.workspace }),
  useWorkspaceRoleFromWorkspace: () => ({ role: 'OWNER', isOwner: true }),
}))

vi.mock('@/hooks/useProjects', () => ({
  useProjects: () => ({ data: [{ id: 'pr1', name: 'Project One' }] }),
}))

vi.mock('@/hooks/useWorkspaceSections', () => ({
  useWorkspaceSections: () => ({ data: [] }),
}))

vi.mock('@/hooks/useLabels', () => ({
  useLabels: () => ({ data: { data: [{ id: 'l1', name: 'Bug' }] } }),
}))

vi.mock('@/hooks/useTeam', () => ({
  useTeamMembers: () => ({
    data: [{ id: 'm1', user: { id: 'u1' }, role: 'MEMBER' }],
  }),
}))

vi.mock('@/hooks/useTask', () => ({
  useTasks: () => ({
    data: {
      data: h.tasks,
      pagination: {
        page: 1,
        pageSize: 10,
        totalCount: h.tasks.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
    isLoading: false,
    isError: false,
  }),
  useTaskStats: () => ({ data: { total: 10 } }),
  useWorkspaceQuota: () => ({ data: { used: 1, limit: 100 } }),
  useTask: () => ({ data: null }),
}))

vi.mock('@/hooks/useFocusSession', () => ({
  useFocusSession: () => ({
    activeSession: h.activeSession,
    completeSession: h.completeSession,
    isLoading: false,
  }),
}))

vi.mock('@/hooks/useDailyTasks', () => ({
  useDailyTasks: () => ({
    primaryTask: null,
    secondaryTasks: [],
    hasPrimaryTask: h.hasPrimaryTask,
    isLoading: false,
    error: null,
    addToPrimary: h.addToPrimary,
    addToSecondary: h.addToSecondary,
    removeDailyTask: h.removeDailyTask,
    refresh: vi.fn(),
    isAdding: false,
    isRemoving: false,
  }),
}))

function renderTasksPage() {
  return renderHook(() => useWorkspaceTasksPage({ workspaceSlug: 'test-ws' }))
}

describe('useWorkspaceTasksPage', () => {
  beforeEach(() => {
    h.tasks = [{ id: 't1', title: 'Task One', workspaceId: 'ws-1', project: null }]
    h.hasPrimaryTask = false
    h.activeSession = null
    h.addToPrimary.mockReset().mockResolvedValue({ success: true })
    h.addToSecondary.mockReset().mockResolvedValue({ success: true })
    h.removeDailyTask.mockReset().mockResolvedValue({ success: true })
    h.completeSession.mockReset()
    ;(toast.error as ReturnType<typeof vi.fn>).mockClear()
  })

  it('exposes default state', () => {
    const { result } = renderTasksPage()
    expect(result.current.workspace?.id).toBe('ws-1')
    expect(result.current.role).toBe('OWNER')
    expect(result.current.searchQuery).toBe('')
    expect(result.current.showFilters).toBe(false)
    expect(result.current.activeFiltersCount).toBe(0)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.sortBy).toBe('priority')
    expect(result.current.sortOrder).toBe('asc')
  })

  it('exposes tasks, projects, sections, labels, and members', () => {
    const { result } = renderTasksPage()
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.projects).toHaveLength(1)
    expect(result.current.sections).toEqual([])
    expect(result.current.labels).toHaveLength(1)
    expect(result.current.members).toHaveLength(1)
  })

  it('toggles the filter panel', () => {
    const { result } = renderTasksPage()
    act(() => result.current.toggleFilters())
    expect(result.current.showFilters).toBe(true)
    act(() => result.current.toggleFilters())
    expect(result.current.showFilters).toBe(false)
  })

  it('counts active filters', () => {
    const { result } = renderTasksPage()

    act(() => result.current.setSelectedStatus('TODO'))
    act(() => result.current.setSelectedPriority('HIGH'))
    act(() => result.current.toggleLabel('l1'))

    expect(result.current.activeFiltersCount).toBe(3)
  })

  it('toggles a label in and out of the selection and resets the page', () => {
    const { result } = renderTasksPage()
    act(() => result.current.handlePageChange(3))
    expect(result.current.currentPage).toBe(3)

    act(() => result.current.toggleLabel('l1'))
    expect(result.current.selectedLabels).toEqual(['l1'])
    expect(result.current.currentPage).toBe(1)

    act(() => result.current.toggleLabel('l1'))
    expect(result.current.selectedLabels).toEqual([])
  })

  it('clears all filters', () => {
    const { result } = renderTasksPage()
    act(() => result.current.setSelectedStatus('TODO'))
    act(() => result.current.setSelectedPriority('HIGH'))
    act(() => result.current.toggleLabel('l1'))
    act(() => result.current.setFocusRequired(true))

    act(() => result.current.clearFilters())

    expect(result.current.selectedStatus).toBe('all')
    expect(result.current.selectedPriority).toBe('all')
    expect(result.current.selectedLabels).toEqual([])
    expect(result.current.focusRequired).toBe(false)
    expect(result.current.activeFiltersCount).toBe(0)
  })

  it('toggles sort order when re-selecting the same key', () => {
    const { result } = renderTasksPage()
    expect(result.current.sortOrder).toBe('asc')

    act(() => result.current.setSortBy('priority'))
    expect(result.current.sortOrder).toBe('desc')

    act(() => result.current.setSortBy('priority'))
    expect(result.current.sortOrder).toBe('asc')
  })

  it('sets a default order when switching sort keys', () => {
    const { result } = renderTasksPage()
    act(() => result.current.setSortBy('dueDate'))
    expect(result.current.sortBy).toBe('dueDate')
    expect(result.current.sortOrder).toBe('asc')

    act(() => result.current.setSortBy('title'))
    expect(result.current.sortBy).toBe('title')
    expect(result.current.sortOrder).toBe('desc')
  })

  it('changes the page and scrolls to top', () => {
    const scrollSpy = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {})
    const { result } = renderTasksPage()

    act(() => result.current.handlePageChange(2))
    expect(result.current.currentPage).toBe(2)
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    scrollSpy.mockRestore()
  })

  it('updates a search query and resets the page', () => {
    const { result } = renderTasksPage()
    act(() => result.current.handlePageChange(2))

    act(() => result.current.setSearchQuery('bug'))
    expect(result.current.searchQuery).toBe('bug')
    expect(result.current.currentPage).toBe(1)
  })

  it('guards against tasks that belong to other workspaces', () => {
    h.tasks = [
      { id: 't1', title: 'Mine', workspaceId: 'ws-1', project: null },
      { id: 't2', title: 'Foreign', workspaceId: 'other-ws', project: null },
      {
        id: 't3',
        title: 'In My Project',
        workspaceId: null,
        project: { id: 'pr1', workspace: { id: 'ws-1' } },
      },
      {
        id: 't4',
        title: 'Foreign Project',
        workspaceId: null,
        project: { id: 'pr9', workspace: { id: 'other-ws' } },
      },
    ]

    const { result } = renderTasksPage()
    expect(result.current.tasks.map((t) => t.id)).toEqual(['t1', 't3'])
  })

  it('blocks adding a primary task when one already exists', async () => {
    h.hasPrimaryTask = true
    const { result } = renderTasksPage()

    await act(async () => {
      await result.current.handleAddToPrimary('t1')
    })

    expect(toast.error).toHaveBeenCalledWith(
      'You already have a primary task set for today'
    )
    expect(h.addToPrimary).not.toHaveBeenCalled()
  })

  it('adds a task to primary and clears the loading state', async () => {
    const { result } = renderTasksPage()

    await act(async () => {
      await result.current.handleAddToPrimary('t1')
    })

    expect(h.addToPrimary).toHaveBeenCalledWith('t1')
    expect(result.current.loadingTaskId).toBeNull()
    expect(result.current.loadingType).toBeNull()
  })

  it('toasts an error when adding to primary fails', async () => {
    h.addToPrimary.mockResolvedValue({ success: false, message: 'boom' })
    const { result } = renderTasksPage()

    await act(async () => {
      await result.current.handleAddToPrimary('t1')
    })

    expect(toast.error).toHaveBeenCalledWith('boom')
  })

  it('adds a task to secondary and clears the loading state', async () => {
    const { result } = renderTasksPage()

    await act(async () => {
      await result.current.handleAddToSecondary('t1')
    })

    expect(h.addToSecondary).toHaveBeenCalledWith('t1')
    expect(result.current.loadingTaskId).toBeNull()
  })

  it('removes a daily task and toasts failures', async () => {
    h.removeDailyTask.mockResolvedValue({ success: false, message: 'nope' })
    const { result } = renderTasksPage()

    await act(async () => {
      await result.current.handleRemoveDailyTask('t1')
    })

    expect(h.removeDailyTask).toHaveBeenCalledWith('t1')
    expect(toast.error).toHaveBeenCalledWith('nope')
  })

  it('auto-completes an expired focus session', async () => {
    h.activeSession = {
      id: 's1',
      taskId: 't1',
      startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      duration: 0.1,
      completed: false,
    }

    const { result } = renderTasksPage()

    expect(h.completeSession).toHaveBeenCalled()
    expect(result.current.timeRemaining).toBe(0)
    expect(result.current.activeSession?.id).toBe('s1')
  })
})

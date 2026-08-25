import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useTasksPage } from '@/hooks/useTasksPage'

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn(), replace: mockReplace }),
  usePathname: () => '/dashboard/tasks',
  useSearchParams: () => new URLSearchParams(window.location.search),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useTasksPage', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    window.history.replaceState(null, '', '/dashboard/tasks')
  })

  it('initializes with default state when URL has no params', () => {
    const { result } = renderHook(() => useTasksPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.activeTab).toBe('all')
    expect(result.current.searchQuery).toBe('')
    expect(result.current.selectedStatus).toBe('all')
    expect(result.current.selectedPriority).toBe('all')
    expect(result.current.currentPage).toBe(1)
    expect(result.current.sortBy).toBe('priority')
    expect(result.current.sortOrder).toBe('asc')
    expect(result.current.focusRequired).toBe(false)
    expect(result.current.pageSize).toBe(10)
  })

  it('derives initial view state FROM url params (shareable links)', () => {
    window.history.replaceState(
      null,
      '',
      '/dashboard/tasks?tab=personal&status=TODO&priority=HIGH&page=3&sortBy=dueDate&sortOrder=desc&focusRequired=true&search=report'
    )
    const { result } = renderHook(() => useTasksPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.activeTab).toBe('personal')
    expect(result.current.selectedStatus).toBe('TODO')
    expect(result.current.selectedPriority).toBe('HIGH')
    expect(result.current.currentPage).toBe(3)
    expect(result.current.sortBy).toBe('dueDate')
    expect(result.current.sortOrder).toBe('desc')
    expect(result.current.focusRequired).toBe(true)
    expect(result.current.searchQuery).toBe('report')
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(() => useTasksPage(), {
      wrapper: createWrapper(),
    })

    for (const key of [
      'handleTabChange',
      'handleSearchChange',
      'handleStatusChange',
      'handlePriorityChange',
      'handleSortChange',
      'handlePageChange',
      'handleCreateTask',
      'setFocusRequired',
    ]) {
      expect(typeof result.current[key]).toBe('function')
    }
    expect(typeof result.current.tasks).toBe('object')
    expect(typeof result.current.isLoading).toBe('boolean')
    expect(typeof result.current.isError).toBe('boolean')
  })

  it('handleStatusChange writes status to the url and resets page', () => {
    const { result } = renderHook(() => useTasksPage(), {
      wrapper: createWrapper(),
    })

    act(() => result.current.handleStatusChange('IN_PROGRESS'))

    expect(mockReplace).toHaveBeenCalledTimes(1)
    const [url, opts] = mockReplace.mock.calls[0]
    expect(url).toBe('/dashboard/tasks?status=IN_PROGRESS')
    expect(opts).toEqual({ scroll: false })
  })

  it('handleStatusChange removes the param when reset to all', () => {
    window.history.replaceState(null, '', '/dashboard/tasks?status=TODO&page=2')
    const { result } = renderHook(() => useTasksPage(), {
      wrapper: createWrapper(),
    })

    act(() => result.current.handleStatusChange('all'))

    const url = mockReplace.mock.calls[0][0] as string
    expect(url).not.toContain('status=')
    expect(url).not.toContain('page=2')
  })

  it('handleSortChange toggles order for the same field', () => {
    const { result } = renderHook(() => useTasksPage(), {
      wrapper: createWrapper(),
    })

    act(() => result.current.handleSortChange('priority'))

    const url = mockReplace.mock.calls[0][0] as string
    // sortBy defaults to "priority" so it is omitted from the url
    expect(url).toBe('/dashboard/tasks?sortOrder=desc')
  })
})

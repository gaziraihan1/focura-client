import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useTasksPage } from '@/hooks/useTasksPage'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useTasksPage', () => {
  it('initializes with default state', () => {
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
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(() => useTasksPage(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.handleTabChange).toBe('function')
    expect(typeof result.current.handleSearchChange).toBe('function')
    expect(typeof result.current.handleStatusChange).toBe('function')
    expect(typeof result.current.handlePriorityChange).toBe('function')
    expect(typeof result.current.handleSortChange).toBe('function')
    expect(typeof result.current.handlePageChange).toBe('function')
    expect(typeof result.current.handleCreateTask).toBe('function')
    expect(typeof result.current.tasks).toBe('object')
    expect(typeof result.current.isLoading).toBe('boolean')
    expect(typeof result.current.isError).toBe('boolean')
  })

  it('has correct page size', () => {
    const { result } = renderHook(() => useTasksPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.pageSize).toBe(10)
  })
})

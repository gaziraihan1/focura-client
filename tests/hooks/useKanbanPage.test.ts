import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useKanbanPage, useExecutionControlBar } from '@/hooks/useKanbanPage'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useKanbanPage', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useKanbanPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.scope).toBe('personal')
    expect(result.current.sort).toBe('priority')
    expect(result.current.focusMode).toBe(false)
    expect(result.current.enforceWIP).toBe(false)
    expect(result.current.showInsights).toBe(false)
    expect(result.current.selectedTask).toBeNull()
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(() => useKanbanPage(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.setScope).toBe('function')
    expect(typeof result.current.setSort).toBe('function')
    expect(typeof result.current.setFocusMode).toBe('function')
    expect(typeof result.current.setEnforceWIP).toBe('function')
    expect(typeof result.current.setShowInsights).toBe('function')
    expect(typeof result.current.setSelectedTask).toBe('function')
    expect(typeof result.current.setFilters).toBe('function')
    expect(typeof result.current.displayTasks).toBe('object')
    expect(typeof result.current.taskCounts).toBe('object')
    expect(typeof result.current.isLoading).toBe('boolean')
  })

  it('has correct taskCounts shape', () => {
    const { result } = renderHook(() => useKanbanPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.taskCounts).toHaveProperty('total')
    expect(result.current.taskCounts).toHaveProperty('inProgress')
    expect(result.current.taskCounts).toHaveProperty('blocked')
  })
})

describe('useExecutionControlBar', () => {
  it('initializes with correct state', () => {
    const mockOnFiltersChange = vi.fn()
    const filters = { status: ['TODO'] }

    const { result } = renderHook(
      () => useExecutionControlBar({ filters, onFiltersChange: mockOnFiltersChange }),
      { wrapper: createWrapper() }
    )

    expect(result.current.showFilters).toBe(false)
    expect(result.current.activeFilterCount).toBe(0)
  })

  it('toggles priority filter', () => {
    const mockOnFiltersChange = vi.fn()
    const filters = { status: ['TODO'] }

    const { result } = renderHook(
      () => useExecutionControlBar({ filters, onFiltersChange: mockOnFiltersChange }),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.togglePriority('HIGH')
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ priority: ['HIGH'] })
    )
  })

  it('toggles blocked only filter', () => {
    const mockOnFiltersChange = vi.fn()
    const filters = { status: ['TODO'] }

    const { result } = renderHook(
      () => useExecutionControlBar({ filters, onFiltersChange: mockOnFiltersChange }),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.toggleBlockedOnly()
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ blockedOnly: true })
    )
  })

  it('clears filters', () => {
    const mockOnFiltersChange = vi.fn()
    const filters = { status: ['TODO'], priority: ['HIGH'], blockedOnly: true }

    const { result } = renderHook(
      () => useExecutionControlBar({ filters, onFiltersChange: mockOnFiltersChange }),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.clearFilters()
    })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ status: ['TODO'] })
  })

  it('toggles filters panel', () => {
    const mockOnFiltersChange = vi.fn()
    const filters = { status: ['TODO'] }

    const { result } = renderHook(
      () => useExecutionControlBar({ filters, onFiltersChange: mockOnFiltersChange }),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.toggleFiltersPanel()
    })

    expect(result.current.showFilters).toBe(true)
  })
})

describe('useExecutionControlBar - activeFilterCount', () => {
  it('counts priority filters', () => {
    const mockOnFiltersChange = vi.fn()
    const filters = { status: ['TODO'], priority: ['HIGH', 'URGENT'] }

    const { result } = renderHook(
      () => useExecutionControlBar({ filters, onFiltersChange: mockOnFiltersChange }),
      { wrapper: createWrapper() }
    )

    expect(result.current.activeFilterCount).toBe(2)
  })

  it('counts blockedOnly filter', () => {
    const mockOnFiltersChange = vi.fn()
    const filters = { status: ['TODO'], blockedOnly: true }

    const { result } = renderHook(
      () => useExecutionControlBar({ filters, onFiltersChange: mockOnFiltersChange }),
      { wrapper: createWrapper() }
    )

    expect(result.current.activeFilterCount).toBe(1)
  })

  it('counts all filter types', () => {
    const mockOnFiltersChange = vi.fn()
    const filters = { status: ['TODO'], priority: ['HIGH'], blockedOnly: true, staleOnly: true }

    const { result } = renderHook(
      () => useExecutionControlBar({ filters, onFiltersChange: mockOnFiltersChange }),
      { wrapper: createWrapper() }
    )

    // priority length (1) + blockedOnly (1) + staleOnly (1) = 3
    expect(result.current.activeFilterCount).toBe(3)
  })
})

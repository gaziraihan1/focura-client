import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useWorkspaceKanbanPage } from '@/hooks/useWorkspaceKanbanPage'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useWorkspaceKanbanPage', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(
      () => useWorkspaceKanbanPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    expect(result.current.scope).toBe('personal')
    expect(result.current.sort).toBe('priority')
    expect(result.current.focusMode).toBe(false)
    expect(result.current.enforceWIP).toBe(false)
    expect(result.current.showInsights).toBe(false)
    expect(result.current.selectedTask).toBeNull()
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(
      () => useWorkspaceKanbanPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    expect(typeof result.current.workspaceSlug).toBe('string')
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
    const { result } = renderHook(
      () => useWorkspaceKanbanPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    expect(result.current.taskCounts).toHaveProperty('total')
    expect(result.current.taskCounts).toHaveProperty('inProgress')
    expect(result.current.taskCounts).toHaveProperty('blocked')
  })
})

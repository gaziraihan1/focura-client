import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useTeamTasksPage } from '@/hooks/useTeamTasksPage'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

vi.mock('@/lib/task/time', () => ({
  getTaskTimeInfo: () => ({ isOverdue: false, isDueToday: false }),
}))

describe('useTeamTasksPage', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(
      () => useTeamTasksPage({ workspaceId: 'ws-1' }),
      { wrapper: createWrapper() }
    )

    expect(result.current.scope).toBe('all')
    expect(result.current.search).toBe('')
    expect(result.current.status).toBe('all')
    expect(result.current.priority).toBe('all')
    expect(result.current.attentionOnly).toBe(false)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.sortBy).toBe('priority')
    expect(result.current.sortOrder).toBe('asc')
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(
      () => useTeamTasksPage({ workspaceId: 'ws-1' }),
      { wrapper: createWrapper() }
    )

    expect(typeof result.current.setScope).toBe('function')
    expect(typeof result.current.setSearch).toBe('function')
    expect(typeof result.current.setStatus).toBe('function')
    expect(typeof result.current.setPriority).toBe('function')
    expect(typeof result.current.setAttentionOnly).toBe('function')
    expect(typeof result.current.setSortBy).toBe('function')
    expect(typeof result.current.handlePageChange).toBe('function')
    expect(typeof result.current.getSectionTitle).toBe('function')
    expect(typeof result.current.filteredTasks).toBe('object')
    expect(typeof result.current.isLoading).toBe('boolean')
  })

  it('returns correct section title for default scope', () => {
    const { result } = renderHook(
      () => useTeamTasksPage({ workspaceId: 'ws-1' }),
      { wrapper: createWrapper() }
    )

    expect(result.current.getSectionTitle()).toBe('All Team Tasks')
  })
})

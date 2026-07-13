import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useFileManagementPage } from '@/hooks/useFileManagemetPage'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useFileManagementPage', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(
      () => useFileManagementPage('ws-1'),
      { wrapper: createWrapper() }
    )

    expect(result.current.viewMode).toBe('grid')
    expect(result.current.filters.sortBy).toBe('date')
    expect(result.current.filters.sortOrder).toBe('desc')
    expect(result.current.filters.page).toBe(1)
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(
      () => useFileManagementPage('ws-1'),
      { wrapper: createWrapper() }
    )

    expect(typeof result.current.setViewMode).toBe('function')
    expect(typeof result.current.handleFiltersChange).toBe('function')
    expect(typeof result.current.loadMore).toBe('function')
    expect(typeof result.current.handleRetry).toBe('function')
    expect(typeof result.current.isLoading).toBe('boolean')
  })
})

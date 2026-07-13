import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useProjectAnalyticsPage } from '@/hooks/useProjectAnalyticsPage'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useProjectAnalyticsPage', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(
      () => useProjectAnalyticsPage({ workspaceId: 'ws-1', projectId: 'proj-1' }),
      { wrapper: createWrapper() }
    )

    expect(result.current.hasNotPlan).toBeDefined()
    expect(result.current.isLoading).toBeDefined()
    expect(result.current.isAccessDenied).toBeDefined()
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(
      () => useProjectAnalyticsPage({ workspaceId: 'ws-1', projectId: 'proj-1' }),
      { wrapper: createWrapper() }
    )

    expect(typeof result.current.overviewLoading).toBe('boolean')
    expect(typeof result.current.isLoading).toBe('boolean')
    expect(typeof result.current.hasNotPlan).toBe('boolean')
    expect(typeof result.current.isAccessDenied).toBe('boolean')
    expect(typeof result.current.errorMessage).toBe('string')
  })
})

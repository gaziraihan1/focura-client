import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useWorkspacesPage } from '@/hooks/useWorkspacePage'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useWorkspacesPage', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useWorkspacesPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.searchQuery).toBe('')
    expect(result.current.filteredWorkspaces).toBeDefined()
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(() => useWorkspacesPage(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.setSearchQuery).toBe('function')
    expect(typeof result.current.isLoading).toBe('boolean')
    expect(typeof result.current.isError).toBe('boolean')
    expect(typeof result.current.filteredWorkspaces).toBe('object')
    expect(typeof result.current.getPlanBadge).toBe('function')
    expect(typeof result.current.navigateToCreate).toBe('function')
    expect(typeof result.current.navigateToSettings).toBe('function')
  })

  it('getPlanBadge returns correct badge for FREE plan', () => {
    const { result } = renderHook(() => useWorkspacesPage(), {
      wrapper: createWrapper(),
    })

    const badge = result.current.getPlanBadge('FREE')
    expect(badge.label).toBe('Free')
    expect(badge.color).toContain('gray')
  })

  it('getPlanBadge returns correct badge for PRO plan', () => {
    const { result } = renderHook(() => useWorkspacesPage(), {
      wrapper: createWrapper(),
    })

    const badge = result.current.getPlanBadge('PRO')
    expect(badge.label).toBe('Pro')
    expect(badge.color).toContain('blue')
  })

  it('getPlanBadge returns correct badge for BUSINESS plan', () => {
    const { result } = renderHook(() => useWorkspacesPage(), {
      wrapper: createWrapper(),
    })

    const badge = result.current.getPlanBadge('BUSINESS')
    expect(badge.label).toBe('Business')
    expect(badge.color).toContain('purple')
  })

  it('getPlanBadge falls back to FREE for unknown plan', () => {
    const { result } = renderHook(() => useWorkspacesPage(), {
      wrapper: createWrapper(),
    })

    const badge = result.current.getPlanBadge('UNKNOWN')
    expect(badge.label).toBe('Free')
  })
})

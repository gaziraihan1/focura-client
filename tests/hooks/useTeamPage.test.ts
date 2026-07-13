import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useTeamPage } from '@/hooks/useTeamPage'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useTeamPage', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useTeamPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.workspaceId).toBe('')
    expect(result.current.workspaceName).toBe('')
    expect(result.current.isLoading).toBeDefined()
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(() => useTeamPage(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.canManageWorkspace).toBe('boolean')
    expect(typeof result.current.canManageProjects).toBe('boolean')
    expect(typeof result.current.stats).toBe('object')
    expect(typeof result.current.members).toBe('object')
    expect(typeof result.current.projects).toBe('object')
    expect(typeof result.current.updateWorkspaceMemberRole).toBe('object')
    expect(typeof result.current.updateProjectMemberRole).toBe('object')
  })

  it('has correct stats shape', () => {
    const { result } = renderHook(() => useTeamPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.stats).toHaveProperty('totalMembers')
    expect(result.current.stats).toHaveProperty('totalProjects')
    expect(result.current.stats).toHaveProperty('adminCount')
    expect(result.current.stats).toHaveProperty('managerCount')
  })
})

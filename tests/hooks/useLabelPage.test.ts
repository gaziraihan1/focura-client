import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useLabelPage } from '@/hooks/useLabelPage'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useLabelPage', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useLabelPage('ws-1'), {
      wrapper: createWrapper(),
    })

    expect(result.current.searchQuery).toBe('')
    expect(result.current.page).toBe(1)
    expect(result.current.isCreateModalOpen).toBe(false)
    expect(result.current.editingLabel).toBeNull()
    expect(result.current.deletingLabel).toBeNull()
    expect(result.current.activeDropdown).toBeNull()
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(() => useLabelPage('ws-1'), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.setSearchQuery).toBe('function')
    expect(typeof result.current.setPage).toBe('function')
    expect(typeof result.current.setIsCreateModalOpen).toBe('function')
    expect(typeof result.current.setEditingLabel).toBe('function')
    expect(typeof result.current.setDeletingLabel).toBe('function')
    expect(typeof result.current.setActiveDropdown).toBe('function')
    expect(typeof result.current.labels).toBe('object')
    expect(typeof result.current.filteredLabels).toBe('object')
    expect(typeof result.current.isLoading).toBe('boolean')
    expect(typeof result.current.canManageLabels).toBe('boolean')
  })
})

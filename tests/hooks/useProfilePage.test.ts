import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useProfilePage } from '@/hooks/useProfilePage'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useProfilePage', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useProfilePage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.profile).toBeNull()
    expect(result.current.storage).toBeNull()
    expect(result.current.isEditing).toBe(false)
    expect(result.current.saving).toBe(false)
    expect(result.current.uploading).toBe(false)
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(() => useProfilePage(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.setIsEditing).toBe('function')
    expect(typeof result.current.handleImageUpload).toBe('function')
    expect(typeof result.current.handleSave).toBe('function')
    expect(typeof result.current.handleCancel).toBe('function')
    expect(typeof result.current.handleFormChange).toBe('function')
    expect(typeof result.current.formData).toBe('object')
    expect(typeof result.current.loading).toBe('boolean')
  })
})

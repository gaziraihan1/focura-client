import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useCreateWorkspacePage } from '@/hooks/useCreateWorkspacePage'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useCreateWorkspacePage', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useCreateWorkspacePage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.formData.name).toBe('')
    expect(result.current.formData.description).toBe('')
    expect(result.current.formData.isPublic).toBe(false)
    expect(result.current.formData.plan).toBe('FREE')
    expect(result.current.selectedType).toBe('team')
    expect(result.current.isSubmitting).toBe(false)
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(() => useCreateWorkspacePage(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.setSelectedType).toBe('function')
    expect(typeof result.current.handleSubmit).toBe('function')
    expect(typeof result.current.handleCancel).toBe('function')
    expect(typeof result.current.updateField).toBe('function')
    expect(typeof result.current.predefinedColors).toBe('object')
    expect(result.current.predefinedColors).toHaveLength(8)
  })
})

import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useAnnouncementPage } from '@/hooks/useAnnouncementPage'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-ws' }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useAnnouncementPage', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(
      () => useAnnouncementPage('test-ws'),
      { wrapper: createWrapper() }
    )

    expect(result.current.showModal).toBe(false)
    expect(result.current.deletingId).toBeNull()
    expect(result.current.pinningId).toBeNull()
    expect(result.current.form.title).toBe('')
    expect(result.current.form.visibility).toBe('PUBLIC')
  })

  it('exposes expected return shape', () => {
    const { result } = renderHook(
      () => useAnnouncementPage('test-ws'),
      { wrapper: createWrapper() }
    )

    expect(typeof result.current.openModal).toBe('function')
    expect(typeof result.current.handleClose).toBe('function')
    expect(typeof result.current.handleSubmit).toBe('function')
    expect(typeof result.current.handleDelete).toBe('function')
    expect(typeof result.current.handleTogglePin).toBe('function')
    expect(typeof result.current.setTitle).toBe('function')
    expect(typeof result.current.setContent).toBe('function')
    expect(typeof result.current.setVisibilityField).toBe('function')
    expect(typeof result.current.setIsPinnedField).toBe('function')
    expect(typeof result.current.setProjectId).toBe('function')
    expect(typeof result.current.toggleTarget).toBe('function')
    expect(typeof result.current.isValid).toBe('boolean')
    expect(typeof result.current.canManage).toBe('boolean')
  })

  it('validates form - empty title and content', () => {
    const { result } = renderHook(
      () => useAnnouncementPage('test-ws'),
      { wrapper: createWrapper() }
    )

    expect(result.current.isValid).toBe(false)
  })

  it('validates form - has title and content', () => {
    const { result } = renderHook(
      () => useAnnouncementPage('test-ws'),
      { wrapper: createWrapper() }
    )

    act(() => result.current.setTitle('Test Title'))
    act(() => result.current.setContent('Test Content'))

    expect(result.current.isValid).toBe(true)
  })
})

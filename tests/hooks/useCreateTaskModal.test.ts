import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useCreateTaskModal } from '@/hooks/useCreateTaskModal'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'ws-slug' }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useCreateTaskModal', () => {
  const onClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default form data', () => {
    const { result } = renderHook(
      () => useCreateTaskModal({ projectId: 'proj-1', onClose }),
      { wrapper: createWrapper() }
    )

    expect(result.current.formData.title).toBe('')
    expect(result.current.formData.priority).toBe('MEDIUM')
    expect(result.current.formData.status).toBe('TODO')
    expect(result.current.formData.assigneeIds).toEqual([])
    expect(result.current.formData.labelIds).toEqual([])
    expect(result.current.errors).toEqual({})
  })

  it('updates a field', () => {
    const { result } = renderHook(
      () => useCreateTaskModal({ projectId: 'proj-1', onClose }),
      { wrapper: createWrapper() }
    )

    act(() => result.current.updateField('title', 'New Task'))

    expect(result.current.formData.title).toBe('New Task')
  })

  it('clears field error when field is updated', () => {
    const { result } = renderHook(
      () => useCreateTaskModal({ projectId: 'proj-1', onClose }),
      { wrapper: createWrapper() }
    )

    // Trigger validation error
    act(() => result.current.handleSubmit())
    expect(result.current.errors.title).toBe('Task title is required')

    // Update field clears error
    act(() => result.current.updateField('title', 'New Task'))
    expect(result.current.errors.title).toBeUndefined()
  })

  it('validates title is required', () => {
    const { result } = renderHook(
      () => useCreateTaskModal({ projectId: 'proj-1', onClose }),
      { wrapper: createWrapper() }
    )

    act(() => result.current.handleSubmit())

    expect(result.current.errors.title).toBe('Task title is required')
  })

  it('toggles assignee on', () => {
    const { result } = renderHook(
      () => useCreateTaskModal({ projectId: 'proj-1', onClose }),
      { wrapper: createWrapper() }
    )

    act(() => result.current.toggleAssignee('user-1'))

    expect(result.current.formData.assigneeIds).toContain('user-1')
  })

  it('toggles assignee off', () => {
    const { result } = renderHook(
      () => useCreateTaskModal({ projectId: 'proj-1', onClose }),
      { wrapper: createWrapper() }
    )

    act(() => result.current.toggleAssignee('user-1'))
    act(() => result.current.toggleAssignee('user-1'))

    expect(result.current.formData.assigneeIds).not.toContain('user-1')
  })

  it('toggles multiple assignees', () => {
    const { result } = renderHook(
      () => useCreateTaskModal({ projectId: 'proj-1', onClose }),
      { wrapper: createWrapper() }
    )

    act(() => result.current.toggleAssignee('user-1'))
    act(() => result.current.toggleAssignee('user-2'))

    expect(result.current.formData.assigneeIds).toEqual(['user-1', 'user-2'])
  })

  it('exposes isSubmitting from createTask mutation', () => {
    const { result } = renderHook(
      () => useCreateTaskModal({ projectId: 'proj-1', onClose }),
      { wrapper: createWrapper() }
    )

    expect(result.current.isSubmitting).toBe(false)
  })
})

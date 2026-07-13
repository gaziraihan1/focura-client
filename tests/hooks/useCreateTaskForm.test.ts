import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useCreateTaskForm } from '@/hooks/useCreateTaskForm'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'ws-slug' }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useCreateTaskForm', () => {
  const onSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default form data', () => {
    const { result } = renderHook(
      () => useCreateTaskForm({ projectId: 'proj-1', onSuccess }),
      { wrapper: createWrapper() }
    )

    expect(result.current.formData.title).toBe('')
    expect(result.current.formData.priority).toBe('MEDIUM')
    expect(result.current.formData.status).toBe('TODO')
    expect(result.current.formData.assigneeIds).toEqual([])
    expect(result.current.errors).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })

  it('updates a field', () => {
    const { result } = renderHook(
      () => useCreateTaskForm({ projectId: 'proj-1', onSuccess }),
      { wrapper: createWrapper() }
    )

    act(() => result.current.updateField('title', 'New Task'))

    expect(result.current.formData.title).toBe('New Task')
  })

  it('validates title is required', () => {
    const { result } = renderHook(
      () => useCreateTaskForm({ projectId: 'proj-1', onSuccess }),
      { wrapper: createWrapper() }
    )

    act(() => result.current.handleSubmit())

    expect(result.current.errors.title).toBe('Task title is required')
  })

  it('toggles assignee on', () => {
    const { result } = renderHook(
      () => useCreateTaskForm({ projectId: 'proj-1', onSuccess }),
      { wrapper: createWrapper() }
    )

    act(() => result.current.toggleAssignee('user-1'))

    expect(result.current.formData.assigneeIds).toContain('user-1')
  })

  it('toggles assignee off', () => {
    const { result } = renderHook(
      () => useCreateTaskForm({ projectId: 'proj-1', onSuccess }),
      { wrapper: createWrapper() }
    )

    act(() => result.current.toggleAssignee('user-1'))
    act(() => result.current.toggleAssignee('user-1'))

    expect(result.current.formData.assigneeIds).not.toContain('user-1')
  })

  it('validates only title is required', () => {
    const { result } = renderHook(
      () => useCreateTaskForm({ projectId: 'proj-1', onSuccess }),
      { wrapper: createWrapper() }
    )

    act(() => result.current.handleSubmit())
    expect(result.current.errors.title).toBe('Task title is required')

    // After providing title, validation passes
    act(() => result.current.updateField('title', 'Valid Title'))
    act(() => result.current.handleSubmit())
    expect(result.current.errors.title).toBeUndefined()
  })
})

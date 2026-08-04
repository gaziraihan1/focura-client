import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useCreateTaskModal } from '@/hooks/useCreateTaskModal'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'ws-slug' }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

vi.mock('@/hooks/useProjectFeatures', () => ({
  useProjectSections: vi.fn(() => ({
    data: [
      { id: 'sec-1', name: 'Frontend', status: 'ACTIVE', position: 0, projectId: 'proj-1', taskStatus: 'IN_PROGRESS' },
    ],
    isLoading: false,
  })),
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

  it('exposes the project sections for the section picker', () => {
    const { result } = renderHook(
      () => useCreateTaskModal({ projectId: 'proj-1', onClose }),
      { wrapper: createWrapper() }
    )

    expect(result.current.sections).toEqual([
      expect.objectContaining({ id: 'sec-1', name: 'Frontend' }),
    ])
    expect(result.current.sectionId).toBe('')
  })

  it('updates sectionId', () => {
    const { result } = renderHook(
      () => useCreateTaskModal({ projectId: 'proj-1', onClose }),
      { wrapper: createWrapper() }
    )

    act(() => result.current.setSectionId('sec-1'))

    expect(result.current.sectionId).toBe('sec-1')
  })

  it('includes sectionId in the create payload', async () => {
    let captured: Record<string, unknown> | undefined
    server.use(
      http.post('*/api/v1/tasks', async ({ request }) => {
        captured = (await request.json()) as Record<string, unknown>
        return HttpResponse.json({ success: true, data: { id: 't1' } })
      })
    )

    const { result } = renderHook(
      () => useCreateTaskModal({ projectId: 'proj-1', onClose }),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.updateField('title', 'New Task')
      result.current.setSectionId('sec-1')
    })
    act(() => result.current.handleSubmit())

    await waitFor(() => expect(onClose).toHaveBeenCalled())
    expect(captured).toMatchObject({ title: 'New Task', sectionId: 'sec-1', projectId: 'proj-1' })
  })

  it('omits sectionId when none is selected', async () => {
    let captured: Record<string, unknown> | undefined
    server.use(
      http.post('*/api/v1/tasks', async ({ request }) => {
        captured = (await request.json()) as Record<string, unknown>
        return HttpResponse.json({ success: true, data: { id: 't1' } })
      })
    )

    const { result } = renderHook(
      () => useCreateTaskModal({ projectId: 'proj-1', onClose }),
      { wrapper: createWrapper() }
    )

    act(() => result.current.updateField('title', 'New Task'))
    act(() => result.current.handleSubmit())

    await waitFor(() => expect(onClose).toHaveBeenCalled())
    expect(captured?.sectionId).toBeUndefined()
  })
})

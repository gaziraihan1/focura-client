import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createWrapper } from '../utils/renderWithProviders'
import { useTaskDetailsController } from '@/hooks/useTaskDetailsController'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

describe('useTaskDetailsController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(
      () => useTaskDetailsController('task-1', 'test-ws'),
      { wrapper: createWrapper() }
    )

    expect(result.current.isEditing).toBe(false)
    expect(result.current.editData.title).toBe('')
    expect(result.current.comments).toEqual([])
    expect(result.current.attachments).toEqual([])
  })

  it('exposes handlers object', () => {
    const { result } = renderHook(
      () => useTaskDetailsController('task-1', 'test-ws'),
      { wrapper: createWrapper() }
    )

    expect(typeof result.current.handlers.handleEditClick).toBe('function')
    expect(typeof result.current.handlers.handleSaveEdit).toBe('function')
    expect(typeof result.current.handlers.handleDelete).toBe('function')
    expect(typeof result.current.handlers.handleStatusChange).toBe('function')
    expect(typeof result.current.handlers.handleAddComment).toBe('function')
  })

  it('exposes mutations object', () => {
    const { result } = renderHook(
      () => useTaskDetailsController('task-1', 'test-ws'),
      { wrapper: createWrapper() }
    )

    expect(result.current.mutations).toBeDefined()
    expect(typeof result.current.mutations.addComment).toBe('object')
    expect(typeof result.current.mutations.updateComment).toBe('object')
    expect(typeof result.current.mutations.deleteComment).toBe('object')
    expect(typeof result.current.mutations.uploadAttachment).toBe('object')
    expect(typeof result.current.mutations.deleteAttachment).toBe('object')
    expect(typeof result.current.mutations.updateTask).toBe('object')
    expect(typeof result.current.mutations.deleteTask).toBe('object')
    expect(typeof result.current.mutations.updateStatus).toBe('object')
  })

  it('exposes permissions', () => {
    const { result } = renderHook(
      () => useTaskDetailsController('task-1', 'test-ws'),
      { wrapper: createWrapper() }
    )

    expect(result.current.permissions).toBeDefined()
    expect(typeof result.current.permissions.canEdit).toBe('boolean')
    expect(typeof result.current.permissions.canDelete).toBe('boolean')
    expect(typeof result.current.permissions.canChangeStatus).toBe('boolean')
    expect(typeof result.current.permissions.canComment).toBe('boolean')
  })

  it('allows setting edit data', () => {
    const { result } = renderHook(
      () => useTaskDetailsController('task-1', 'test-ws'),
      { wrapper: createWrapper() }
    )

    // The setEditData function should be available
    expect(typeof result.current.setEditData).toBe('function')
  })

  it('allows toggling isEditing', () => {
    const { result } = renderHook(
      () => useTaskDetailsController('task-1', 'test-ws'),
      { wrapper: createWrapper() }
    )

    // The setIsEditing function should be available
    expect(typeof result.current.setIsEditing).toBe('function')
  })
})

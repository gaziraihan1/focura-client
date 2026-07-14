import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'

import { useWorkspaceNewTaskPage } from '@/hooks/useWorkspaceNewTaskPage'

describe('useWorkspaceNewTaskPage', () => {
  it('loads workspace, projects, and members', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewTaskPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.workspaceLoading).toBe(false))

    expect(result.current.workspace?.id).toBe('ws-1')
    expect(result.current.workspace?.slug).toBe('test-ws')
    expect(result.current.projects).toBeDefined()
    expect(result.current.members).toBeDefined()
  })

  it('initializes with default form data', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewTaskPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.workspaceLoading).toBe(false))

    expect(result.current.formData.title).toBe('')
    expect(result.current.formData.status).toBe('TODO')
    expect(result.current.formData.priority).toBe('MEDIUM')
    expect(result.current.formData.intent).toBe('EXECUTION')
    expect(result.current.formData.assigneeIds).toEqual([])
    expect(result.current.formData.labelIds).toEqual([])
    expect(result.current.currentUserId).toBe('user-1')
  })

  it('validates required title field', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewTaskPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.workspaceLoading).toBe(false))

    expect(result.current.errors).toEqual({})

    const mockEvent = { preventDefault: () => {} } as React.FormEvent
    await act(async () => {
      result.current.handleSubmit(mockEvent)
    })

    expect(result.current.errors.title).toBe('Task title is required')
  })

  it('validates required project field', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewTaskPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.workspaceLoading).toBe(false))

    const mockEvent = { preventDefault: () => {} } as React.FormEvent
    await act(async () => {
      result.current.handleSubmit(mockEvent)
    })

    expect(result.current.errors.projectId).toBe('Select a project')
  })

  it('validates date range', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewTaskPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.workspaceLoading).toBe(false))

    act(() => result.current.setFormData((prev) => ({
      ...prev,
      startDate: '2024-06-15',
      dueDate: '2024-06-01',
    })))

    const mockEvent = { preventDefault: () => {} } as React.FormEvent
    await act(async () => {
      result.current.handleSubmit(mockEvent)
    })

    expect(result.current.errors.dueDate).toBe('Invalid date range')
  })

  it('updates form data fields', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewTaskPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.workspaceLoading).toBe(false))

    act(() => result.current.setFormData((prev) => ({ ...prev, title: 'New Task' })))

    expect(result.current.formData.title).toBe('New Task')
  })

  it('toggles assignee selection', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewTaskPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.workspaceLoading).toBe(false))

    act(() => result.current.toggleAssignee('user-2'))
    expect(result.current.formData.assigneeIds).toContain('user-2')

    act(() => result.current.toggleAssignee('user-2'))
    expect(result.current.formData.assigneeIds).not.toContain('user-2')
  })

  it('shows and hides label manager', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewTaskPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.workspaceLoading).toBe(false))

    expect(result.current.showLabelManager).toBe(false)

    act(() => result.current.setShowLabelManager(true))
    expect(result.current.showLabelManager).toBe(true)

    act(() => result.current.setShowLabelManager(false))
    expect(result.current.showLabelManager).toBe(false)
  })

  it('submits a valid task creation form', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewTaskPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.workspaceLoading).toBe(false))

    act(() => result.current.setFormData((prev) => ({
      ...prev,
      title: 'Test Task',
      projectId: 'project-1',
      dueDate: '2024-07-01',
    })))

    const mockEvent = { preventDefault: () => {} } as React.FormEvent
    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })
  })
})

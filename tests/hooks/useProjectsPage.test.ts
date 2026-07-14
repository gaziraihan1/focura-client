import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'

import {
  useProjectsPage,
  useWorkspaceNewProjectPage,
  useWorkspaceProjectsPage,
} from '@/hooks/useProjectsPage'

describe('useProjectsPage', () => {
  it('loads all user projects', async () => {
    const { result } = renderHook(
      () => useProjectsPage(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.projects).toBeDefined()
    expect(result.current.workspaces).toBeDefined()
    expect(result.current.stats).toBeDefined()
  })

  it('computes project stats', async () => {
    const { result } = renderHook(
      () => useProjectsPage(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.stats.total).toBeGreaterThanOrEqual(0)
    expect(result.current.stats.active).toBeGreaterThanOrEqual(0)
    expect(result.current.stats.completed).toBeGreaterThanOrEqual(0)
  })

  it('filters projects by search query', async () => {
    const { result } = renderHook(
      () => useProjectsPage(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.setSearchQuery('Test'))
    expect(result.current.searchQuery).toBe('Test')
    expect(result.current.hasSearchOrFilters).toBe(true)
  })

  it('toggles view mode', async () => {
    const { result } = renderHook(
      () => useProjectsPage(),
      { wrapper: createWrapper() }
    )

    expect(result.current.viewMode).toBe('grid')

    act(() => result.current.setViewMode('list'))
    expect(result.current.viewMode).toBe('list')
  })

  it('toggles filter panel', async () => {
    const { result } = renderHook(
      () => useProjectsPage(),
      { wrapper: createWrapper() }
    )

    expect(result.current.showFilters).toBe(false)

    act(() => result.current.setShowFilters(true))
    expect(result.current.showFilters).toBe(true)
  })

  it('updates filters', async () => {
    const { result } = renderHook(
      () => useProjectsPage(),
      { wrapper: createWrapper() }
    )

    act(() => result.current.setFilters({ status: 'ACTIVE', priority: 'all', workspace: 'all' }))
    expect(result.current.filters.status).toBe('ACTIVE')
  })

  it('handles access denied modal', async () => {
    const { result } = renderHook(
      () => useProjectsPage(),
      { wrapper: createWrapper() }
    )

    expect(result.current.showAccessDeniedModal).toBe(false)

    act(() => result.current.handleCloseAccessDeniedModal())
    expect(result.current.showAccessDeniedModal).toBe(false)
  })

  it('checks project access for the current user', async () => {
    const { result } = renderHook(
      () => useProjectsPage(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const project = result.current.projects[0]
    if (project) {
      const hasAccess = result.current.checkProjectAccess(project)
      expect(typeof hasAccess).toBe('boolean')
    }
  })
})

describe('useWorkspaceNewProjectPage', () => {
  it('initializes with default form values', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewProjectPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.form.name).toBe('')
    expect(result.current.form.status).toBe('ACTIVE')
    expect(result.current.form.priority).toBe('MEDIUM')
    expect(result.current.form.color).toBe('#667eea')
    expect(result.current.errors).toEqual({})
  })

  it('loads workspace data', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewProjectPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.workspace?.id).toBe('ws-1')
    expect(result.current.workspaceSlug).toBe('test-ws')
  })

  it('validates required name', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewProjectPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const mockEvent = { preventDefault: () => {} } as React.FormEvent
    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })

    expect(result.current.errors.name).toBe('Name is required')
  })

  it('validates name length', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewProjectPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.updateField('name', 'a'.repeat(101)))

    const mockEvent = { preventDefault: () => {} } as React.FormEvent
    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })

    expect(result.current.errors.name).toBe('Name must be <= 100 characters')
  })

  it('validates hex color', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewProjectPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.updateField('name', 'Valid Name'))
    act(() => result.current.updateField('color', 'invalid'))

    const mockEvent = { preventDefault: () => {} } as React.FormEvent
    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })

    expect(result.current.errors.color).toBe('Use hex color like #667eea')
  })

  it('validates date range', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewProjectPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.updateField('name', 'Valid Project'))
    act(() => result.current.updateField('startDate', '2024-06-15'))
    act(() => result.current.updateField('dueDate', '2024-06-01'))

    const mockEvent = { preventDefault: () => {} } as React.FormEvent
    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })

    expect(result.current.errors.dueDate).toBe('Due date must be after start date')
  })

  it('updates form fields and clears errors', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewProjectPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.updateField('name', '  '))
    const mockEvent = { preventDefault: () => {} } as React.FormEvent
    await act(async () => { await result.current.handleSubmit(mockEvent) })
    expect(result.current.errors.name).toBe('Name is required')

    act(() => result.current.updateField('name', 'My Project'))
    expect(result.current.errors.name).toBeUndefined()
  })

  it('submits valid form', async () => {
    const { result } = renderHook(
      () => useWorkspaceNewProjectPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.updateField('name', 'My Project'))
    act(() => result.current.updateField('description', 'A great project'))

    const mockEvent = { preventDefault: () => {} } as React.FormEvent
    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })
  })
})

describe('useWorkspaceProjectsPage', () => {
  it('loads workspace and projects', async () => {
    const { result } = renderHook(
      () => useWorkspaceProjectsPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.workspace?.id).toBe('ws-1')
    expect(result.current.projects).toBeDefined()
    expect(result.current.workspaceSlug).toBe('test-ws')
  })

  it('filters projects by search query', async () => {
    const { result } = renderHook(
      () => useWorkspaceProjectsPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.setSearchQuery('Test'))
    expect(result.current.searchQuery).toBe('Test')
  })

  it('provides permissions info', async () => {
    const { result } = renderHook(
      () => useWorkspaceProjectsPage({ workspaceSlug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.canCreateProjects).toBeDefined()
    expect(typeof result.current.canCreateProjects).toBe('boolean')
    expect(result.current.currentUserId).toBe('user-1')
  })
})

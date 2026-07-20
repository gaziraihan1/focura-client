import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { server } from '../mock/server'
import { http, HttpResponse } from 'msw'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const ok = (data: any) => HttpResponse.json({ success: true, data })

import { useWorkspaceLayout, useWorkspaceDetailPage } from '@/hooks/useWorkspaceLayout'

describe('useWorkspaceLayout', () => {
  it('loads workspace and provides navigation', async () => {
    const { result } = renderHook(
      () => useWorkspaceLayout({ slug: 'test-ws', pathname: '/dashboard/workspaces/test-ws', isFree: true }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.workspace?.id).toBe('ws-1')
    expect(result.current.workspace?.slug).toBe('test-ws')
    expect(result.current.isMember).toBe(true)
    expect(result.current.navigation.length).toBeGreaterThan(0)
  })

  it('includes overview nav item by default', async () => {
    const { result } = renderHook(
      () => useWorkspaceLayout({ slug: 'test-ws', pathname: '/dashboard/workspaces/test-ws', isFree: true }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const overview = result.current.navigation.find((n: Record<string, unknown>) => n.name === 'Overview')
    expect(overview).toBeDefined()
    expect(overview?.href).toContain('test-ws')
  })

  it('includes member-only items for workspace members', async () => {
    const { result } = renderHook(
      () => useWorkspaceLayout({ slug: 'test-ws', pathname: '/dashboard/workspaces/test-ws', isFree: true }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const tasks = result.current.navigation.find((n: Record<string, unknown>) => n.name === 'Tasks')
    expect(tasks).toBeDefined()
    expect(tasks.children).toHaveLength(3)
  })

  it('manages sidebar open state', async () => {
    const { result } = renderHook(
      () => useWorkspaceLayout({ slug: 'test-ws', pathname: '/dashboard/workspaces/test-ws', isFree: true }),
      { wrapper: createWrapper() }
    )

    expect(result.current.sidebarOpen).toBe(false)

    act(() => result.current.setSidebarOpen(true))
    expect(result.current.sidebarOpen).toBe(true)

    act(() => result.current.setSidebarOpen(false))
    expect(result.current.sidebarOpen).toBe(false)
  })

  it('manages workspace switcher open state', async () => {
    const { result } = renderHook(
      () => useWorkspaceLayout({ slug: 'test-ws', pathname: '/dashboard/workspaces/test-ws', isFree: true }),
      { wrapper: createWrapper() }
    )

    expect(result.current.switcherOpen).toBe(false)

    act(() => result.current.setSwitcherOpen(true))
    expect(result.current.switcherOpen).toBe(true)
  })

  it('provides all workspaces list', async () => {
    const { result } = renderHook(
      () => useWorkspaceLayout({ slug: 'test-ws', pathname: '/dashboard/workspaces/test-ws', isFree: true }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.allWorkspaces).toBeDefined()
    expect(result.current.allWorkspaces.length).toBeGreaterThan(0)
  })

  it('provides session info', async () => {
    const { result } = renderHook(
      () => useWorkspaceLayout({ slug: 'test-ws', pathname: '/dashboard/workspaces/test-ws', isFree: true }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.session?.user?.id).toBe('user-1')
  })
})

describe('useWorkspaceDetailPage', () => {
  it('loads workspace overview with overview endpoint', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/:slug/overview`, () =>
        ok({
          workspace: {
            id: 'ws-1', name: 'Test Workspace', slug: 'test-ws', plan: 'FREE',
            ownerId: 'user-1', isPublic: false, allowInvites: true,
            maxMembers: 5, maxStorage: 1000,
            createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z',
            owner: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
            members: [{
              id: 'member-1', role: 'OWNER', joinedAt: '2024-01-01T00:00:00.000Z',
              userId: 'user-1',
              user: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
            }],
            _count: { projects: 2, members: 1 },
          },
          stats: { totalProjects: 2, totalTasks: 10, totalMembers: 1, completedTasks: 4, overdueTasks: 1, completionRate: 40 },
          projects: [],
        })
      )
    )

    const { result } = renderHook(
      () => useWorkspaceDetailPage({ slug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.workspace?.id).toBe('ws-1')
    expect(result.current.members).toHaveLength(1)
    expect(result.current.isLoading).toBe(false)
  })

  it('provides admin and owner info', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/:slug/overview`, () =>
        ok({
          workspace: {
            id: 'ws-1', name: 'Test Workspace', slug: 'test-ws', plan: 'FREE',
            ownerId: 'user-1', isPublic: false, allowInvites: true,
            maxMembers: 5, maxStorage: 1000,
            createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z',
            owner: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
            members: [],
            _count: { projects: 2, members: 1 },
          },
          stats: { totalProjects: 2, totalTasks: 10, totalMembers: 1, completedTasks: 4, overdueTasks: 1, completionRate: 40 },
          projects: [],
        })
      )
    )

    const { result } = renderHook(
      () => useWorkspaceDetailPage({ slug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isAdmin).toBeDefined()
    expect(result.current.isOwner).toBeDefined()
    expect(result.current.canCreateProjects).toBeDefined()
  })

  it('manages active tab state', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/:slug/overview`, () =>
        ok({
          workspace: {
            id: 'ws-1', name: 'Test Workspace', slug: 'test-ws', plan: 'FREE',
            ownerId: 'user-1', isPublic: false, allowInvites: true,
            maxMembers: 5, maxStorage: 1000,
            createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z',
            owner: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
            members: [],
            _count: { projects: 2, members: 1 },
          },
          stats: { totalProjects: 2, totalTasks: 10, totalMembers: 1, completedTasks: 4, overdueTasks: 1, completionRate: 40 },
          projects: [],
        })
      )
    )

    const { result } = renderHook(
      () => useWorkspaceDetailPage({ slug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.activeTab).toBe('overview')

    act(() => result.current.setActiveTab('projects'))
    expect(result.current.activeTab).toBe('projects')
  })

  it('manages invite modal state', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/:slug/overview`, () =>
        ok({
          workspace: {
            id: 'ws-1', name: 'Test Workspace', slug: 'test-ws', plan: 'FREE',
            ownerId: 'user-1', isPublic: false, allowInvites: true,
            maxMembers: 5, maxStorage: 1000,
            createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z',
            owner: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
            members: [],
            _count: { projects: 2, members: 1 },
          },
          stats: { totalProjects: 2, totalTasks: 10, totalMembers: 1, completedTasks: 4, overdueTasks: 1, completionRate: 40 },
          projects: [],
        })
      )
    )

    const { result } = renderHook(
      () => useWorkspaceDetailPage({ slug: 'test-ws' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.showInviteModal).toBe(false)

    act(() => result.current.handleInviteClick())
    expect(result.current.showInviteModal).toBe(true)

    act(() => result.current.handleInviteClose())
    expect(result.current.showInviteModal).toBe(false)
  })
})

// tests/hooks/useAdmin.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { server } from '../mock/server'
import { http, HttpResponse } from 'msw'
import { createWrapper } from '../utils/renderWithProviders'

import {
  useAdminStats,
  useAdminWorkspaces,
  useAdminWorkspaceDetail,
  useAdminUsers,
  useAdminUserDetail,
  useAdminProjects,
  useAdminBilling,
  useAdminActivity,
  useAdminPagination,
  useBanUser,
  useUnbanUser,
  useDeleteWorkspace,
  useRestoreWorkspace,
} from '@/hooks/useAdmin'


const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ── useAdminStats ─────────────────────────────────────────────────────────────

describe('useAdminStats', () => {
  it('fetches admin stats', async () => {
    const { result } = renderHook(() => useAdminStats(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.totals.users).toBe(42)
    expect(result.current.data?.totals.workspaces).toBe(10)
    expect(result.current.data?.totalStorageUsedMb).toBe(512)
  })

  it('returns feature request counts', async () => {
    const { result } = renderHook(() => useAdminStats(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.featureRequests.pending).toBe(4)
    expect(result.current.data?.featureRequests.approved).toBe(2)
  })

  it('returns recent signups and workspaces', async () => {
    const { result } = renderHook(() => useAdminStats(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.recentSignups).toHaveLength(1)
    expect(result.current.data?.recentSignups[0].id).toBe('user-1')
    expect(result.current.data?.recentWorkspaces).toHaveLength(1)
    expect(result.current.data?.recentWorkspaces[0].slug).toBe('test-ws')
  })

  it('enters error state when API fails', async () => {
    server.use(
      http.get(`${BASE}/api/v1/admin/stats`, () =>
        new HttpResponse(null, { status: 500 })
      )
    )

    const { result } = renderHook(() => useAdminStats(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useAdminWorkspaces ────────────────────────────────────────────────────────

describe('useAdminWorkspaces', () => {
  it('fetches paginated workspaces', async () => {
    const { result } = renderHook(
      () => useAdminWorkspaces({ page: 1, pageSize: 20 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data).toHaveLength(1)
    expect(result.current.data?.data[0].id).toBe('ws-1')
    expect(result.current.data?.data[0].slug).toBe('test-ws')
    expect(result.current.data?.pagination.totalCount).toBe(1)
  })

  it('returns correct workspace shape', async () => {
    const { result } = renderHook(
      () => useAdminWorkspaces({}),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const ws = result.current.data?.data[0]
    expect(ws).toHaveProperty('plan')
    expect(ws).toHaveProperty('maxMembers')
    expect(ws).toHaveProperty('usedStorageMb')
    expect(ws).toHaveProperty('_count')
    expect(ws?.owner.email).toBe('test@focura.com')
  })

  it('accepts a search param', async () => {
    const { result } = renderHook(
      () => useAdminWorkspaces({ search: 'test' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toBeDefined()
  })
})

// ── useAdminWorkspaceDetail ───────────────────────────────────────────────────

describe('useAdminWorkspaceDetail', () => {
  it('fetches workspace detail by slug', async () => {
    const { result } = renderHook(
      () => useAdminWorkspaceDetail('test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.id).toBe('ws-1')
    expect(result.current.data?.slug).toBe('test-ws')
    expect(result.current.data?.members).toHaveLength(1)
    expect(result.current.data?.projects).toHaveLength(1)
  })

  it('returns full _count shape', async () => {
    const { result } = renderHook(
      () => useAdminWorkspaceDetail('test-ws'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?._count.tasks).toBe(15)
    expect(result.current.data?._count.meetings).toBe(4)
  })

  it('is disabled when slug is empty', () => {
    const { result } = renderHook(
      () => useAdminWorkspaceDetail(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('enters error state for unknown slug', async () => {
    server.use(
      http.get(`${BASE}/api/v1/admin/workspaces/:slug`, () =>
        new HttpResponse(null, { status: 404 })
      )
    )

    const { result } = renderHook(
      () => useAdminWorkspaceDetail('not-found'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useAdminUsers ─────────────────────────────────────────────────────────────

describe('useAdminUsers', () => {
  it('fetches paginated users', async () => {
    const { result } = renderHook(
      () => useAdminUsers({ page: 1, pageSize: 20 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data).toHaveLength(1)
    expect(result.current.data?.data[0].id).toBe('user-1')
    expect(result.current.data?.data[0].role).toBe('USER')
  })

  it('returns correct _count shape', async () => {
    const { result } = renderHook(
      () => useAdminUsers({}),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const user = result.current.data?.data[0]
    expect(user?._count.ownedWorkspaces).toBe(1)
    expect(user?._count.createdTasks).toBe(10)
  })

  it('accepts a search param', async () => {
    const { result } = renderHook(
      () => useAdminUsers({ search: 'test' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toBeDefined()
  })
})

// ── useAdminUserDetail ────────────────────────────────────────────────────────

describe('useAdminUserDetail', () => {
  it('fetches user detail by id', async () => {
    const { result } = renderHook(
      () => useAdminUserDetail('user-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.id).toBe('user-1')
    expect(result.current.data?.email).toBe('test@focura.com')
    expect(result.current.data?.bannedAt).toBeNull()
  })

  it('returns task stats and storage', async () => {
    const { result } = renderHook(
      () => useAdminUserDetail('user-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.taskStats.total).toBe(10)
    expect(result.current.data?.storage.usedMb).toBe(64)
  })

  it('returns owned workspaces and memberships', async () => {
    const { result } = renderHook(
      () => useAdminUserDetail('user-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.ownedWorkspaces).toHaveLength(1)
    expect(result.current.data?.workspaceMemberships).toHaveLength(1)
  })

  it('is disabled when id is empty', () => {
    const { result } = renderHook(
      () => useAdminUserDetail(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ── useAdminProjects ──────────────────────────────────────────────────────────

describe('useAdminProjects', () => {
  it('fetches paginated projects', async () => {
    const { result } = renderHook(
      () => useAdminProjects({ page: 1, pageSize: 20 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data).toHaveLength(1)
    expect(result.current.data?.data[0].id).toBe('proj-1')
    expect(result.current.data?.data[0].status).toBe('ACTIVE')
  })

  it('returns task breakdown', async () => {
    const { result } = renderHook(
      () => useAdminProjects({}),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const proj = result.current.data?.data[0]
    expect(proj?.taskBreakdown.total).toBe(10)
    expect(proj?.taskBreakdown.completed).toBe(2)
  })

  it('accepts workspaceId filter', async () => {
    const { result } = renderHook(
      () => useAdminProjects({ workspaceId: 'ws-1' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toBeDefined()
  })
})

// ── useAdminBilling ───────────────────────────────────────────────────────────

describe('useAdminBilling', () => {
  it('fetches paginated billing records', async () => {
    const { result } = renderHook(
      () => useAdminBilling({ page: 1, pageSize: 20 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data).toHaveLength(1)
    expect(result.current.data?.data[0].subscriptionId).toBe('sub-1')
    expect(result.current.data?.data[0].status).toBe('ACTIVE')
  })

  it('returns plan and workspace info', async () => {
    const { result } = renderHook(
      () => useAdminBilling({}),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const billing = result.current.data?.data[0]
    expect(billing?.plan.name).toBe('PRO')
    expect(billing?.plan.monthlyPriceCents).toBe(1999)
    expect(billing?.workspace.slug).toBe('test-ws')
  })

  it('returns recent invoices', async () => {
    const { result } = renderHook(
      () => useAdminBilling({}),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const billing = result.current.data?.data[0]
    expect(billing?.recentInvoices).toHaveLength(1)
    expect(billing?.recentInvoices[0].status).toBe('paid')
  })
})

// ── useAdminActivity ──────────────────────────────────────────────────────────

describe('useAdminActivity', () => {
  it('fetches paginated activity logs', async () => {
    const { result } = renderHook(
      () => useAdminActivity({ page: 1, pageSize: 20 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data).toHaveLength(1)
    expect(result.current.data?.data[0].action).toBe('TASK_CREATED')
    expect(result.current.data?.data[0].entityType).toBe('Task')
  })

  it('returns user and workspace on activity', async () => {
    const { result } = renderHook(
      () => useAdminActivity({}),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const activity = result.current.data?.data[0]
    expect(activity?.user.id).toBe('user-1')
    expect(activity?.workspace?.slug).toBe('test-ws')
  })
})

// ── useAdminPagination ────────────────────────────────────────────────────────

describe('useAdminPagination', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useAdminPagination(), {
      wrapper: createWrapper(),
    })

    expect(result.current.page).toBe(1)
    expect(result.current.search).toBe('')
    expect(result.current.pageSize).toBe(20)
  })

  it('initializes with custom page size', () => {
    const { result } = renderHook(() => useAdminPagination(50), {
      wrapper: createWrapper(),
    })

    expect(result.current.pageSize).toBe(50)
  })

  it('updates page', () => {
    const { result } = renderHook(() => useAdminPagination(), {
      wrapper: createWrapper(),
    })

    act(() => result.current.setPage(3))

    expect(result.current.page).toBe(3)
  })

  it('handleSearch updates search and resets page to 1', () => {
    const { result } = renderHook(() => useAdminPagination(), {
      wrapper: createWrapper(),
    })

    act(() => result.current.setPage(5))
    act(() => result.current.handleSearch('test query'))

    expect(result.current.search).toBe('test query')
    expect(result.current.page).toBe(1)
  })

  it('reset clears search and resets page', () => {
    const { result } = renderHook(() => useAdminPagination(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setPage(4)
      result.current.handleSearch('something')
    })
    act(() => result.current.reset())

    expect(result.current.page).toBe(1)
    expect(result.current.search).toBe('')
  })
})

// ── useBanUser ────────────────────────────────────────────────────────────────

describe('useBanUser', () => {
  it('bans a user successfully', async () => {
    const { result } = renderHook(() => useBanUser(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ id: 'user-1', reason: 'Violation of ToS' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.success).toBe(true)
    expect(result.current.data?.message).toBe('User banned successfully')
  })

  it('enters error state when ban fails', async () => {
    server.use(
      http.patch(`${BASE}/api/v1/admin/users/:id/ban`, () =>
        new HttpResponse(null, { status: 403 })
      )
    )

    const { result } = renderHook(() => useBanUser(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ id: 'user-1', reason: 'reason' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useUnbanUser ──────────────────────────────────────────────────────────────

describe('useUnbanUser', () => {
  it('unbans a user successfully', async () => {
    const { result } = renderHook(() => useUnbanUser(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate('user-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.success).toBe(true)
    expect(result.current.data?.message).toBe('User unbanned successfully')
  })
})

// ── useDeleteWorkspace ────────────────────────────────────────────────────────

describe('useDeleteWorkspace', () => {
  it('soft-deletes a workspace', async () => {
    const { result } = renderHook(() => useDeleteWorkspace(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({
        slug: 'test-ws',
        reason: 'Requested by owner',
        hardDelete: false,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.success).toBe(true)
  })

  it('hard-deletes a workspace', async () => {
    const { result } = renderHook(() => useDeleteWorkspace(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ slug: 'test-ws', hardDelete: true })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.message).toBe('Workspace deleted successfully')
  })

  it('enters error state when delete fails', async () => {
    server.use(
      http.post(`${BASE}/api/v1/admin/workspaces/:slug/delete`, () =>
        new HttpResponse(null, { status: 403 })
      )
    )

    const { result } = renderHook(() => useDeleteWorkspace(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate({ slug: 'test-ws', hardDelete: false })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

// ── useRestoreWorkspace ───────────────────────────────────────────────────────

describe('useRestoreWorkspace', () => {
  it('restores a soft-deleted workspace', async () => {
    const { result } = renderHook(() => useRestoreWorkspace(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate('test-ws')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.success).toBe(true)
    expect(result.current.data?.message).toBe('Workspace restored successfully')
  })

  it('enters error state when restore fails', async () => {
    server.use(
      http.patch(`${BASE}/api/v1/admin/workspaces/:slug/restore`, () =>
        new HttpResponse(null, { status: 403 })
      )
    )

    const { result } = renderHook(() => useRestoreWorkspace(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.mutate('test-ws')
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
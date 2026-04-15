// tests/hooks/useWorkspace.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import {
  useWorkspaces,
  useWorkspace,
  useWorkspaceMembers,
  useWorkspaceStats,
  useWorkspaceStorage,
  useWorkspacePlan,
  useWorkspaceRole,
} from '@/hooks/useWorkspace'
import { mockWorkspace, mockMember } from '../mock/handlers/workspace.handlers'

// ─── useWorkspaces ────────────────────────────────────────────────────────────

describe('useWorkspaces', () => {
  it('returns list of workspaces', async () => {
    const { result } = renderHook(() => useWorkspaces(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].slug).toBe('test-ws')
  })

  it('returns data with correct shape', async () => {
    const { result } = renderHook(() => useWorkspaces(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const ws = result.current.data?.[0]
    expect(ws).toHaveProperty('id')
    expect(ws).toHaveProperty('slug')
    expect(ws).toHaveProperty('plan')
    expect(ws).toHaveProperty('members')
    expect(ws).toHaveProperty('_count')
  })
})

// ─── useWorkspace ─────────────────────────────────────────────────────────────

describe('useWorkspace', () => {
  it('fetches workspace by slug', async () => {
    const { result } = renderHook(() => useWorkspace('test-ws'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe('Test Workspace')
    expect(result.current.data?.slug).toBe('test-ws')
  })

  it('is disabled when slug is empty string', () => {
    const { result } = renderHook(() => useWorkspace(''), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useWorkspaceMembers ──────────────────────────────────────────────────────

describe('useWorkspaceMembers', () => {
  it('fetches members for a workspace', async () => {
    const { result } = renderHook(() => useWorkspaceMembers('ws-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.[0].role).toBe('OWNER')
    expect(result.current.data?.[0].user.email).toBe('test@focura.com')
  })

  it('is disabled when workspaceId is undefined', () => {
    const { result } = renderHook(() => useWorkspaceMembers(undefined), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useWorkspaceStats ────────────────────────────────────────────────────────

describe('useWorkspaceStats', () => {
  it('fetches workspace stats', async () => {
    const { result } = renderHook(() => useWorkspaceStats('ws-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.completionRate).toBe(40)
    expect(result.current.data?.overdueTasks).toBe(1)
  })
})

// ─── useWorkspaceStorage ──────────────────────────────────────────────────────

describe('useWorkspaceStorage', () => {
  it('fetches storage info', async () => {
    const { result } = renderHook(() => useWorkspaceStorage('ws-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.usedPct).toBe(50)
    expect(result.current.data?.isNearLimit).toBe(false)
    expect(result.current.data?.isFull).toBe(false)
  })

  it('is disabled when workspaceId is undefined', () => {
    const { result } = renderHook(() => useWorkspaceStorage(undefined), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useWorkspacePlan ─────────────────────────────────────────────────────────

describe('useWorkspacePlan', () => {
  it('correctly identifies FREE plan', async () => {
    const { result } = renderHook(() => useWorkspacePlan('test-ws'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isFree).toBe(true)
    expect(result.current.isPaid).toBe(false)
    expect(result.current.hasPlan('FREE')).toBe(true)
    expect(result.current.hasPlan('PRO')).toBe(false)
  })

  it('correctly identifies PRO plan', async () => {
    const { result } = renderHook(() => useWorkspacePlan('test-ws'), {
      wrapper: createWrapper({ defaultWorkspace: { ...mockWorkspace, plan: 'PRO' } }),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isPro).toBe(true)
    expect(result.current.isPaid).toBe(true)
  })
})

// ─── useWorkspaceRole ─────────────────────────────────────────────────────────

describe('useWorkspaceRole', () => {
  it('returns OWNER permissions for workspace owner', async () => {
    const { result } = renderHook(() => useWorkspaceRole('ws-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.role).toBe('OWNER')
    expect(result.current.isOwner).toBe(true)
    expect(result.current.canDeleteWorkspace).toBe(true)
    expect(result.current.canEditSettings).toBe(true)
    expect(result.current.hasAccess).toBe(true)
  })

  it('returns null role when workspaceId is not provided', () => {
    const { result } = renderHook(() => useWorkspaceRole(null), { wrapper: createWrapper() })

    expect(result.current.role).toBeNull()
    expect(result.current.hasAccess).toBe(false)
    expect(result.current.canViewContent).toBe(false)
  })

  it('returns GUEST permissions correctly', async () => {
    const guestMember = { ...mockMember, role: 'GUEST' as const }

    const { result } = renderHook(() => useWorkspaceRole('ws-1'), {
      wrapper: createWrapper({ defaultMembers: [guestMember] }),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isGuest).toBe(true)
    expect(result.current.canDeleteWorkspace).toBe(false)
    expect(result.current.canCreateProjects).toBe(false)
    expect(result.current.canViewContent).toBe(true)
  })
})
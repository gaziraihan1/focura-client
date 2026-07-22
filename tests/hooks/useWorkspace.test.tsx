import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { server } from '../mock/server'
import { http, HttpResponse } from 'msw'
import { createWrapper } from '../utils/renderWithProviders'
import {
  useWorkspaces,
  useWorkspace,
  useWorkspaceMembers,
  useWorkspaceStats,
  useWorkspaceStorage,
  useWorkspaceRole,
  useCreateWorkspace,
  useUpdateWorkspace,
  useDeleteWorkspace,
  useInviteMember,
  useRemoveMember,
  useUpdateMemberRole,
  useAcceptInvitation,
  useLeaveWorkspace,
  useWorkspaceOverview,
  useWorkspacePermission,
  useWorkspaceRoleCheck,
  useWorkspaceRoleFromWorkspace,
} from '@/hooks/useWorkspace'
import { useWorkspacePlan, WorkspacePlanProvider } from '@/context/workspacePlan/WorkspacePlanContext'
import { mockWorkspace } from '../mock/handlers/workspace.handlers'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

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
  })
})

describe('useWorkspace', () => {
  it('fetches workspace by slug', async () => {
    const { result } = renderHook(() => useWorkspace('test-ws'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe('Test Workspace')
  })

  it('is disabled when slug is empty', () => {
    const { result } = renderHook(() => useWorkspace(''), { wrapper: createWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })
})

describe('useWorkspaceOverview', () => {
  it('fetches overview and seeds caches', async () => {
    server.use(
      http.get(`${BASE}/api/v1/workspaces/:slug/overview`, () => 
        HttpResponse.json({ 
          success: true, 
          data: { 
            workspace: mockWorkspace, 
            stats: { totalProjects: 5, totalTasks: 20, totalMembers: 2, completedTasks: 10, overdueTasks: 2, completionRate: 50 },
            projects: [] 
          } 
        })
      )
    )

    const { result } = renderHook(() => useWorkspaceOverview('test-ws'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.workspace.name).toBe('Test Workspace')
  })
})

describe('useCreateWorkspace', () => {
  it('creates workspace and redirects', async () => {
    const { result } = renderHook(() => useCreateWorkspace(), { wrapper: createWrapper() })
    
    await act(async () => {
      result.current.mutate({ name: 'New WS' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe('New WS') // Mock returns merged input
  })
})

describe('useUpdateWorkspace', () => {
  it('updates workspace details', async () => {
    const { result } = renderHook(() => useUpdateWorkspace(), { wrapper: createWrapper() })
    
    await act(async () => {
      result.current.mutate({ id: 'ws-1', data: { name: 'Updated Name' } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useDeleteWorkspace', () => {
  it('deletes workspace', async () => {
    const { result } = renderHook(() => useDeleteWorkspace(), { wrapper: createWrapper() })
    
    await act(async () => {
      result.current.mutate('ws-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useWorkspaceMembers', () => {
  it('fetches members', async () => {
    const { result } = renderHook(() => useWorkspaceMembers('ws-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  })
})

describe('useInviteMember', () => {
  it('invites a member', async () => {
    const { result } = renderHook(() => useInviteMember(), { wrapper: createWrapper() })
    
    await act(async () => {
      result.current.mutate({ workspaceId: 'ws-1', email: 'new@test.com', role: 'MEMBER' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useRemoveMember', () => {
  it('removes a member', async () => {
    const { result } = renderHook(() => useRemoveMember(), { wrapper: createWrapper() })
    
    await act(async () => {
      result.current.mutate({ workspaceId: 'ws-1', memberId: 'member-1' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useUpdateMemberRole', () => {
  it('updates member role', async () => {
    const { result } = renderHook(() => useUpdateMemberRole(), { wrapper: createWrapper() })
    
    await act(async () => {
      result.current.mutate({ workspaceId: 'ws-1', memberId: 'member-1', role: 'ADMIN' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useAcceptInvitation', () => {
  it('accepts invitation', async () => {
    const { result } = renderHook(() => useAcceptInvitation(), { wrapper: createWrapper() })
    
    await act(async () => {
      result.current.mutate('token-123')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useLeaveWorkspace', () => {
  it('leaves workspace', async () => {
    const { result } = renderHook(() => useLeaveWorkspace(), { wrapper: createWrapper() })
    
    await act(async () => {
      result.current.mutate('ws-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useWorkspaceStats', () => {
  it('fetches stats', async () => {
    const { result } = renderHook(() => useWorkspaceStats('ws-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.completionRate).toBe(40)
  })
})

describe('useWorkspaceStorage', () => {
  it('fetches storage info', async () => {
    const { result } = renderHook(() => useWorkspaceStorage('ws-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.usedPct).toBe(50)
  })
})

describe('useWorkspacePlan', () => {
  it('identifies FREE plan', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => {
      const QueryWrapper = createWrapper()
      return (
        <QueryWrapper>
          <WorkspacePlanProvider slug="test-ws">{children}</WorkspacePlanProvider>
        </QueryWrapper>
      )
    }
    const { result } = renderHook(() => useWorkspacePlan(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isFree).toBe(true)
    expect(result.current.hasPlan('FREE')).toBe(true)
    expect(result.current.hasPlan('PRO')).toBe(false)
  })
})

describe('useWorkspaceRole', () => {
  it('returns OWNER permissions', async () => {
    const { result } = renderHook(() => useWorkspaceRole('ws-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.role).toBe('OWNER')
    expect(result.current.isOwner).toBe(true)
  })

  it('handles null / undefined workspaceId', () => {
    const { result } = renderHook(() => useWorkspaceRole(null), { wrapper: createWrapper() })
    expect(result.current.role).toBeNull()
    expect(result.current.isOwner).toBe(false)
  })
})

describe('useWorkspacePermission & useWorkspaceRoleCheck', () => {
  it('useWorkspacePermission returns correct permissions', async () => {
    const { result } = renderHook(() => useWorkspacePermission('ws-1', 'canEditSettings'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current).toBe(true))
  })

  it('useWorkspacePermission handles undefined permission', () => {
    const { result } = renderHook(() => useWorkspacePermission('ws-1', undefined as any), { wrapper: createWrapper() })
    expect(result.current).toBe(false)
  })

  it('useWorkspaceRoleCheck returns checks', async () => {
    const { result } = renderHook(() => useWorkspaceRoleCheck('ws-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isOwnerOrAdmin).toBe(true))
    expect(result.current.canManage).toBe(true)
  })
})

describe('useWorkspaceRoleFromWorkspace', () => {
  it('gets role from already fetched workspace', async () => {
    const { result } = renderHook(() => useWorkspaceRoleFromWorkspace('test-ws'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.role).toBe('OWNER')
    expect(result.current.isOwner).toBe(true)
  })

  it('handles missing workspace or slug gracefully', () => {
    const { result } = renderHook(() => useWorkspaceRoleFromWorkspace(''), { wrapper: createWrapper() })
    expect(result.current.role).toBeNull()
    expect(result.current.isOwner).toBe(false)
  })
})

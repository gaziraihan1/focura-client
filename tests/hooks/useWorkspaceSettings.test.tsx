import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useWorkspaceSettings } from '@/hooks/useWorkspaceSettings'

const mocks = vi.hoisted(() => {
  const workspace = {
    id: 'ws-1',
    name: 'Test Workspace',
    description: 'A test workspace',
    color: '#667eea',
    isPublic: false,
    allowInvites: true,
  }
  return {
    workspace,
    tab: null as string | null,
    confirmResult: true,
    members: [
      {
        id: 'm1',
        role: 'OWNER',
        user: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
      },
    ],
    update: vi.fn(),
    deleteWs: vi.fn(),
    invite: vi.fn(),
    remove: vi.fn(),
    updateRole: vi.fn(),
    leave: vi.fn(),
  }
})

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspace: () => ({ data: mocks.workspace }),
  useWorkspaceMembers: () => ({ data: mocks.members }),
  useUpdateWorkspace: () => ({ mutateAsync: mocks.update }),
  useDeleteWorkspace: () => ({ mutateAsync: mocks.deleteWs }),
  useInviteMember: () => ({ mutateAsync: mocks.invite }),
  useRemoveMember: () => ({ mutateAsync: mocks.remove }),
  useUpdateMemberRole: () => ({ mutateAsync: mocks.updateRole }),
  useLeaveWorkspace: () => ({ mutateAsync: mocks.leave }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useParams: () => ({}),
  usePathname: () => '/dashboard',
  useSearchParams: () =>
    new URLSearchParams(mocks.tab ? { tab: mocks.tab } : {}),
}))

function renderSettings(slug = 'test-ws') {
  return renderHook(() => useWorkspaceSettings({ slug }))
}

describe('useWorkspaceSettings', () => {
  beforeEach(() => {
    mocks.tab = null
    mocks.confirmResult = true
    mocks.update.mockClear()
    mocks.deleteWs.mockClear()
    mocks.invite.mockClear()
    mocks.remove.mockClear()
    mocks.updateRole.mockClear()
    mocks.leave.mockClear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('defaults to the general tab', () => {
    const { result } = renderSettings()
    expect(result.current.activeTab).toBe('general')
  })

  it('reads the active tab from the search params', () => {
    mocks.tab = 'members'
    const { result } = renderSettings()
    expect(result.current.activeTab).toBe('members')
  })

  it('falls back to general for an unknown tab param', () => {
    mocks.tab = 'bogus'
    const { result } = renderSettings()
    expect(result.current.activeTab).toBe('general')
  })

  it('derives owner/admin flags from the current member', () => {
    const { result } = renderSettings()
    expect(result.current.isOwner).toBe(true)
    expect(result.current.isAdmin).toBe(true)
  })

  it('seeds the form from the workspace', () => {
    const { result } = renderSettings()
    expect(result.current.formData.name).toBe('Test Workspace')
    expect(result.current.formData.allowInvites).toBe(true)
  })

  it('validates that the name is required', async () => {
    const { result } = renderSettings()

    act(() => {
      result.current.updateFormField('name', '')
    })

    await act(async () => {
      await result.current.handleSaveGeneral()
    })

    expect(result.current.errors.name).toBe('Workspace name is required')
    expect(mocks.update).not.toHaveBeenCalled()
  })

  it('validates the minimum name length', async () => {
    const { result } = renderSettings()

    act(() => {
      result.current.updateFormField('name', 'ab')
    })

    await act(async () => {
      await result.current.handleSaveGeneral()
    })

    expect(result.current.errors.name).toBe('Name must be at least 3 characters')
    expect(mocks.update).not.toHaveBeenCalled()
  })

  it('saves the workspace when the form is valid', async () => {
    mocks.update.mockResolvedValue(undefined)
    const { result } = renderSettings()

    act(() => {
      result.current.updateFormField('name', 'Renamed Workspace')
    })

    await act(async () => {
      await result.current.handleSaveGeneral()
    })

    expect(mocks.update).toHaveBeenCalledWith({
      id: 'ws-1',
      data: expect.objectContaining({ name: 'Renamed Workspace' }),
    })
    expect(result.current.errors).toEqual({})
  })

  it('updating a field clears its error', async () => {
    const { result } = renderSettings()

    // Trigger validation by attempting to save with an invalid name
    act(() => {
      result.current.updateFormField('name', '')
    })
    await act(async () => {
      await result.current.handleSaveGeneral()
    })
    expect(result.current.errors.name).toBe('Workspace name is required')

    // Fixing the field clears the error
    act(() => {
      result.current.updateFormField('name', 'Valid Name')
    })
    expect(result.current.errors.name).toBeUndefined()
  })

  it('invites a member and closes the modal', async () => {
    mocks.invite.mockResolvedValue(undefined)
    const { result } = renderSettings()

    act(() => {
      result.current.setInviteEmail('new@test.com')
      result.current.setInviteRole('ADMIN')
      result.current.setShowInviteModal(true)
    })

    await act(async () => {
      await result.current.handleInvite()
    })

    expect(mocks.invite).toHaveBeenCalledWith({
      workspaceId: 'ws-1',
      email: 'new@test.com',
      role: 'ADMIN',
    })
    expect(result.current.inviteEmail).toBe('')
    expect(result.current.showInviteModal).toBe(false)
  })

  it('does not invite without an email', async () => {
    const { result } = renderSettings()

    await act(async () => {
      await result.current.handleInvite()
    })

    expect(mocks.invite).not.toHaveBeenCalled()
  })

  it('removes a member after confirmation', async () => {
    mocks.remove.mockResolvedValue(undefined)
    vi.stubGlobal('confirm', vi.fn(() => true))
    const { result } = renderSettings()

    await act(async () => {
      await result.current.handleRemoveMember('m1')
    })

    expect(mocks.remove).toHaveBeenCalledWith({
      workspaceId: 'ws-1',
      memberId: 'm1',
    })
  })

  it('skips removal when confirmation is declined', async () => {
    vi.stubGlobal('confirm', vi.fn(() => false))
    const { result } = renderSettings()

    await act(async () => {
      await result.current.handleRemoveMember('m1')
    })

    expect(mocks.remove).not.toHaveBeenCalled()
  })

  it('updates a member role', async () => {
    mocks.updateRole.mockResolvedValue(undefined)
    const { result } = renderSettings()

    await act(async () => {
      await result.current.handleUpdateRole('m1', 'ADMIN')
    })

    expect(mocks.updateRole).toHaveBeenCalledWith({
      workspaceId: 'ws-1',
      memberId: 'm1',
      role: 'ADMIN',
    })
  })

  it('deletes the workspace', async () => {
    mocks.deleteWs.mockResolvedValue(undefined)
    const { result } = renderSettings()

    await act(async () => {
      await result.current.handleDelete()
    })

    expect(mocks.deleteWs).toHaveBeenCalledWith('ws-1')
  })

  it('leaves the workspace after confirmation', async () => {
    mocks.leave.mockResolvedValue(undefined)
    vi.stubGlobal('confirm', vi.fn(() => true))
    const { result } = renderSettings()

    await act(async () => {
      await result.current.handleLeave()
    })

    expect(mocks.leave).toHaveBeenCalledWith('ws-1')
  })

  it('skips leaving when confirmation is declined', async () => {
    vi.stubGlobal('confirm', vi.fn(() => false))
    const { result } = renderSettings()

    await act(async () => {
      await result.current.handleLeave()
    })

    expect(mocks.leave).not.toHaveBeenCalled()
  })

  it('exposes the mutation objects', () => {
    const { result } = renderSettings()
    expect(result.current.mutations.updateWorkspace).toBeDefined()
    expect(result.current.mutations.deleteWorkspace).toBeDefined()
    expect(result.current.mutations.inviteMember).toBeDefined()
    expect(result.current.mutations.removeMember).toBeDefined()
    expect(result.current.mutations.leaveWorkspace).toBeDefined()
  })
})

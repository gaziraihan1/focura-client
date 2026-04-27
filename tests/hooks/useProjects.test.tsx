// tests/hooks/useProjects.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import {
  useProjects,
  useAllUserProjects,
  useProjectDetails,
  useProjectDetailsBySlug,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useAddProjectMember,
  useUpdateProjectMemberRole,
  useRemoveProjectMember,
  useProjectRole,
  useProjectRoleCheck,
} from '@/hooks/useProjects'
import { mockProjectDetails, mockProjectMember } from '../mock/handlers/project.handlers'

const PROJECT_ID = 'project-1'
const WS_ID = 'ws-1'

// ─── useProjects ──────────────────────────────────────────────────────────────

describe('useProjects', () => {
  it('fetches projects for a workspace', async () => {
    const { result } = renderHook(
      () => useProjects(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].name).toBe('Test Project')
    expect(result.current.data?.[0].slug).toBe('test-project')
  })

  it('is disabled when workspaceId is not provided', () => {
    const { result } = renderHook(
      () => useProjects(undefined),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useAllUserProjects ───────────────────────────────────────────────────────

describe('useAllUserProjects', () => {
  it('fetches all projects for the current user', async () => {
    const { result } = renderHook(
      () => useAllUserProjects(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].id).toBe(PROJECT_ID)
  })
})

// ─── useProjectDetails ────────────────────────────────────────────────────────

describe('useProjectDetails', () => {
  it('fetches project details by id', async () => {
    const { result } = renderHook(
      () => useProjectDetails(PROJECT_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe(PROJECT_ID)
    expect(result.current.data?.name).toBe('Test Project')
    expect(result.current.data?.members).toHaveLength(1)
    expect(result.current.data?.stats.totalMembers).toBe(1)
  })

  it('is disabled when projectId is not provided', () => {
    const { result } = renderHook(
      () => useProjectDetails(undefined),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useProjectDetailsBySlug ──────────────────────────────────────────────────

describe('useProjectDetailsBySlug', () => {
  it('fetches project details by slug', async () => {
    const { result } = renderHook(
      () => useProjectDetailsBySlug('test-project'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.slug).toBe('test-project')
    expect(result.current.data?.color).toBe('#6366f1')
  })

  it('is disabled when slug is not provided', () => {
    const { result } = renderHook(
      () => useProjectDetailsBySlug(undefined),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useCreateProject ─────────────────────────────────────────────────────────

describe('useCreateProject', () => {
  it('creates a project', async () => {
    const { result } = renderHook(
      () => useCreateProject(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        name: 'New Project',
        workspaceId: WS_ID,
        color: '#ff0000',
        status: 'PLANNING',
        priority: 'HIGH',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe('New Project')
    expect(result.current.data?.id).toBe('project-new')
  })
})

// ─── useUpdateProject ─────────────────────────────────────────────────────────

it('updates a project', async () => {
  const { result } = renderHook(
    () => useUpdateProject(),
    { wrapper: createWrapper() }
  )

  await act(async () => {
    result.current.mutate({
      projectId: PROJECT_ID,
      data: { name: 'Updated Project', status: 'ON_HOLD' },
    })
  })

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true)
  })

  expect(result.current.data?.name).toBe('Updated Project')
  expect(result.current.data?.status).toBe('ON_HOLD')
})
// ─── useDeleteProject ─────────────────────────────────────────────────────────

describe('useDeleteProject', () => {
  it('deletes a project', async () => {
    const { result } = renderHook(
      () => useDeleteProject(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate(PROJECT_ID)
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// ─── useAddProjectMember ──────────────────────────────────────────────────────

describe('useAddProjectMember', () => {
  it('adds a member to a project', async () => {
    const { result } = renderHook(
      () => useAddProjectMember(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        projectId: PROJECT_ID,
        data: { userId: 'user-2', role: 'COLLABORATOR' },
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.userId).toBe('user-2')
    expect(result.current.data?.role).toBe('COLLABORATOR')
  })
})

// ─── useUpdateProjectMemberRole ───────────────────────────────────────────────
it('updates a member role', async () => {
  const { result } = renderHook(
    () => useUpdateProjectMemberRole(),
    { wrapper: createWrapper() }
  )

  await act(async () => {
    result.current.mutate({
      projectId: PROJECT_ID,
      memberId: 'pm-1',
      role: 'VIEWER',
    })
  })

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true)
  })

  expect(result.current.data?.role).toBe('VIEWER')
})

// ─── useRemoveProjectMember ───────────────────────────────────────────────────

describe('useRemoveProjectMember', () => {
  it('removes a member from a project', async () => {
    const { result } = renderHook(
      () => useRemoveProjectMember(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ projectId: PROJECT_ID, memberId: 'pm-1' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// ─── useProjectRole ───────────────────────────────────────────────────────────

describe('useProjectRole', () => {
  it('returns MANAGER permissions when user is project manager', async () => {
    const { result } = renderHook(
      () => useProjectRole(PROJECT_ID, mockProjectDetails),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.role).toBe('MANAGER')
    expect(result.current.isManager).toBe(true)
    expect(result.current.canManageProject).toBe(true)
    expect(result.current.canDeleteProject).toBe(true)
    expect(result.current.canCreateTasks).toBe(true)
    expect(result.current.canViewProject).toBe(true)
    expect(result.current.hasAccess).toBe(true)
  })

  it('returns COLLABORATOR permissions correctly', async () => {
    const collaboratorProject = {
      ...mockProjectDetails,
      members: [{ ...mockProjectMember, role: 'COLLABORATOR' as const }],
      isAdmin: false,
      workspace: { ...mockProjectDetails.workspace!, ownerId: 'other-user' },
    }

    const { result } = renderHook(
      () => useProjectRole(PROJECT_ID, collaboratorProject),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isCollaborator).toBe(true)
    expect(result.current.canCreateTasks).toBe(true)
    expect(result.current.canManageProject).toBe(false)
    expect(result.current.canDeleteProject).toBe(false)
    expect(result.current.canViewProject).toBe(true)
  })

  it('returns VIEWER permissions correctly', async () => {
    const viewerProject = {
      ...mockProjectDetails,
      members: [{ ...mockProjectMember, role: 'VIEWER' as const }],
      isAdmin: false,
      workspace: { ...mockProjectDetails.workspace!, ownerId: 'other-user' },
    }

    const { result } = renderHook(
      () => useProjectRole(PROJECT_ID, viewerProject),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isViewer).toBe(true)
    expect(result.current.canViewProject).toBe(true)
    expect(result.current.canCreateTasks).toBe(false)
    expect(result.current.canManageProject).toBe(false)
    expect(result.current.canCommentOnTasks).toBe(true)
  })

  it('returns null role when projectId and project are not provided', () => {
    const { result } = renderHook(
      () => useProjectRole(null, null),
      { wrapper: createWrapper() }
    )

    expect(result.current.role).toBeNull()
    expect(result.current.hasAccess).toBe(false)
    expect(result.current.canViewProject).toBe(false)
  })

  it('grants workspace admin full permissions even without project role', async () => {
    const adminProject = {
      ...mockProjectDetails,
      members: [], // user-1 is not a project member
      isAdmin: true,
      workspace: { ...mockProjectDetails.workspace!, ownerId: 'user-1' },
    }

    const { result } = renderHook(
      () => useProjectRole(PROJECT_ID, adminProject),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isWorkspaceAdmin).toBe(true)
    expect(result.current.canManageProject).toBe(true)
    expect(result.current.canDeleteProject).toBe(true)
    expect(result.current.hasAccess).toBe(true)
    expect(result.current.role).toBeFalsy() 
  })
})

// ─── useProjectRoleCheck ──────────────────────────────────────────────────────

describe('useProjectRoleCheck', () => {
  it('returns correct shorthand checks for MANAGER', async () => {
    const { result } = renderHook(
      () => useProjectRoleCheck(PROJECT_ID, mockProjectDetails),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isManager).toBe(true))
    expect(result.current.isManagerOrAdmin).toBe(true)
    expect(result.current.canEdit).toBe(true)
    expect(result.current.canContribute).toBe(true)
    expect(result.current.hasAccess).toBe(true)
  })

  it('returns correct shorthand checks for VIEWER', async () => {
    const viewerProject = {
      ...mockProjectDetails,
      members: [{ ...mockProjectMember, role: 'VIEWER' as const }],
      isAdmin: false,
      workspace: { ...mockProjectDetails.workspace!, ownerId: 'other-user' },
    }

    const { result } = renderHook(
      () => useProjectRoleCheck(PROJECT_ID, viewerProject),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isViewer).toBe(true))
    expect(result.current.isManagerOrAdmin).toBe(false)
    expect(result.current.canEdit).toBe(false)
    expect(result.current.canContribute).toBe(false)
    expect(result.current.hasAccess).toBe(true)
  })
})
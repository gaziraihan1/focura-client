import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react'
import { useTaskPermissions } from '@/hooks/useTaskPermissions'
import type { Task } from '@/types/task.types'

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { id: 'user-1' } } }),
}))

const mockProject = {
  id: 'proj-1',
  name: 'Test Project',
  slug: 'test-project',
  status: 'ACTIVE',
  workspace: { id: 'ws-1', name: 'Workspace', slug: 'ws' },
}

const makeTask = (overrides: Partial<Task> = {}): Task =>
  ({
    id: 'task-1',
    title: 'Test Task',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    startDate: null,
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectId: 'proj-1',
    workspaceId: 'ws-1',
    createdById: 'user-1',
    createdBy: { id: 'user-1', name: 'Alice', email: 'a@test.com', image: null },
    assignees: [],
    labels: [],
    attachments: [],
    _count: { subtasks: 0, comments: 0, attachments: 0 },
    project: mockProject,
    ...overrides,
  } as any as Task)

// Mock the dependent hooks
vi.mock('@/hooks/useProjects', () => ({
  useProjectRole: () => ({
    isManager: false,
    canViewTasks: true,
    canCommentOnTasks: true,
    isLoading: false,
  }),
}))

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspaceRole: () => ({
    isOwner: false,
    isAdmin: false,
    isLoading: false,
  }),
}))

vi.mock('@/hooks/useUser', () => ({
  useUserId: () => 'user-1',
}))

describe('useTaskPermissions', () => {
  it('returns loading state when task is null', () => {
    const { result } = renderHook(() => useTaskPermissions(null))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.canEdit).toBe(false)
    expect(result.current.canDelete).toBe(false)
  })

  it('returns loading state when task is undefined', () => {
    const { result } = renderHook(() => useTaskPermissions(undefined))

    expect(result.current.isLoading).toBe(true)
  })

  it('grants full permissions to task owner', () => {
    const task = makeTask({ createdById: 'user-1' })

    const { result } = renderHook(() => useTaskPermissions(task))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isOwner).toBe(true)
    expect(result.current.canEdit).toBe(true)
    expect(result.current.canDelete).toBe(true)
    expect(result.current.canChangeStatus).toBe(true)
    expect(result.current.canComment).toBe(true)
    expect(result.current.canView).toBe(true)
  })

  it('restricts non-owner on personal tasks', () => {
    const task = makeTask({
      createdById: 'other-user',
      createdBy: { id: 'other-user', name: 'Bob', email: 'bob@test.com', image: null } as any,
      projectId: undefined as any,
      project: undefined as any,
    })

    const { result } = renderHook(() => useTaskPermissions(task))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isOwner).toBe(false)
    expect(result.current.canEdit).toBe(false)
    expect(result.current.canDelete).toBe(false)
    expect(result.current.canView).toBe(false)
    expect(result.current.reason).toBe('Only task owner can access personal tasks')
  })

  it('allows owner on personal tasks', () => {
    const task = makeTask({
      createdById: 'user-1',
      projectId: undefined as any,
      project: undefined as any,
    })

    const { result } = renderHook(() => useTaskPermissions(task))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isOwner).toBe(true)
    expect(result.current.canEdit).toBe(true)
    expect(result.current.canView).toBe(true)
  })

  it('marks assignee correctly', () => {
    const task = makeTask({
      assignees: [{ user: { id: 'user-1' } }] as any,
    })

    const { result } = renderHook(() => useTaskPermissions(task))

    expect(result.current.isAssignee).toBe(true)
  })

  it('returns canChangeStatus true for assignee on project tasks', () => {
    const task = makeTask({
      assignees: [{ user: { id: 'user-1' } }] as any,
    })

    const { result } = renderHook(() => useTaskPermissions(task))

    expect(result.current.canChangeStatus).toBe(true)
  })

  it('returns cannot edit for non-owner on project tasks', () => {
    const task = makeTask({
      createdById: 'other-user',
      createdBy: { id: 'other-user', name: 'Bob', email: 'bob@test.com', image: null } as any,
      assignees: [],
    })

    const { result } = renderHook(() => useTaskPermissions(task))

    expect(result.current.canEdit).toBe(false)
    expect(result.current.canDelete).toBe(false)
    expect(result.current.reason).toBe('Only the task creator can edit or delete this task')
  })

  it('restricts archived project tasks', () => {
    const archivedProject = { ...mockProject, status: 'ARCHIVED' }
    const task = makeTask({
      project: archivedProject as any,
    })

    const { result } = renderHook(() => useTaskPermissions(task))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.canEdit).toBe(false)
    expect(result.current.canDelete).toBe(false)
    expect(result.current.canComment).toBe(false)
    expect(result.current.reason).toBe('This project is archived. Tasks are read-only.')
  })

  it('allows view on archived tasks', () => {
    const archivedProject = { ...mockProject, status: 'ARCHIVED' }
    const task = makeTask({
      project: archivedProject as any,
    })

    const { result } = renderHook(() => useTaskPermissions(task))

    expect(result.current.canView).toBe(true)
  })
})

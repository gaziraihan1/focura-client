import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import React from 'react'

const mocks = vi.hoisted(() => ({
  pushMock: vi.fn(),
  refetchQueriesMock: vi.fn(),
  getQueriesDataMock: vi.fn(),
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.pushMock }),
}))

vi.mock('@/lib/react-query/query-client', () => ({
  qc: {
    refetchQueries: (...args: unknown[]) => mocks.refetchQueriesMock(...args),
    getQueriesData: (...args: unknown[]) => mocks.getQueriesDataMock(...args),
  },
}))

vi.mock('@/hooks/useNavigationPrefetch', () => ({
  useProjectOverviewPrefetch: () => vi.fn(),
  useWorkspaceOverviewPrefetch: () => vi.fn(),
}))

vi.mock('lucide-react', () => {
  const mock = (name: string) => {
    const C = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    C.displayName = name
    return C
  }
  return {
    Calendar: mock('calendar'),
    Flag: mock('flag'),
    CheckCircle2: mock('check-circle2'),
    FolderKanban: mock('folder-kanban'),
    Users: mock('users'),
    Crown: mock('crown'),
    X: mock('x'),
  }
})

import { WorkspaceProjectCard } from '@/components/dashboard/projects/all-projects/WorkspaceProjects/WorkspaceProjectCard'
import { mockProject, createTestWrapper } from './testHelpers.tsx'

describe('WorkspaceProjectCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.refetchQueriesMock.mockResolvedValue(undefined)
    mocks.getQueriesDataMock.mockReturnValue([])
  })

  it('renders project name', () => {
    render(
      createTestWrapper(
        <WorkspaceProjectCard
          project={mockProject}
          workspaceSlug="ws-1"
          currentUserId="user-1"
          canCreateProjects={true}
        />
      )
    )
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('shows access denied modal when clicking without access', async () => {
    const { container } = render(
      createTestWrapper(
        <WorkspaceProjectCard
          project={mockProject}
          workspaceSlug="ws-1"
          currentUserId="user-99"
          canCreateProjects={false}
        />
      )
    )

    const cardButton = Array.from(container.querySelectorAll('button')).find((b) =>
      b.getAttribute('aria-label')?.includes('Open project')
    )
    expect(cardButton).toBeTruthy()
    fireEvent.click(cardButton!)
    expect(await screen.findByText('Access Restricted')).toBeInTheDocument()
  })

  it('does not show access denied modal when user has access', () => {
    render(
      createTestWrapper(
        <WorkspaceProjectCard
          project={mockProject}
          workspaceSlug="ws-1"
          currentUserId="user-1"
          canCreateProjects={false}
        />
      )
    )
    expect(screen.queryByText('Access Restricted')).not.toBeInTheDocument()
  })

  it('has access when canCreateProjects is true', () => {
    render(
      createTestWrapper(
        <WorkspaceProjectCard
          project={mockProject}
          workspaceSlug="ws-1"
          currentUserId="user-99"
          canCreateProjects={true}
        />
      )
    )
    const link = screen.getByText('Test Project').closest('a')
    expect(link).toHaveAttribute('href', '/dashboard/workspaces/ws-1/projects/test-project')
  })

  it('self-heals: navigates when the refreshed list shows membership', async () => {
    // The passed project is stale (no member row for user-3), but the refetched
    // workspace list includes them — the card should navigate, not deny.
    const freshProject = {
      ...mockProject,
      members: [
        ...mockProject.members,
        { user: { id: 'user-3', name: 'Carol' }, role: 'COLLABORATOR' as const },
      ],
    }
    mocks.getQueriesDataMock.mockReturnValue([
      [['projects', 'list', 'ws-1'], [freshProject]],
    ])

    render(
      createTestWrapper(
        <WorkspaceProjectCard
          project={mockProject}
          workspaceSlug="ws-1"
          currentUserId="user-3"
          canCreateProjects={false}
        />
      )
    )

    const cardButton = Array.from(document.querySelectorAll('button')).find((b) =>
      b.getAttribute('aria-label')?.includes('Open project')
    )
    fireEvent.click(cardButton!)

    await waitFor(() =>
      expect(mocks.pushMock).toHaveBeenCalledWith('/dashboard/workspaces/ws-1/projects/test-project')
    )
    expect(mocks.refetchQueriesMock).toHaveBeenCalled()
    expect(screen.queryByText('Access Restricted')).not.toBeInTheDocument()
  })

  it('still denies after self-heal when the refreshed list lacks membership', async () => {
    render(
      createTestWrapper(
        <WorkspaceProjectCard
          project={mockProject}
          workspaceSlug="ws-1"
          currentUserId="user-99"
          canCreateProjects={false}
        />
      )
    )

    const cardButton = Array.from(document.querySelectorAll('button')).find((b) =>
      b.getAttribute('aria-label')?.includes('Open project')
    )
    fireEvent.click(cardButton!)

    expect(await screen.findByText('Access Restricted')).toBeInTheDocument()
    expect(mocks.pushMock).not.toHaveBeenCalled()
  })
})

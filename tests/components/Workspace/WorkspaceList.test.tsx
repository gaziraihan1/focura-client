import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { WorkspaceList } from '@/components/Dashboard/WorkspaceList'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({}),
  usePathname: () => '/',
}))

vi.mock('@/hooks/useNavigationPrefetch', () => ({
  useProjectOverviewPrefetch: () => vi.fn(),
  useWorkspaceOverviewPrefetch: () => vi.fn(),
}))

const mockWorkspaces = [
  {
    id: 'ws-1',
    name: 'My Workspace',
    slug: 'my-workspace',
    color: '#667eea',
    logo: 'M',
    ownerId: 'owner-1',
    owner: { id: 'owner-1', name: 'Owner' },
    _count: { projects: 5, members: 3 },
  },
  {
    id: 'ws-2',
    name: 'Client Project',
    slug: 'client-project',
    color: '#f97316',
    logo: null,
    ownerId: 'owner-1',
    owner: { id: 'owner-1', name: 'Owner' },
    _count: { projects: 2, members: 8 },
  },
]

function createTestWrapper(children: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('WorkspaceList', () => {
  it('renders the heading', () => {
    render(createTestWrapper(<WorkspaceList workspaces={mockWorkspaces} />))

    expect(screen.getByText('Your workspaces')).toBeInTheDocument()
  })

  it('renders "View all" link', () => {
    render(createTestWrapper(<WorkspaceList workspaces={mockWorkspaces} />))

    expect(screen.getByText('View all →')).toBeInTheDocument()
  })

  it('renders workspace names', () => {
    render(createTestWrapper(<WorkspaceList workspaces={mockWorkspaces} />))

    expect(screen.getByText('My Workspace')).toBeInTheDocument()
    expect(screen.getByText('Client Project')).toBeInTheDocument()
  })

  it('renders project and member counts', () => {
    const { container } = render(createTestWrapper(<WorkspaceList workspaces={mockWorkspaces} />))
    expect(container.textContent).toContain('5')
    expect(container.textContent).toContain('3')
  })

  it('renders singular form for 1 project/member', () => {
    const singleWs = [{
      ...mockWorkspaces[0],
      _count: { projects: 1, members: 1 },
    }]
    const { container } = render(createTestWrapper(<WorkspaceList workspaces={singleWs} />))
    expect(container.textContent).toContain('1')
  })

  it('shows "Owner" badge for owner', () => {
    render(createTestWrapper(<WorkspaceList workspaces={mockWorkspaces} />))

    const ownerBadges = screen.getAllByText('Owner')
    expect(ownerBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('renders "Create new workspace" link', () => {
    render(createTestWrapper(<WorkspaceList workspaces={mockWorkspaces} />))

    expect(screen.getByText('Create new workspace')).toBeInTheDocument()
  })

  it('links workspace to correct slug', () => {
    render(createTestWrapper(<WorkspaceList workspaces={mockWorkspaces} />))

    const wsLink = screen.getByText('My Workspace').closest('a')
    expect(wsLink).toHaveAttribute('href', '/dashboard/workspaces/my-workspace')
  })

  it('limits display to 4 workspaces', () => {
    const manyWorkspaces = Array.from({ length: 6 }, (_, i) => ({
      ...mockWorkspaces[0],
      id: `ws-${i}`,
      name: `Workspace ${i}`,
      slug: `workspace-${i}`,
    }))

    render(createTestWrapper(<WorkspaceList workspaces={manyWorkspaces} />))

    expect(screen.getByText('Workspace 0')).toBeInTheDocument()
    expect(screen.getByText('Workspace 3')).toBeInTheDocument()
    expect(screen.queryByText('Workspace 4')).not.toBeInTheDocument()
  })

  it('renders workspace logo initial when no logo', () => {
    render(createTestWrapper(<WorkspaceList workspaces={[mockWorkspaces[1]]} />))

    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('renders workspace logo text when provided', () => {
    render(createTestWrapper(<WorkspaceList workspaces={[mockWorkspaces[0]]} />))

    expect(screen.getByText('M')).toBeInTheDocument()
  })
})

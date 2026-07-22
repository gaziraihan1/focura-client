import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WorkspaceList } from '@/components/Dashboard/WorkspaceList'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({}),
  usePathname: () => '/',
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

describe('WorkspaceList', () => {
  it('renders the heading', () => {
    render(<WorkspaceList workspaces={mockWorkspaces} />)

    expect(screen.getByText('Your workspaces')).toBeInTheDocument()
  })

  it('renders "View all" link', () => {
    render(<WorkspaceList workspaces={mockWorkspaces} />)

    expect(screen.getByText('View all →')).toBeInTheDocument()
  })

  it('renders workspace names', () => {
    render(<WorkspaceList workspaces={mockWorkspaces} />)

    expect(screen.getByText('My Workspace')).toBeInTheDocument()
    expect(screen.getByText('Client Project')).toBeInTheDocument()
  })

  it('renders project and member counts', () => {
    render(<WorkspaceList workspaces={mockWorkspaces} />)

    expect(screen.getByText('5 projects · 3 members')).toBeInTheDocument()
    expect(screen.getByText('2 projects · 8 members')).toBeInTheDocument()
  })

  it('renders singular form for 1 project/member', () => {
    const singleWs = [{
      ...mockWorkspaces[0],
      _count: { projects: 1, members: 1 },
    }]

    render(<WorkspaceList workspaces={singleWs} />)

    expect(screen.getByText('1 project · 1 member')).toBeInTheDocument()
  })

  it('shows "Owner" badge for owner', () => {
    render(<WorkspaceList workspaces={mockWorkspaces} />)

    const ownerBadges = screen.getAllByText('Owner')
    expect(ownerBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('renders "Create new workspace" link', () => {
    render(<WorkspaceList workspaces={mockWorkspaces} />)

    expect(screen.getByText('Create new workspace')).toBeInTheDocument()
  })

  it('links workspace to correct slug', () => {
    render(<WorkspaceList workspaces={mockWorkspaces} />)

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

    render(<WorkspaceList workspaces={manyWorkspaces} />)

    expect(screen.getByText('Workspace 0')).toBeInTheDocument()
    expect(screen.getByText('Workspace 3')).toBeInTheDocument()
    expect(screen.queryByText('Workspace 4')).not.toBeInTheDocument()
  })

  it('renders workspace logo initial when no logo', () => {
    render(<WorkspaceList workspaces={[mockWorkspaces[1]]} />)

    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('renders workspace logo text when provided', () => {
    render(<WorkspaceList workspaces={[mockWorkspaces[0]]} />)

    expect(screen.getByText('M')).toBeInTheDocument()
  })
})

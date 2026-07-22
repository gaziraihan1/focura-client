import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}))

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
  useParams: () => ({ workspaceSlug: 'test-ws' }),
}))

import { WorkspaceHeader } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceHeader'

describe('WorkspaceHeader', () => {
  const defaultProps = {
    workspaceName: 'Test Workspace',
    workspaceSlug: 'test-workspace',
    workspacePlan: 'FREE',
    canCreateProjects: true,
    isAdmin: true,
    isOwner: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockPush.mockClear()
  })

  it('renders workspace name', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.getByText('Test Workspace')).toBeInTheDocument()
  })

  it('renders workspace slug', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.getByText('/test-workspace')).toBeInTheDocument()
  })

  it('renders workspace logo (first letter) when no logo provided', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('renders workspace logo when provided', () => {
    render(<WorkspaceHeader {...defaultProps} workspaceLogo="WS" />)
    expect(screen.getByText('WS')).toBeInTheDocument()
  })

  it('applies custom workspace color', () => {
    render(<WorkspaceHeader {...defaultProps} workspaceColor="#ff0000" />)
    const logoBox = screen.getByText('T').closest('div')!
    expect(logoBox.style.backgroundColor).toContain('255, 0, 0')
  })

  it('applies default color when no workspaceColor provided', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    const logoBox = screen.getByText('T').closest('div')!
    expect(logoBox.style.backgroundColor).toContain('102, 126, 234')
  })

  it('renders FREE plan badge', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('renders PRO plan badge', () => {
    render(<WorkspaceHeader {...defaultProps} workspacePlan="PRO" />)
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })

  it('renders BUSINESS plan badge', () => {
    render(<WorkspaceHeader {...defaultProps} workspacePlan="BUSINESS" />)
    expect(screen.getByText('Business')).toBeInTheDocument()
  })

  it('renders ENTERPRISE plan badge', () => {
    render(<WorkspaceHeader {...defaultProps} workspacePlan="ENTERPRISE" />)
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('defaults to FREE badge for unknown plan', () => {
    render(<WorkspaceHeader {...defaultProps} workspacePlan="UNKNOWN" />)
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('renders workspace description when provided', () => {
    render(<WorkspaceHeader {...defaultProps} workspaceDescription="A great workspace" />)
    expect(screen.getByText('A great workspace')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.queryByText('A great workspace')).not.toBeInTheDocument()
  })

  it('shows New Project button when canCreateProjects is true', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    const newProjectElements = screen.getAllByText('New Project')
    expect(newProjectElements.length).toBeGreaterThan(0)
  })

  it('hides New Project button when canCreateProjects is false', () => {
    render(<WorkspaceHeader {...defaultProps} canCreateProjects={false} />)
    expect(screen.queryByText('New Project')).not.toBeInTheDocument()
  })

  it('navigates to new project page when New Project is clicked', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    const newProjectBtn = screen.getAllByText('New Project')[0].closest('button')!
    fireEvent.click(newProjectBtn)
    expect(mockPush).toHaveBeenCalledWith('/dashboard/workspaces/test-workspace/projects/new-project')
  })

  it('shows Settings button when isAdmin is true', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
  })

  it('shows Settings button when isOwner is true', () => {
    render(<WorkspaceHeader {...defaultProps} isAdmin={false} isOwner={true} />)
    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
  })

  it('hides Settings button when not admin and not owner', () => {
    render(<WorkspaceHeader {...defaultProps} isAdmin={false} isOwner={false} />)
    expect(screen.queryByLabelText('Settings')).not.toBeInTheDocument()
  })

  it('links settings button to settings page', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    const settingsLink = screen.getByLabelText('Settings').closest('a')!
    expect(settingsLink.getAttribute('href')).toBe('/dashboard/workspaces/test-workspace/settings')
  })

  it('back button navigates to workspaces list', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Back to workspaces'))
    expect(mockPush).toHaveBeenCalledWith('/dashboard/workspaces')
  })

  it('back button has correct aria-label', () => {
    render(<WorkspaceHeader {...defaultProps} />)
    expect(screen.getByLabelText('Back to workspaces')).toBeInTheDocument()
  })
})

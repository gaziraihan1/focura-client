import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EmptyState } from '@/components/Dashboard/AllProjects/EmptyState'
import { ProjectStats } from '@/components/Dashboard/AllProjects/ProjectStats'
import { WorkspaceQuickFilter } from '@/components/Dashboard/AllProjects/WorkspaceQuickFilter'

vi.mock('lucide-react', () => ({
  FolderKanban: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="folder-icon" {...props} />,
  Sparkles: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="sparkles-icon" {...props} />,
  CheckCircle2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="check-icon" {...props} />,
  TrendingUp: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="trending-icon" {...props} />,
  Building2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="building-icon" {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
}))

describe('EmptyState', () => {
  const defaultProps = {
    hasSearchOrFilters: false,
    onBrowseWorkspaces: vi.fn(),
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders no projects message when no filters', () => {
    render(<EmptyState {...defaultProps} />)
    expect(screen.getByText('No projects yet')).toBeInTheDocument()
  })

  it('renders search message when filters active', () => {
    render(<EmptyState {...defaultProps} hasSearchOrFilters={true} />)
    expect(screen.getByText('No projects match your search')).toBeInTheDocument()
  })

  it('renders browse workspaces button when no filters', () => {
    render(<EmptyState {...defaultProps} />)
    expect(screen.getByText('Browse Workspaces')).toBeInTheDocument()
  })

  it('hides browse button when filters active', () => {
    render(<EmptyState {...defaultProps} hasSearchOrFilters={true} />)
    expect(screen.queryByText('Browse Workspaces')).not.toBeInTheDocument()
  })

  it('calls onBrowseWorkspaces when button clicked', () => {
    render(<EmptyState {...defaultProps} />)
    fireEvent.click(screen.getByText('Browse Workspaces'))
    expect(defaultProps.onBrowseWorkspaces).toHaveBeenCalled()
  })

  it('renders folder icon', () => {
    render(<EmptyState {...defaultProps} />)
    expect(screen.getByTestId('folder-icon')).toBeInTheDocument()
  })
})

describe('ProjectStats', () => {
  it('renders all stat labels', () => {
    render(<ProjectStats total={10} active={5} completed={3} totalTasks={42} />)
    expect(screen.getByText('Total Projects')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
  })

  it('renders stat values', () => {
    render(<ProjectStats total={10} active={5} completed={3} totalTasks={42} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders stat icons', () => {
    render(<ProjectStats total={10} active={5} completed={3} totalTasks={42} />)
    expect(screen.getByTestId('folder-icon')).toBeInTheDocument()
    expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument()
    expect(screen.getByTestId('check-icon')).toBeInTheDocument()
    expect(screen.getByTestId('trending-icon')).toBeInTheDocument()
  })
})

describe('WorkspaceQuickFilter', () => {
  const workspaces = [
    { id: 'ws-1', name: 'Workspace A' },
    { id: 'ws-2', name: 'Workspace B' },
  ]

  const defaultProps = {
    workspaces,
    selectedWorkspaceId: 'all',
    onSelectWorkspace: vi.fn(),
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders nothing when no workspaces', () => {
    const { container } = render(
      <WorkspaceQuickFilter {...defaultProps} workspaces={[]} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders All Workspaces button', () => {
    render(<WorkspaceQuickFilter {...defaultProps} />)
    expect(screen.getByText('All Workspaces')).toBeInTheDocument()
  })

  it('renders workspace names', () => {
    render(<WorkspaceQuickFilter {...defaultProps} />)
    expect(screen.getByText('Workspace A')).toBeInTheDocument()
    expect(screen.getByText('Workspace B')).toBeInTheDocument()
  })

  it('calls onSelectWorkspace with "all" when All Workspaces clicked', () => {
    render(<WorkspaceQuickFilter {...defaultProps} />)
    fireEvent.click(screen.getByText('All Workspaces'))
    expect(defaultProps.onSelectWorkspace).toHaveBeenCalledWith('all')
  })

  it('calls onSelectWorkspace with workspace id when clicked', () => {
    render(<WorkspaceQuickFilter {...defaultProps} />)
    fireEvent.click(screen.getByText('Workspace A'))
    expect(defaultProps.onSelectWorkspace).toHaveBeenCalledWith('ws-1')
  })

  it('highlights selected workspace', () => {
    render(<WorkspaceQuickFilter {...defaultProps} selectedWorkspaceId="ws-1" />)
    const wsAButton = screen.getByText('Workspace A')
    expect(wsAButton.className).toContain('bg-primary')
  })

  it('renders Filter by Workspace label', () => {
    render(<WorkspaceQuickFilter {...defaultProps} />)
    expect(screen.getByText('Filter by Workspace:')).toBeInTheDocument()
  })
})

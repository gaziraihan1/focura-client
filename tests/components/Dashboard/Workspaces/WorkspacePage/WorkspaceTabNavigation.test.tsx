import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { WorkspaceTabNavigation } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceTabNavigation'

describe('WorkspaceTabNavigation', () => {
  const defaultProps = {
    activeTab: 'overview' as const,
    onTabChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all three tabs', () => {
    render(<WorkspaceTabNavigation {...defaultProps} />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Members')).toBeInTheDocument()
  })

  it('calls onTabChange with "overview" when Overview clicked', () => {
    render(<WorkspaceTabNavigation {...defaultProps} />)
    fireEvent.click(screen.getByText('Overview'))
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('overview')
  })

  it('calls onTabChange with "projects" when Projects clicked', () => {
    render(<WorkspaceTabNavigation {...defaultProps} />)
    fireEvent.click(screen.getByText('Projects'))
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('projects')
  })

  it('calls onTabChange with "members" when Members clicked', () => {
    render(<WorkspaceTabNavigation {...defaultProps} />)
    fireEvent.click(screen.getByText('Members'))
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('members')
  })

  it('applies active styles to the active tab', () => {
    render(<WorkspaceTabNavigation activeTab="projects" onTabChange={vi.fn()} />)
    const projectsBtn = screen.getByText('Projects').closest('button')!
    expect(projectsBtn.className).toContain('border-primary')
    expect(projectsBtn.className).toContain('text-primary')
  })

  it('applies inactive styles to non-active tabs', () => {
    render(<WorkspaceTabNavigation activeTab="overview" onTabChange={vi.fn()} />)
    const projectsBtn = screen.getByText('Projects').closest('button')!
    expect(projectsBtn.className).toContain('border-transparent')
    expect(projectsBtn.className).toContain('text-muted-foreground')
  })

  it('applies active styles to members tab when active', () => {
    render(<WorkspaceTabNavigation activeTab="members" onTabChange={vi.fn()} />)
    const membersBtn = screen.getByText('Members').closest('button')!
    expect(membersBtn.className).toContain('border-primary')
  })

  it('renders icons in each tab', () => {
    const { container } = render(<WorkspaceTabNavigation {...defaultProps} />)
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBe(3)
    buttons.forEach(btn => {
      expect(btn.querySelector('svg')).toBeInTheDocument()
    })
  })
})

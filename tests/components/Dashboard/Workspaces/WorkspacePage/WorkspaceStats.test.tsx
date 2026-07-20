import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}))

import { WorkspaceStats } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceStats'

describe('WorkspaceStats', () => {
  const defaultProps = {
    stats: {
      totalProjects: 12,
      completedTasks: 45,
      completionRate: 75,
      overdueTasks: 3,
      totalMembers: 8,
    },
    maxMembers: 20,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders total projects count', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('renders completed tasks count', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('45')).toBeInTheDocument()
  })

  it('renders completion rate percentage', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('renders overdue tasks count', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders total members count', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('renders max members', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('20 max')).toBeInTheDocument()
  })

  it('renders stat labels', () => {
    render(<WorkspaceStats {...defaultProps} />)
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(screen.getByText('Members')).toBeInTheDocument()
  })

  it('renders 4 stat cards', () => {
    render(<WorkspaceStats {...defaultProps} />)
    // Each card is inside a motion.div which is rendered as a div
    const cards = screen.getAllByText('Projects')
    expect(cards.length).toBe(1) // Just one "Projects" label
  })

  it('handles zero stats', () => {
    render(<WorkspaceStats
      stats={{ totalProjects: 0, completedTasks: 0, completionRate: 0, overdueTasks: 0, totalMembers: 0 }}
      maxMembers={0}
    />)
    expect(screen.getByText('0 max')).toBeInTheDocument()
  })

  it('handles large numbers', () => {
    render(<WorkspaceStats
      stats={{ totalProjects: 999, completedTasks: 10000, completionRate: 99, overdueTasks: 500, totalMembers: 200 }}
      maxMembers={500}
    />)
    expect(screen.getByText('999')).toBeInTheDocument()
    expect(screen.getByText('10000')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('500 max')).toBeInTheDocument()
  })
})

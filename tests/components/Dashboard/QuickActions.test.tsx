import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuickActions } from '@/components/Dashboard/QuickActions'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({}),
  usePathname: () => '/',
}))

describe('QuickActions', () => {
  it('renders the section heading', () => {
    render(<QuickActions />)

    expect(screen.getByText('Quick actions')).toBeInTheDocument()
  })

  it('renders all four action items', () => {
    render(<QuickActions />)

    expect(screen.getByText('New workspace')).toBeInTheDocument()
    expect(screen.getByText('Invite member')).toBeInTheDocument()
    expect(screen.getByText('New project')).toBeInTheDocument()
    expect(screen.getByText('Shortcuts')).toBeInTheDocument()
  })

  it('renders hints for each action', () => {
    render(<QuickActions />)

    expect(screen.getByText('Start fresh')).toBeInTheDocument()
    expect(screen.getByText('Grow your team')).toBeInTheDocument()
    expect(screen.getByText('Inside a workspace')).toBeInTheDocument()
    expect(screen.getByText('⌘K to switch')).toBeInTheDocument()
  })

  it('links "New workspace" to correct path', () => {
    render(<QuickActions />)

    const link = screen.getByText('New workspace').closest('a')
    expect(link).toHaveAttribute('href', '/dashboard/workspaces/new-workspace')
  })

  it('links "Invite member" to workspaces page', () => {
    render(<QuickActions />)

    const link = screen.getByText('Invite member').closest('a')
    expect(link).toHaveAttribute('href', '/dashboard/workspaces')
  })

  it('links "New project" to workspaces page', () => {
    render(<QuickActions />)

    const link = screen.getByText('New project').closest('a')
    expect(link).toHaveAttribute('href', '/dashboard/workspaces')
  })

  it('renders grid layout', () => {
    const { container } = render(<QuickActions />)

    const grid = container.querySelector('.grid')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveClass('grid-cols-2')
  })
})

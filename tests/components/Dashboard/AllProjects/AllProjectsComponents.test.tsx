import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { EmptyState } from '@/components/Dashboard/AllProjects/EmptyState'
import { ProjectCard } from '@/components/Dashboard/AllProjects/ProjectCard'

vi.mock('framer-motion', () => ({
  motion: { div: (p: any) => <div {...p} />, button: (p: any) => <button {...p} /> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('@/components/Projects/WorkspaceProjects/AceessDeniedModal', () => ({
  AccessDeniedModal: () => null,
}))
vi.mock('@/utils/project.utils', () => ({
  getPriorityColor: () => 'text-red-500',
  getStatusColor: () => 'border-green-500',
}))

describe('AllProjects EmptyState', () => {
  it('renders "No projects yet" when hasSearchOrFilters=false', () => {
    render(<EmptyState hasSearchOrFilters={false} onBrowseWorkspaces={vi.fn()} />)
    expect(screen.getByText('No projects yet')).toBeInTheDocument()
  })

  it('renders "No projects match your search" when hasSearchOrFilters=true', () => {
    render(<EmptyState hasSearchOrFilters={true} onBrowseWorkspaces={vi.fn()} />)
    expect(screen.getByText('No projects match your search')).toBeInTheDocument()
  })

  it('shows Browse Workspaces button when no filters', () => {
    render(<EmptyState hasSearchOrFilters={false} onBrowseWorkspaces={vi.fn()} />)
    expect(screen.getByRole('button', { name: /browse workspaces/i })).toBeInTheDocument()
  })

  it('hides Browse Workspaces button when hasSearchOrFilters=true', () => {
    render(<EmptyState hasSearchOrFilters={true} onBrowseWorkspaces={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /browse workspaces/i })).not.toBeInTheDocument()
  })

  it('calls onBrowseWorkspaces when button clicked', async () => {
    const user = userEvent.setup()
    const onBrowseWorkspaces = vi.fn()
    render(<EmptyState hasSearchOrFilters={false} onBrowseWorkspaces={onBrowseWorkspaces} />)
    await user.click(screen.getByRole('button', { name: /browse workspaces/i }))
    expect(onBrowseWorkspaces).toHaveBeenCalledTimes(1)
  })
})

describe('AllProjects ProjectCard', () => {
  const mockProject = {
    id: 'p-1',
    name: 'Test Project',
    description: 'A test project description',
    status: 'ACTIVE',
    priority: 'HIGH',
    color: '#3b82f6',
    dueDate: '2025-12-31',
    _count: { tasks: 5 },
    workspace: { id: 'ws-1', name: 'Test Workspace', slug: 'test-ws' },
    icon: null,
    stats: null,
    slug: 'test-project',
  }

  const defaultProps = {
    project: mockProject as any,
    index: 0,
    onNavigate: vi.fn(),
    showModal: false,
    onCloseModal: vi.fn(),
  }

  it('renders project name', () => {
    render(<ProjectCard {...defaultProps} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('shows description', () => {
    render(<ProjectCard {...defaultProps} />)
    expect(screen.getByText('A test project description')).toBeInTheDocument()
  })

  it('shows status badge', () => {
    render(<ProjectCard {...defaultProps} />)
    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
  })

  it('shows task count', () => {
    render(<ProjectCard {...defaultProps} />)
    expect(screen.getByText(/5 tasks/)).toBeInTheDocument()
  })

  it('calls onNavigate when clicked', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<ProjectCard {...defaultProps} onNavigate={onNavigate} />)
    await user.click(screen.getByText('Test Project'))
    expect(onNavigate).toHaveBeenCalledTimes(1)
  })
})

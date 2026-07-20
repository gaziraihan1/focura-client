import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}))

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name, image, size }: Record<string, unknown>) => (
    <div data-testid="avatar" data-name={name} data-image={image} data-size={size}>
      {name}
    </div>
  ),
}))

vi.mock('@/components/Dashboard/Workspaces/ProjectCard/ProjectCardHeader', () => ({
  ProjectCardHeader: (props: Record<string, unknown>) => (
    <div data-testid="project-card-header" data-name={props.name} data-status={props.status} data-priority={props.priority} />
  ),
}))

vi.mock('@/components/Dashboard/Workspaces/ProjectCard/ProjectCardDescription', () => ({
  ProjectCardDescription: (props: Record<string, unknown>) => (
    <div data-testid="project-card-description" data-desc={props.description} />
  ),
}))

vi.mock('@/components/Dashboard/Workspaces/ProjectCard/ProjectCardStats', () => ({
  ProjectCardStats: (props: Record<string, unknown>) => (
    <div data-testid="project-card-stats" data-completed={props.completedTasks} data-total={props.totalTasks} />
  ),
}))

vi.mock('@/components/Dashboard/Workspaces/ProjectCard/ProjectCardFooter', () => ({
  ProjectCardFooter: (props: Record<string, unknown>) => (
    <div data-testid="project-card-footer" data-members={JSON.stringify(props.members)} />
  ),
}))

vi.mock('@/hooks/useProjects', () => ({
  useProjects: vi.fn(),
}))

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
  useParams: () => ({ workspaceSlug: 'test-ws' }),
}))

import { WorkspaceProjectsTab } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceProjectsTab'
import { useProjects } from '@/hooks/useProjects'

describe('WorkspaceProjectsTab', () => {
  const defaultProps = {
    workspaceId: 'ws-1',
    workspaceSlug: 'test-workspace',
    canCreateProjects: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockPush.mockClear()
    ;(useProjects as any).mockReturnValue({ data: [], isLoading: false })
  })

  it('shows loading spinner when isLoading is true', () => {
    ;(useProjects as any).mockReturnValue({ data: [], isLoading: true })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('shows empty state when no projects', () => {
    ;(useProjects as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    expect(screen.getByText('No projects yet')).toBeInTheDocument()
  })

  it('shows create button in empty state when canCreateProjects', () => {
    ;(useProjects as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    expect(screen.getByText('Create Project')).toBeInTheDocument()
  })

  it('hides create button in empty state when cannot create projects', () => {
    ;(useProjects as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} canCreateProjects={false} />)
    expect(screen.queryByText('Create Project')).not.toBeInTheDocument()
  })

  it('navigates to new project when create button is clicked in empty state', () => {
    ;(useProjects as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    fireEvent.click(screen.getByText('Create Project'))
    expect(mockPush).toHaveBeenCalledWith('/dashboard/workspaces/test-workspace/projects/new-project')
  })

  it('renders projects when data is available', () => {
    const projects = [
      {
        id: 'p1',
        slug: 'proj-1',
        name: 'Project One',
        color: '#3b82f6',
        status: 'ACTIVE',
        priority: 'HIGH',
        members: [],
        tasks: [],
        announcement: [],
        stats: { totalTasks: 5, completedTasks: 3, overdueTasks: 1, totalMembers: 2, projectDays: 10 },
      },
      {
        id: 'p2',
        slug: 'proj-2',
        name: 'Project Two',
        color: '#ef4444',
        status: 'COMPLETED',
        priority: 'LOW',
        members: [],
        tasks: [],
        announcement: [],
        stats: { totalTasks: 10, completedTasks: 10, overdueTasks: 0, totalMembers: 1, projectDays: 20 },
      },
    ] as any[]
    ;(useProjects as any).mockReturnValue({ data: projects, isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    const headers = screen.getAllByTestId('project-card-header')
    expect(headers.length).toBe(2)
    expect(headers[0].getAttribute('data-name')).toBe('Project One')
    expect(headers[1].getAttribute('data-name')).toBe('Project Two')
  })

  it('shows project count in header when canCreateProjects', () => {
    const projects = [
      { id: 'p1', slug: 'p1', name: 'P1', color: '#fff', status: 'ACTIVE', priority: 'HIGH', members: [], tasks: [], announcement: [], stats: { totalTasks: 0, completedTasks: 0, overdueTasks: 0, totalMembers: 0, projectDays: 0 } },
    ] as any[]
    ;(useProjects as any).mockReturnValue({ data: projects, isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    expect(screen.getByText('Projects (1)')).toBeInTheDocument()
  })

  it('shows New Project button in header when canCreateProjects and has projects', () => {
    const projects = [
      { id: 'p1', slug: 'p1', name: 'P1', color: '#fff', status: 'ACTIVE', priority: 'HIGH', members: [], tasks: [], announcement: [], stats: { totalTasks: 0, completedTasks: 0, overdueTasks: 0, totalMembers: 0, projectDays: 0 } },
    ] as any[]
    ;(useProjects as any).mockReturnValue({ data: projects, isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    expect(screen.getByText('New Project')).toBeInTheDocument()
  })

  it('navigates when New Project button clicked in project list', () => {
    const projects = [
      { id: 'p1', slug: 'p1', name: 'P1', color: '#fff', status: 'ACTIVE', priority: 'HIGH', members: [], tasks: [], announcement: [], stats: { totalTasks: 0, completedTasks: 0, overdueTasks: 0, totalMembers: 0, projectDays: 0 } },
    ] as any[]
    ;(useProjects as any).mockReturnValue({ data: projects, isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} />)
    // The header "New Project" button
    const newProjectButtons = screen.getAllByText('New Project')
    fireEvent.click(newProjectButtons[0])
    expect(mockPush).toHaveBeenCalledWith('/dashboard/workspaces/test-workspace/projects/new-project')
  })

  it('hides header when cannot create projects', () => {
    const projects = [
      { id: 'p1', slug: 'p1', name: 'P1', color: '#fff', status: 'ACTIVE', priority: 'HIGH', members: [], tasks: [], announcement: [], stats: { totalTasks: 0, completedTasks: 0, overdueTasks: 0, totalMembers: 0, projectDays: 0 } },
    ] as any[]
    ;(useProjects as any).mockReturnValue({ data: projects, isLoading: false })
    render(<WorkspaceProjectsTab {...defaultProps} canCreateProjects={false} />)
    expect(screen.queryByText('Projects (1)')).not.toBeInTheDocument()
    expect(screen.queryByText('New Project')).not.toBeInTheDocument()
  })
})

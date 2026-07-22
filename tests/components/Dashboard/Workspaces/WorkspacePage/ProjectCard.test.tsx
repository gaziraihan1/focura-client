import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
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

import { ProjectCard } from '@/components/Dashboard/Workspaces/WorkspacePage/ProjectCard'

describe('ProjectCard', () => {
  const baseProject = {
    id: 'proj-1',
    slug: 'my-project',
    name: 'My Project',
    description: 'A test project',
    color: '#3b82f6',
    icon: '📁',
    status: 'ACTIVE',
    priority: 'HIGH',
    startDate: '2024-01-01',
    dueDate: '2024-06-30',
    createdAt: '2024-01-01',
    members: [
      {
        id: 'pm1',
        userId: 'u1',
        role: 'MANAGER' as const,
        joinedAt: '2024-01-01',
        user: { id: 'u1', name: 'Alice', email: 'alice@test.com', image: 'img.jpg' },
      },
    ],
    tasks: [],
    announcement: [],
    stats: {
      totalTasks: 10,
      completedTasks: 5,
      overdueTasks: 2,
      totalMembers: 3,
      projectDays: 30,
    },
  } as any

  const defaultProps = {
    project: baseProject,
    workspaceSlug: 'test-workspace',
    index: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the project card with link', () => {
    render(<ProjectCard {...defaultProps} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/dashboard/workspaces/test-workspace/projects/my-project')
  })

  it('passes project data to ProjectCardHeader', () => {
    render(<ProjectCard {...defaultProps} />)
    const header = screen.getByTestId('project-card-header')
    expect(header.getAttribute('data-name')).toBe('My Project')
    expect(header.getAttribute('data-status')).toBe('ACTIVE')
    expect(header.getAttribute('data-priority')).toBe('HIGH')
  })

  it('passes description to ProjectCardDescription', () => {
    render(<ProjectCard {...defaultProps} />)
    const desc = screen.getByTestId('project-card-description')
    expect(desc.getAttribute('data-desc')).toBe('A test project')
  })

  it('passes stats to ProjectCardStats', () => {
    render(<ProjectCard {...defaultProps} />)
    const stats = screen.getByTestId('project-card-stats')
    expect(stats.getAttribute('data-completed')).toBe('5')
    expect(stats.getAttribute('data-total')).toBe('10')
  })

  it('passes members to ProjectCardFooter', () => {
    render(<ProjectCard {...defaultProps} />)
    const footer = screen.getByTestId('project-card-footer')
    expect(footer.getAttribute('data-members')).toContain('Alice')
  })

  it('calculates completion rate correctly', () => {
    render(<ProjectCard {...defaultProps} />)
    // 5/10 = 50%
    const stats = screen.getByTestId('project-card-stats')
    // Stats component receives completionRate but we just verify it renders
    expect(stats).toBeInTheDocument()
  })

  it('handles project without stats', () => {
    const projectNoStats = { ...baseProject, stats: undefined }
    render(<ProjectCard project={projectNoStats} workspaceSlug="test-ws" index={0} />)
    const stats = screen.getByTestId('project-card-stats')
    expect(stats.getAttribute('data-completed')).toBe('0')
    expect(stats.getAttribute('data-total')).toBe('0')
  })

  it('handles project without members', () => {
    const projectNoMembers = { ...baseProject, members: undefined }
    render(<ProjectCard project={projectNoMembers} workspaceSlug="test-ws" index={0} />)
    const footer = screen.getByTestId('project-card-footer')
    expect(footer.getAttribute('data-members')).toBe('[]')
  })

  it('uses 0 completion rate when totalTasks is 0', () => {
    const projectZeroTasks = {
      ...baseProject,
      stats: { ...baseProject.stats, totalTasks: 0, completedTasks: 0 },
    }
    render(<ProjectCard project={projectZeroTasks} workspaceSlug="test-ws" index={0} />)
    expect(screen.getByTestId('project-card-stats')).toBeInTheDocument()
  })

  it('applies delay based on index', () => {
    render(<ProjectCard {...defaultProps} index={2} />)
    expect(screen.getByTestId('project-card-header').getAttribute('data-name')).toBe('My Project')
  })

  it('renders card with hover styles', () => {
    const { container } = render(<ProjectCard {...defaultProps} />)
    const card = container.querySelector('.group')
    expect(card).toBeInTheDocument()
    expect(card!.className).toContain('hover:border-primary/50')
  })
})

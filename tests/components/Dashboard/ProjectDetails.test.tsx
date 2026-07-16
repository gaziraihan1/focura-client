import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../../utils/renderWithProviders'
import ProjectStats from '@/components/Dashboard/ProjectDetails/ProjectStats'
import AllStats from '@/components/Dashboard/ProjectDetails/AllStats'
import StatCard from '@/components/Dashboard/ProjectDetails/StatCard'
import ProjectsTopPerformer from '@/components/Dashboard/ProjectDetails/ProjectsTopPerformer'
import PerformerEmptyState from '@/components/Dashboard/ProjectDetails/PerformerEmptyState'
import { AccessDeniedProject } from '@/components/Dashboard/ProjectDetails/AccessDeniedProject'

const mockProject = {
  id: 'proj-1',
  name: 'Test Project',
  slug: 'test-project',
  description: 'A test project',
  status: 'ACTIVE',
  priority: 'HIGH',
  color: '#3b82f6',
  startDate: '2026-01-01T00:00:00Z',
  dueDate: '2026-12-31T00:00:00Z',
  createdAt: '2026-01-01T00:00:00Z',
  workspace: {
    id: 'ws-1',
    name: 'Test Workspace',
    slug: 'test-workspace',
  },
  members: [],
  stats: {
    totalTasks: 25,
    completedTasks: 12,
    totalMembers: 5,
    totalAnnouncement: 3,
    projectDays: 180,
    topPerformer: {
      id: 'user-1',
      name: 'John Doe',
      taskCount: 10,
      completedTasks: 8,
    },
  },
  isAdmin: true,
} as any

describe('ProjectDetails/ProjectStats', () => {
  const defaultProps = {
    activeTab: 'tasks',
    setActiveTab: vi.fn(),
    project: mockProject,
  }

  it('renders tasks tab', () => {
    render(<ProjectStats {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Tasks (25)')).toBeInTheDocument()
  })

  it('renders announcements tab', () => {
    render(<ProjectStats {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Announcement (3)')).toBeInTheDocument()
  })

  it('renders members tab', () => {
    render(<ProjectStats {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Members (5)')).toBeInTheDocument()
  })

  it('calls setActiveTab when tasks tab is clicked', async () => {
    const setActiveTab = vi.fn()
    render(<ProjectStats {...defaultProps} setActiveTab={setActiveTab} />, { wrapper: createWrapper() })
    const tasksTab = screen.getByText('Tasks (25)')
    await tasksTab.click()
    expect(setActiveTab).toHaveBeenCalledWith('tasks')
  })

  it('calls setActiveTab when announcements tab is clicked', async () => {
    const setActiveTab = vi.fn()
    render(<ProjectStats {...defaultProps} setActiveTab={setActiveTab} />, { wrapper: createWrapper() })
    const announcementsTab = screen.getByText('Announcement (3)')
    await announcementsTab.click()
    expect(setActiveTab).toHaveBeenCalledWith('announcements')
  })

  it('calls setActiveTab when members tab is clicked', async () => {
    const setActiveTab = vi.fn()
    render(<ProjectStats {...defaultProps} setActiveTab={setActiveTab} />, { wrapper: createWrapper() })
    const membersTab = screen.getByText('Members (5)')
    await membersTab.click()
    expect(setActiveTab).toHaveBeenCalledWith('members')
  })

  it('highlights active tab', () => {
    render(<ProjectStats {...defaultProps} activeTab="tasks" />, { wrapper: createWrapper() })
    const tasksTab = screen.getByText('Tasks (25)')
    expect(tasksTab).toHaveClass('border-primary')
  })

  it('renders inactive tab styling', () => {
    render(<ProjectStats {...defaultProps} activeTab="tasks" />, { wrapper: createWrapper() })
    const announcementsTab = screen.getByText('Announcement (3)')
    expect(announcementsTab).toHaveClass('border-transparent')
  })
})

describe('ProjectDetails/AllStats', () => {
  const defaultProps = {
    completionRate: 48,
    project: mockProject,
  }

  it('renders total tasks', () => {
    render(<AllStats {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('renders team members', () => {
    render(<AllStats {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Team Members')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders project days', () => {
    render(<AllStats {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Project Days')).toBeInTheDocument()
    expect(screen.getByText('180')).toBeInTheDocument()
  })

  it('renders completion rate', () => {
    render(<AllStats {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Completion')).toBeInTheDocument()
    expect(screen.getByText('48%')).toBeInTheDocument()
  })

  it('renders top performer when available', () => {
    render(<AllStats {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders empty state when no top performer', () => {
    const projectWithoutPerformer = {
      ...mockProject,
      stats: { ...mockProject.stats, topPerformer: null },
    }
    render(<AllStats {...defaultProps} project={projectWithoutPerformer} />, { wrapper: createWrapper() })
    expect(screen.getByText('No completed tasks yet')).toBeInTheDocument()
  })
})

describe('ProjectDetails/StatCard', () => {
  it('renders stat card with label and value', () => {
    render(
      <StatCard icon={vi.fn()} label="Total Tasks" value={25} color="text-blue-500" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('renders stat card with string value', () => {
    render(
      <StatCard icon={vi.fn()} label="Completion" value="85%" color="text-green-500" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Completion')).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()
  })

  it('renders stat card with zero value', () => {
    render(
      <StatCard icon={vi.fn()} label="Overdue" value={0} color="text-red-500" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})

describe('ProjectDetails/ProjectsTopPerformer', () => {
  it('renders top performer name', () => {
    render(<ProjectsTopPerformer project={mockProject} />, { wrapper: createWrapper() })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders task count', () => {
    render(<ProjectsTopPerformer project={mockProject} />, { wrapper: createWrapper() })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders completed tasks', () => {
    render(<ProjectsTopPerformer project={mockProject} />, { wrapper: createWrapper() })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders top performer badge', () => {
    render(<ProjectsTopPerformer project={mockProject} />, { wrapper: createWrapper() })
    expect(screen.getByText('Top Performer')).toBeInTheDocument()
  })

  it('renders crown icon', () => {
    render(<ProjectsTopPerformer project={mockProject} />, { wrapper: createWrapper() })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})

describe('ProjectDetails/PerformerEmptyState', () => {
  it('renders empty state message', () => {
    render(<PerformerEmptyState />, { wrapper: createWrapper() })
    expect(screen.getByText('No completed tasks yet')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<PerformerEmptyState />, { wrapper: createWrapper() })
    expect(screen.getByText('No completed tasks yet')).toBeInTheDocument()
  })
})

describe('ProjectDetails/AccessDeniedProject', () => {
  it('renders access denied message', () => {
    render(<AccessDeniedProject />, { wrapper: createWrapper() })
    expect(screen.getByText('Access Denied')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<AccessDeniedProject />, { wrapper: createWrapper() })
    expect(screen.getByText(/You don't have permission to view this project/)).toBeInTheDocument()
  })

  it('renders go back button', () => {
    render(<AccessDeniedProject />, { wrapper: createWrapper() })
    expect(screen.getByText('Go Back')).toBeInTheDocument()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskSidebar } from '@/components/Dashboard/TaskDetails/TaskSidebar'

vi.mock('lucide-react', () => ({
  Clock: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="clock-icon" {...props} />,
  Calendar: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="calendar-icon" {...props} />,
  User: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="user-icon" {...props} />,
  Folder: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="folder-icon" {...props} />,
  Check: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="check-icon" {...props} />,
  Lock: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="lock-icon" {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name }: { name: string }) => <div data-testid="avatar">{name}</div>,
}))

const createMockTask = (overrides = {}) => ({
  id: 'task-1',
  title: 'Test Task',
  description: 'Test description',
  status: 'TODO' as const,
  priority: 'HIGH' as const,
  dueDate: '2026-07-20T00:00:00Z',
  startDate: '2026-07-15T00:00:00Z',
  completedAt: null,
  estimatedHours: 8,
  actualHours: null,
  createdAt: '2026-07-10T00:00:00Z',
  updatedAt: '2026-07-10T00:00:00Z',
  projectId: 'proj-1',
  intent: 'EXECUTION' as const,
  createdBy: { id: 'user-1', name: 'John Doe', email: 'john@test.com' },
  assignees: [
    { user: { id: 'user-1', name: 'John Doe' }, userId: 'user-1', taskId: 'task-1', role: 'OWNER' as const },
  ],
  labels: [{ id: 'l1', labelId: 'label-1', taskId: 'task-1', label: { id: 'label-1', name: 'Frontend', color: '#3b82f6' } }],
  _count: { comments: 3, subtasks: 2, files: 1 },
  ...overrides,
})

describe('TaskSidebar', () => {
  const defaultProps = {
    task: createMockTask(),
    isPersonalTask: false,
    isUpdatingStatus: false,
    onStatusChange: vi.fn(),
    canChangeStatus: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders status section', () => {
    render(<TaskSidebar {...defaultProps} />)
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders priority section', () => {
    render(<TaskSidebar {...defaultProps} />)
    expect(screen.getByText('Priority')).toBeInTheDocument()
  })

  it('renders task priority value', () => {
    render(<TaskSidebar {...defaultProps} />)
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('renders details section', () => {
    render(<TaskSidebar {...defaultProps} />)
    expect(screen.getByText('Details')).toBeInTheDocument()
  })

  it('renders project name when task has project', () => {
    const task = createMockTask({
      project: { id: 'proj-1', name: 'My Project', color: '#3b82f6', slug: 'my-project' },
    })
    render(<TaskSidebar {...defaultProps} task={task} />)
    expect(screen.getByText('My Project')).toBeInTheDocument()
  })

  it('renders estimated hours when available', () => {
    render(<TaskSidebar {...defaultProps} />)
    expect(screen.getByText('8h')).toBeInTheDocument()
    expect(screen.getByText('Estimated Hours')).toBeInTheDocument()
  })

  it('renders start date when available', () => {
    render(<TaskSidebar {...defaultProps} />)
    expect(screen.getByText('Start Date')).toBeInTheDocument()
  })

  it('renders due date when available', () => {
    render(<TaskSidebar {...defaultProps} />)
    expect(screen.getByText('Due Date')).toBeInTheDocument()
  })

  it('renders created by info', () => {
    render(<TaskSidebar {...defaultProps} />)
    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0)
    expect(screen.getByText('Created By')).toBeInTheDocument()
  })

  it('renders assignees when available', () => {
    render(<TaskSidebar {...defaultProps} />)
    expect(screen.getByText('Assignees')).toBeInTheDocument()
  })

  it('renders labels', () => {
    render(<TaskSidebar {...defaultProps} />)
    expect(screen.getByText('Frontend')).toBeInTheDocument()
  })

  it('shows status select when canChangeStatus is true', () => {
    render(<TaskSidebar {...defaultProps} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(select).not.toBeDisabled()
  })

  it('shows locked status when canChangeStatus is false', () => {
    render(<TaskSidebar {...defaultProps} canChangeStatus={false} />)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByText(/don't have permission/)).toBeInTheDocument()
  })

  it('calls onStatusChange when status is changed', () => {
    render(<TaskSidebar {...defaultProps} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'IN_PROGRESS' } })
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith('IN_PROGRESS')
  })

  it('disables status select when updating', () => {
    render(<TaskSidebar {...defaultProps} isUpdatingStatus={true} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
  })

  it('hides In Review and Blocked options for personal tasks', () => {
    render(<TaskSidebar {...defaultProps} isPersonalTask={true} />)
    const select = screen.getByRole('combobox')
    const options = Array.from(select.querySelectorAll('option'))
    const values = options.map((o) => o.getAttribute('value'))
    expect(values).not.toContain('IN_REVIEW')
    expect(values).not.toContain('BLOCKED')
    expect(values).not.toContain('CANCELLED')
  })

  it('shows personal task hint for personal tasks', () => {
    render(<TaskSidebar {...defaultProps} isPersonalTask={true} />)
    expect(screen.getByText(/Personal tasks support/)).toBeInTheDocument()
  })

  it('renders completed date when task is completed', () => {
    const task = createMockTask({ completedAt: '2026-07-18T00:00:00Z' })
    render(<TaskSidebar {...defaultProps} task={task} />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('renders created date', () => {
    render(<TaskSidebar {...defaultProps} />)
    expect(screen.getAllByText(/Created/).length).toBeGreaterThan(0)
  })
})

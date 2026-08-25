import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '@/tests/utils/renderWithProviders'
import { TaskCard } from '@/components/dashboard/tasks/all-tasks/TaskCard'

const mockTask = {
  id: 'task-1',
  title: 'Complete Testing Roadmap',
  description: 'A task description',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  dueDate: '2026-07-15T00:00:00Z',
  startDate: null,
  estimatedHours: null,
  assignees: [],
  labels: [],
  _count: { comments: 0, subtasks: 0, files: 0 },
  project: {
    id: 'proj-1',
    name: 'Testing Suite',
    color: '#3b82f6',
    slug: 'testing-suite',
  },
} as any;

describe('TaskCard', () => {
  it('renders task title and status correctly', () => {
    render(<TaskCard task={mockTask} index={0} />, { wrapper: createWrapper() })

    expect(screen.getByText('Complete Testing Roadmap')).toBeInTheDocument()
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
  })

  it('renders project badge when project is present', () => {
    render(<TaskCard task={mockTask} index={0} />, { wrapper: createWrapper() })

    expect(screen.getByText('Testing Suite')).toBeInTheDocument()
  })

  it('does not render a due date chip when dueDate is missing', () => {
    const { container } = render(
      <TaskCard task={{ ...mockTask, dueDate: null }} index={0} />,
      { wrapper: createWrapper() }
    )

    expect(container).toBeInTheDocument()
  })

  it('wraps the card in a link to the task details page', () => {
    render(<TaskCard task={mockTask} index={0} />, { wrapper: createWrapper() })

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/dashboard/tasks/task-1')
  })
})

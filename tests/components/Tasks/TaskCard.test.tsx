import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../../utils/renderWithProviders'
import TaskCard from '@/components/Tasks/TaskCard'

const mockTask = {
  id: 'task-1',
  title: 'Complete Testing Roadmap',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  dueDate: '2026-07-15T00:00:00Z',
  project: {
    id: 'proj-1',
    name: 'Testing Suite',
    color: '#3b82f6',
  },
} as any;

describe('TaskCard', () => {
  it('renders task title and status correctly', () => {
    render(<TaskCard task={mockTask} />, { wrapper: createWrapper() })

    expect(screen.getByText('Complete Testing Roadmap')).toBeInTheDocument()
    expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument()
  })

  it('renders project badge when project is present', () => {
    render(<TaskCard task={mockTask} />, { wrapper: createWrapper() })

    expect(screen.getByText('Testing Suite')).toBeInTheDocument()
  })

  it('renders "No due date" when dueDate is missing', () => {
    const taskWithoutDate = { ...mockTask, dueDate: null }
    render(<TaskCard task={taskWithoutDate} />, { wrapper: createWrapper() })

    expect(screen.getByText(/No due date/i)).toBeInTheDocument()
  })

  it('renders a link to the task details page', () => {
    render(<TaskCard task={mockTask} />, { wrapper: createWrapper() })

    const link = screen.getByRole('link', { name: /View →/i })
    expect(link).toHaveAttribute('href', '/tasks/task-1')
  })
})

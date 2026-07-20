import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DetailedTaskCard from '@/components/Dashboard/CalendarView/DetailedTaskCard'

describe('DetailedTaskCard', () => {
  const baseTask = {
    id: 't-1', title: 'Test Task', description: 'A description',
    status: 'TODO', priority: 'HIGH',
    assignees: [], _count: { comments: 2, subtasks: 3, files: 1 },
    estimatedHours: 5, project: null,
  }

  it('renders task title', () => {
    render(<DetailedTaskCard task={baseTask as any as Record<string, unknown>} onClick={vi.fn()} variant="high" />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<DetailedTaskCard task={baseTask as any as Record<string, unknown>} onClick={vi.fn()} variant="high" />)
    expect(screen.getByText('A description')).toBeInTheDocument()
  })

  it('shows estimated hours', () => {
    render(<DetailedTaskCard task={baseTask as any as Record<string, unknown>} onClick={vi.fn()} variant="high" />)
    expect(screen.getByText('5h')).toBeInTheDocument()
  })

  it('shows "Personal" when no assignees', () => {
    render(<DetailedTaskCard task={baseTask as any as Record<string, unknown>} onClick={vi.fn()} variant="low" />)
    expect(screen.getByText('Personal')).toBeInTheDocument()
  })

  it('shows assignee count when assignees exist', () => {
    const task = { ...baseTask, assignees: [{ user: { id: 'u-1' } }, { user: { id: 'u-2' } }] }
    render(<DetailedTaskCard task={task as any as Record<string, unknown>} onClick={vi.fn()} variant="medium" />)
    expect(screen.getByText('2 assignees')).toBeInTheDocument()
  })

  it('shows project name when task has project', () => {
    const task = { ...baseTask, project: { name: 'My Project', color: '#3b82f6' } }
    render(<DetailedTaskCard task={task as any as Record<string, unknown>} onClick={vi.fn()} variant="urgent" />)
    expect(screen.getByText('My Project')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const { userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<DetailedTaskCard task={baseTask as any as Record<string, unknown>} onClick={onClick} variant="overdue" />)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders all variant styles without error', () => {
    const variants = ['overdue', 'urgent', 'high', 'medium', 'low'] as const
    variants.forEach(v => {
      const { unmount } = render(<DetailedTaskCard task={baseTask as any as Record<string, unknown>} onClick={vi.fn()} variant={v} />)
      expect(screen.getByText('Test Task')).toBeInTheDocument()
      unmount()
    })
  })

  it('shows comment, subtask, and file counts', () => {
    const { container } = render(<DetailedTaskCard task={baseTask as any as Record<string, unknown>} onClick={vi.fn()} variant="low" />)
    const spans = container.querySelectorAll('.ml-auto span')
    expect(spans.length).toBeGreaterThanOrEqual(3)
  })
})

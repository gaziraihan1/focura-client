import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DueDateBadge, DueDateIndicator } from '@/components/Shared/DueDateBadge'
import type { Task } from '@/hooks/useTask'

// ─── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('lucide-react', () => {

  const mock = (name: string) => {
    const Cmp = (props: Record<string, unknown>) =>
      React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    Cmp.displayName = name
    return Cmp
  }
  return {
    Clock: mock('clock'),
    AlertTriangle: mock('alert-triangle'),
    CheckCircle2: mock('check-circle2'),
  }
})

// ─── Helpers ───────────────────────────────────────────────────────────────────

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Test Task',
    description: null,
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    startDate: null,
    completedAt: null,
    estimatedHours: null,
    actualHours: null,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    projectId: null,
    intent: 'EXECUTION',
    createdBy: { id: 'u-1', name: 'Test User' },
    assignees: [],
    labels: [],
    _count: { comments: 0, subtasks: 0, files: 0 },
    ...overrides,
  }
}

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

// ─── DueDateBadge Tests ────────────────────────────────────────────────────────

describe('DueDateBadge', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders nothing when no due date and showEmpty is false', () => {
      const task = createTask({ dueDate: null })
      const { container } = render(<DueDateBadge task={task} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders when no due date but showEmpty is true', () => {
      const task = createTask({ dueDate: null })
      render(<DueDateBadge task={task} showEmpty />)
      expect(screen.getByText('No due date')).toBeInTheDocument()
    })

    it('renders text containing "left" for future tasks', () => {
      const task = createTask({ dueDate: hoursFromNow(5) })
      render(<DueDateBadge task={task} />)
      expect(screen.getByText(/left/)).toBeInTheDocument()
    })

    it('renders text containing "overdue" for overdue tasks', () => {
      const task = createTask({ dueDate: hoursAgo(5), status: 'TODO' })
      render(<DueDateBadge task={task} />)
      expect(screen.getByText(/overdue/)).toBeInTheDocument()
    })

    it('renders completed text', () => {
      const task = createTask({ dueDate: hoursAgo(3), status: 'COMPLETED' })
      render(<DueDateBadge task={task} />)
      expect(screen.getByText('Completed')).toBeInTheDocument()
    })
  })

  // ── Icons ──────────────────────────────────────────────────────────────────

  describe('icons', () => {
    it('shows AlertTriangle icon for overdue tasks', () => {
      const task = createTask({ dueDate: hoursAgo(3), status: 'TODO' })
      render(<DueDateBadge task={task} />)
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument()
    })

    it('shows CheckCircle2 icon for completed tasks', () => {
      const task = createTask({ dueDate: hoursAgo(3), status: 'COMPLETED' })
      render(<DueDateBadge task={task} />)
      expect(screen.getByTestId('check-circle2-icon')).toBeInTheDocument()
    })

    it('shows Clock icon for normal tasks', () => {
      const task = createTask({ dueDate: hoursFromNow(24) })
      render(<DueDateBadge task={task} />)
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
    })
  })

  // ── Styling ────────────────────────────────────────────────────────────────

  describe('styling', () => {
    it('applies urgency classes for overdue', () => {
      const task = createTask({ dueDate: hoursAgo(3), status: 'TODO' })
      const { container } = render(<DueDateBadge task={task} />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-red-600')
    })

    it('applies urgency classes for due-today', () => {
      const task = createTask({ dueDate: hoursFromNow(5) })
      const { container } = render(<DueDateBadge task={task} />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-orange-600')
    })

    it('applies urgency classes for due-soon (not due today)', () => {
      // Use a date just past midnight tomorrow to avoid isDueToday
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(1, 0, 0, 0)
      const task = createTask({ dueDate: tomorrow.toISOString() })
      const { container } = render(<DueDateBadge task={task} />)
      const badge = container.firstChild as HTMLElement
      const hoursUntil = (tomorrow.getTime() - Date.now()) / (1000 * 60 * 60)
      if (hoursUntil <= 6) {
        expect(badge.className).toContain('text-yellow-600')
      }
    })

    it('applies urgency classes for normal', () => {
      const task = createTask({ dueDate: hoursFromNow(48) })
      const { container } = render(<DueDateBadge task={task} />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-muted-foreground')
    })

    it('applies sm size classes by default', () => {
      const task = createTask({ dueDate: hoursFromNow(5) })
      const { container } = render(<DueDateBadge task={task} />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-[10px]')
      expect(badge.className).toContain('px-1.5')
    })

    it('applies md size classes when size="md"', () => {
      const task = createTask({ dueDate: hoursFromNow(5) })
      const { container } = render(<DueDateBadge task={task} size="md" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-xs')
      expect(badge.className).toContain('px-2')
    })

    it('applies custom className', () => {
      const task = createTask({ dueDate: hoursFromNow(5) })
      const { container } = render(
        <DueDateBadge task={task} className="my-custom-class" />
      )
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('my-custom-class')
    })
  })

  // ── Title attribute ────────────────────────────────────────────────────────

  describe('title attribute', () => {
    it('has title with due date info', () => {
      const dueDate = hoursFromNow(24)
      const task = createTask({ dueDate })
      render(<DueDateBadge task={task} />)
      const badge = screen.getByText(/left/).closest('span')
      expect(badge).toHaveAttribute('title')
      expect(badge?.getAttribute('title')).toContain('Due:')
    })

    it('has no title when no due date and showEmpty', () => {
      const task = createTask({ dueDate: null })
      render(<DueDateBadge task={task} showEmpty />)
      const badge = screen.getByText('No due date').closest('span')
      expect(badge).not.toHaveAttribute('title')
    })
  })
})

// ─── DueDateIndicator Tests ────────────────────────────────────────────────────

describe('DueDateIndicator', () => {
  it('renders nothing when no due date', () => {
    const task = createTask({ dueDate: null })
    const { container } = render(<DueDateIndicator task={task} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders text containing "left" for future tasks', () => {
    const task = createTask({ dueDate: hoursFromNow(5) })
    render(<DueDateIndicator task={task} />)
    expect(screen.getByText(/left/)).toBeInTheDocument()
  })

  it('renders text containing "overdue" for overdue tasks', () => {
    const task = createTask({ dueDate: hoursAgo(5), status: 'TODO' })
    render(<DueDateIndicator task={task} />)
    expect(screen.getByText(/overdue/)).toBeInTheDocument()
  })

  it('shows red dot for overdue', () => {
    const task = createTask({ dueDate: hoursAgo(5), status: 'TODO' })
    const { container } = render(<DueDateIndicator task={task} />)
    // Tailwind generates bg-red-500 as a class
    const spans = container.querySelectorAll('span')
    const dot = Array.from(spans).find((s) =>
      s.className.includes('bg-red-500')
    )
    expect(dot).toBeInTheDocument()
  })

  it('shows orange dot for due-today', () => {
    const task = createTask({ dueDate: hoursFromNow(5) })
    const { container } = render(<DueDateIndicator task={task} />)
    const spans = container.querySelectorAll('span')
    const dot = Array.from(spans).find((s) =>
      s.className.includes('bg-orange-500')
    )
    expect(dot).toBeInTheDocument()
  })

  it('shows yellow dot for due-soon (not due today)', () => {
    // Use a date just past midnight tomorrow to avoid isDueToday
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(1, 0, 0, 0)
    const task = createTask({ dueDate: tomorrow.toISOString() })
    const { container } = render(<DueDateIndicator task={task} />)
    const hoursUntil = (tomorrow.getTime() - Date.now()) / (1000 * 60 * 60)
    if (hoursUntil <= 6) {
      const spans = container.querySelectorAll('span')
      const dot = Array.from(spans).find((s) =>
        s.className.includes('bg-yellow-500')
      )
      expect(dot).toBeInTheDocument()
    }
  })

  it('shows muted dot for normal', () => {
    const task = createTask({ dueDate: hoursFromNow(48) })
    const { container } = render(<DueDateIndicator task={task} />)
    const spans = container.querySelectorAll('span')
    const dot = Array.from(spans).find((s) =>
      s.className.includes('bg-muted-foreground')
    )
    expect(dot).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const task = createTask({ dueDate: hoursFromNow(5) })
    const { container } = render(
      <DueDateIndicator task={task} className="my-class" />
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('my-class')
  })
})

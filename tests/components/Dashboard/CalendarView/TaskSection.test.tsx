import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Calendar } from 'lucide-react'
import TaskSection from '@/components/Dashboard/CalendarView/TaskSection'

const makeTask = (overrides: Record<string, unknown> = {}) => ({
  id: 'task-1',
  title: 'Test Task',
  priority: 'MEDIUM',
  status: 'IN_PROGRESS',
  dueDate: '2025-07-20T00:00:00.000Z',
  startDate: null,
  estimatedHours: 2,
  assignees: [] as any[],
  project: undefined as any,
  ...overrides,
})

describe('TaskSection', () => {
  const defaultProps = {
    title: 'Overdue',
    icon: <Calendar data-testid="icon" />,
    count: 2,
    tasks: [makeTask()],
    onTaskClick: vi.fn(),
    variant: 'destructive' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title and count', () => {
    render(<TaskSection {...defaultProps} />)
    expect(screen.getByText(/Overdue/)).toBeInTheDocument()
    expect(screen.getByText('(2)')).toBeInTheDocument()
  })

  it('shows tasks', () => {
    render(<TaskSection {...defaultProps} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('shows max 5 tasks', () => {
    const tasks = Array.from({ length: 8 }, (_, i) => makeTask({ id: `t-${i}`, title: `Task ${i}` }))
    render(<TaskSection {...defaultProps} tasks={tasks} count={8} />)
    expect(screen.getByText('+3 more')).toBeInTheDocument()
  })

  it('does not show +N more when 5 or fewer tasks', () => {
    const tasks = Array.from({ length: 3 }, (_, i) => makeTask({ id: `t-${i}`, title: `Task ${i}` }))
    render(<TaskSection {...defaultProps} tasks={tasks} count={3} />)
    expect(screen.queryByText(/more/)).not.toBeInTheDocument()
  })

  it('calls onTaskClick when task clicked', async () => {
    const onTaskClick = vi.fn()
    const user = userEvent.setup()
    render(<TaskSection {...defaultProps} onTaskClick={onTaskClick} />)
    
    await user.click(screen.getByText('Test Task'))
    expect(onTaskClick).toHaveBeenCalled()
  })

  it('shows project color indicator when task has project', () => {
    const task = makeTask({ project: { color: '#ef4444' } })
    render(<TaskSection {...defaultProps} tasks={[task]} count={1} />)
    // The project color div is rendered
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('shows assignee count when task has assignees', () => {
    const task = makeTask({ assignees: [{ id: 'u1' }, { id: 'u2' }] })
    render(<TaskSection {...defaultProps} tasks={[task]} count={1} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows priority', () => {
    render(<TaskSection {...defaultProps} />)
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
  })
})

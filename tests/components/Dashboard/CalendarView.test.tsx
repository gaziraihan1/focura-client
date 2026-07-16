import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../../utils/renderWithProviders'
import { CalendarDay } from '@/components/Dashboard/CalendarView/CalendarDay'
import { CalendarGrid } from '@/components/Dashboard/CalendarView/CalendarGrid'
import TaskPill from '@/components/Dashboard/CalendarView/TaskPill'
import StatCard from '@/components/Dashboard/CalendarView/StatCard'

const mockTask = {
  id: 'task-1',
  title: 'Test Calendar Task',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  dueDate: '2026-07-15T00:00:00Z',
  startDate: '2026-07-10T00:00:00Z',
  estimatedHours: 5,
  assignees: [
    { user: { id: 'user-1', name: 'John Doe' } },
  ],
  project: {
    id: 'proj-1',
    name: 'Test Project',
    color: '#3b82f6',
  },
} as any

describe('CalendarView/CalendarDay', () => {
  const defaultProps = {
    date: new Date('2026-07-15'),
    tasks: [],
    density: 0,
    isCurrentMonth: true,
    isToday: false,
    isPast: false,
    onTaskClick: vi.fn(),
  }

  it('renders day number', () => {
    render(<CalendarDay {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('renders tasks for the day', () => {
    render(<CalendarDay {...defaultProps} tasks={[mockTask]} density={1} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })

  it('renders "Free time" when no tasks', () => {
    render(<CalendarDay {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Free time')).toBeInTheDocument()
  })

  it('does not render "Free time" when not current month', () => {
    render(<CalendarDay {...defaultProps} isCurrentMonth={false} />, { wrapper: createWrapper() })
    expect(screen.queryByText('Free time')).not.toBeInTheDocument()
  })

  it('renders task count badge', () => {
    render(<CalendarDay {...defaultProps} tasks={[mockTask]} density={1} />, { wrapper: createWrapper() })
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renders +N more when more than 4 tasks', () => {
    const tasks = Array.from({ length: 6 }, (_, i) => ({
      ...mockTask,
      id: `task-${i}`,
      title: `Task ${i}`,
    }))
    render(<CalendarDay {...defaultProps} tasks={tasks} density={6} />, { wrapper: createWrapper() })
    expect(screen.getByText('+2 more')).toBeInTheDocument()
  })

  it('calls onTaskClick when task is clicked', async () => {
    const onTaskClick = vi.fn()
    render(
      <CalendarDay {...defaultProps} tasks={[mockTask]} density={1} onTaskClick={onTaskClick} />,
      { wrapper: createWrapper() }
    )
    const taskButton = screen.getByText('Test Calendar Task')
    await taskButton.click()
    expect(onTaskClick).toHaveBeenCalledWith(mockTask)
  })

  it('renders today with special styling', () => {
    render(<CalendarDay {...defaultProps} isToday={true} />, { wrapper: createWrapper() })
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('renders past date with reduced opacity', () => {
    render(<CalendarDay {...defaultProps} isPast={true} isCurrentMonth={true} />, { wrapper: createWrapper() })
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('renders high density with warning color', () => {
    render(<CalendarDay {...defaultProps} density={5} />, { wrapper: createWrapper() })
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders critical density with alert icon', () => {
    render(<CalendarDay {...defaultProps} density={8} />, { wrapper: createWrapper() })
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('renders task with overdue status', () => {
    const overdueTask = {
      ...mockTask,
      dueDate: '2026-07-10T00:00:00Z',
      status: 'TODO',
    }
    render(<CalendarDay {...defaultProps} tasks={[overdueTask]} density={1} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })

  it('renders task without project', () => {
    const taskWithoutProject = { ...mockTask, project: null }
    render(<CalendarDay {...defaultProps} tasks={[taskWithoutProject]} density={1} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })

  it('renders task without estimated hours', () => {
    const taskWithoutHours = { ...mockTask, estimatedHours: null }
    render(<CalendarDay {...defaultProps} tasks={[taskWithoutHours]} density={1} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })
})

describe('CalendarView/TaskPill', () => {
  const defaultProps = {
    task: mockTask,
    isPersonal: false,
    isOverdue: false,
    onClick: vi.fn(),
  }

  it('renders task title', () => {
    render(<TaskPill {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    render(<TaskPill {...defaultProps} />, { wrapper: createWrapper() })
    const button = screen.getByRole('button')
    await button.click()
    expect(defaultProps.onClick).toHaveBeenCalled()
  })

  it('renders personal task without users icon', () => {
    render(<TaskPill {...defaultProps} isPersonal={true} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })

  it('renders assigned task with users icon', () => {
    render(<TaskPill {...defaultProps} isPersonal={false} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })

  it('renders task with estimated hours', () => {
    render(<TaskPill {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('5h')).toBeInTheDocument()
  })

  it('renders task without estimated hours', () => {
    const taskWithoutHours = { ...mockTask, estimatedHours: null }
    render(<TaskPill {...defaultProps} task={taskWithoutHours} />, { wrapper: createWrapper() })
    expect(screen.queryByText('5h')).not.toBeInTheDocument()
  })

  it('renders overdue task with special styling', () => {
    render(<TaskPill {...defaultProps} isOverdue={true} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })

  it('renders task with project color bar', () => {
    render(<TaskPill {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })

  it('renders task without project', () => {
    const taskWithoutProject = { ...mockTask, project: null }
    render(<TaskPill {...defaultProps} task={taskWithoutProject} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })

  it('renders URGENT priority', () => {
    const urgentTask = { ...mockTask, priority: 'URGENT' }
    render(<TaskPill {...defaultProps} task={urgentTask} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })

  it('renders HIGH priority', () => {
    const highTask = { ...mockTask, priority: 'HIGH' }
    render(<TaskPill {...defaultProps} task={highTask} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })

  it('renders MEDIUM priority', () => {
    const mediumTask = { ...mockTask, priority: 'MEDIUM' }
    render(<TaskPill {...defaultProps} task={mediumTask} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })

  it('renders LOW priority', () => {
    const lowTask = { ...mockTask, priority: 'LOW' }
    render(<TaskPill {...defaultProps} task={lowTask} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })
})

describe('CalendarView/CalendarGrid', () => {
  const defaultProps = {
    currentDate: new Date('2026-07-15'),
    view: 'month' as const,
    tasks: [],
    dateRange: {
      start: new Date('2026-07-01'),
      end: new Date('2026-07-31'),
    },
    onTaskClick: vi.fn(),
    isLoading: false,
  }

  it('renders month view', () => {
    render(<CalendarGrid {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByText('Thu')).toBeInTheDocument()
    expect(screen.getByText('Fri')).toBeInTheDocument()
    expect(screen.getByText('Sat')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    render(<CalendarGrid {...defaultProps} isLoading={true} />, { wrapper: createWrapper() })
    expect(screen.getByText('Loading calendar...')).toBeInTheDocument()
  })

  it('renders tasks in calendar', () => {
    render(<CalendarGrid {...defaultProps} tasks={[mockTask]} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Calendar Task')).toBeInTheDocument()
  })

  it('renders calendar days', () => {
    render(<CalendarGrid {...defaultProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('31')).toBeInTheDocument()
  })
})

describe('CalendarView/StatCard', () => {
  it('renders stat card with label and value', () => {
    render(
      <StatCard label="Total Tasks" value={25} icon={<span>icon</span>} color="text-blue-500" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('renders stat card with zero value', () => {
    render(
      <StatCard label="Overdue" value={0} icon={<span>icon</span>} color="text-red-500" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})

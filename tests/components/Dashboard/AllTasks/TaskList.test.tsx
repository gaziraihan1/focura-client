import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TaskList } from '@/components/Dashboard/AllTasks/TaskList'

vi.mock('@/components/Dashboard/AllTasks/TaskCard', () => ({
  TaskCard: ({ task }: any) => <div data-testid="task-card">{task.title}</div>,
}))
vi.mock('@/components/Dashboard/AllTasks/FocusTaskCard', () => ({
  FocusTaskCard: ({ task }: any) => <div data-testid="focus-task-card">{task.title}</div>,
}))

const mockTasks = [
  { id: 't-1', title: 'Task One', status: 'TODO', priority: 'HIGH' },
  { id: 't-2', title: 'Task Two', status: 'COMPLETED', priority: 'LOW' },
]

describe('TaskList', () => {
  const defaultProps = {
    tasks: [] as any[],
    focusedTaskId: null,
    focusTimeRemaining: 0,
    isLoading: false,
    isError: false,
    searchQuery: '',
    onCreateTask: vi.fn(),
  }

  it('shows loading spinner when isLoading=true', () => {
    render(<TaskList {...defaultProps} isLoading={true} />)
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('shows error state when isError=true', () => {
    render(<TaskList {...defaultProps} isError={true} />)
    expect(screen.getByText('Failed to load tasks')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('shows empty state when no tasks', () => {
    render(<TaskList {...defaultProps} />)
    expect(screen.getByText('No tasks found')).toBeInTheDocument()
  })

  it('shows "No tasks match your search" when searchQuery is set', () => {
    render(<TaskList {...defaultProps} searchQuery="nonexistent" />)
    expect(screen.getByText('No tasks match your search')).toBeInTheDocument()
  })

  it('renders task cards when tasks provided', () => {
    render(<TaskList {...defaultProps} tasks={mockTasks} />)
    expect(screen.getAllByTestId('task-card')).toHaveLength(2)
    expect(screen.getByText('Task One')).toBeInTheDocument()
    expect(screen.getByText('Task Two')).toBeInTheDocument()
  })
})

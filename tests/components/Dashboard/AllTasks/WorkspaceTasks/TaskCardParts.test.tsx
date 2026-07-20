import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  TaskCardHeader,
  TaskCardMetaChips,
  TaskCardProgressAssignees,
} from '@/components/Dashboard/AllTasks/WorkspaceTasks/TaskCardParts'
import type { Task } from '@/hooks/useTask'

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />
  return {
    CheckCircle2: icon('CheckCircle2'),
    TrendingUp: icon('TrendingUp'),
    Clock: icon('Clock'),
    Flag: icon('Flag'),
    Folder: icon('Folder'),
    Timer: icon('Timer'),
    AlertCircle: icon('AlertCircle'),
    Calendar: icon('Calendar'),
    Plus: icon('Plus'),
    Loader2: icon('Loader2'),
  }
})

vi.mock('@/utils/task.utils', () => ({
  formatTimeDuration: (h: number) => `${h}h left`,
  getPriorityColor: () => 'text-red-500',
  getStatusColor: () => 'bg-blue-500',
  getTimeStatusColor: () => 'text-green-500',
}))

vi.mock('@/utils/taskcard.utils', () => ({
  formatHoursSinceCreation: (h: number) => `${h}h`,
}))

const baseTask: Task = {
  id: 't1',
  title: 'Test Task',
  description: 'A test description',
  status: 'TODO',
  priority: 'HIGH',
  dueDate: null,
  createdBy: { id: 'u1', name: 'Alice' },
  assignees: [],
  _count: { comments: 0, subtasks: 0, files: 0 },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('TaskCardHeader', () => {
  const defaults = {
    task: baseTask,
    showButtons: true,
    isPrimaryDisabled: false,
    isInPrimary: false,
    isInSecondary: false,
    primaryDisabled: false,
    secondaryDisabled: false,
    isPrimaryLoading: false,
    isSecondaryLoading: false,
    handlePrimaryClick: vi.fn(),
    handleSecondaryClick: vi.fn(),
  }

  it('renders task title and description', () => {
    render(<TaskCardHeader {...defaults} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('A test description')).toBeInTheDocument()
  })

  it('calls handlePrimaryClick when primary button clicked', () => {
    render(<TaskCardHeader {...defaults} />)
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(defaults.handlePrimaryClick).toHaveBeenCalled()
  })
})

describe('TaskCardMetaChips', () => {
  it('renders status text', () => {
    render(<TaskCardMetaChips task={baseTask} />)
    expect(screen.getByText('TODO')).toBeInTheDocument()
  })

  it('renders project name when project exists', () => {
    const taskWithProject = {
      ...baseTask,
      project: { id: 'p1', slug: 'proj', name: 'My Project', color: '#ff0000', workspace: { id: 'w1', name: 'WS' } },
    }
    render(<TaskCardMetaChips task={taskWithProject} />)
    expect(screen.getByText('My Project')).toBeInTheDocument()
  })
})

describe('TaskCardProgressAssignees', () => {
  it('returns null when no progress and no assignees', () => {
    const { container } = render(
      <TaskCardProgressAssignees task={baseTask} progress={null} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders assignee avatars', () => {
    const taskWithAssignees = {
      ...baseTask,
      assignees: [
        { user: { id: 'u1', name: 'Alice' } },
        { user: { id: 'u2', name: 'Bob' } },
      ],
    }
    render(<TaskCardProgressAssignees task={taskWithAssignees} progress={null} />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })
})

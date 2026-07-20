import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../../utils/renderWithProviders'
import { TaskCard } from '@/components/Dashboard/AllTasks/WorkspaceTasks/TaskCard'
import { TaskList } from '@/components/Dashboard/AllTasks/WorkspaceTasks/TaskList'
import { FilterPanel } from '@/components/Dashboard/AllTasks/WorkspaceTasks/FilterPanel'
import { TaskStatsGrid } from '@/components/Dashboard/AllTasks/WorkspaceTasks/TaskStatsGrid'
import { TaskSearchAndFilters } from '@/components/Dashboard/AllTasks/WorkspaceTasks/TaskSearchAndFilters'

const mockTask = {
  id: 'task-1',
  title: 'Complete Testing Roadmap',
  description: 'Build comprehensive test suite',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  dueDate: '2026-08-01T00:00:00Z',
  estimatedHours: 10,
  timeTracking: {
    hoursSinceCreation: 48,
    hoursUntilDue: 72,
    timeProgress: 45,
  },
  project: {
    id: 'proj-1',
    name: 'Testing Suite',
    slug: 'testing-suite',
    color: '#3b82f6',
  },
  assignees: [
    { user: { id: 'user-1', name: 'John Doe', email: 'john@test.com' } },
  ],
  _count: {
    comments: 5,
    subtasks: 3,
    files: 2,
  },
} as any

const mockStats = {
  totalTasks: 25,
  inProgress: 8,
  completed: 12,
  dueToday: 3,
  overdue: 2,
}

describe('WorkspaceTasks/TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={mockTask} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('Complete Testing Roadmap')).toBeInTheDocument()
  })

  it('renders task description', () => {
    render(<TaskCard task={mockTask} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('Build comprehensive test suite')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<TaskCard task={mockTask} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
  })

  it('renders project badge', () => {
    render(<TaskCard task={mockTask} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('Testing Suite')).toBeInTheDocument()
  })

  it('renders engagement counts', () => {
    render(<TaskCard task={mockTask} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders progress bar', () => {
    render(<TaskCard task={mockTask} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('45%')).toBeInTheDocument()
  })

  it('renders assignee avatars', () => {
    render(<TaskCard task={mockTask} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('renders link to task details', () => {
    render(<TaskCard task={mockTask} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/dashboard/workspaces/test-ws/projects/testing-suite/tasks/task-1')
  })

  it('renders completed task with line-through', () => {
    const completedTask = { ...mockTask, status: 'COMPLETED' }
    render(<TaskCard task={completedTask} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('COMPLETED')).toBeInTheDocument()
  })

  it('renders task without project', () => {
    const taskWithoutProject = { ...mockTask, project: null }
    render(<TaskCard task={taskWithoutProject} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('Complete Testing Roadmap')).toBeInTheDocument()
  })

  it('renders task without time tracking', () => {
    const taskWithoutTime = { ...mockTask, timeTracking: null }
    render(<TaskCard task={taskWithoutTime} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('Complete Testing Roadmap')).toBeInTheDocument()
  })

  it('renders task without assignees', () => {
    const taskWithoutAssignees = { ...mockTask, assignees: [] }
    render(<TaskCard task={taskWithoutAssignees} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('Complete Testing Roadmap')).toBeInTheDocument()
  })

  it('renders task with more than 4 assignees', () => {
    const taskWithManyAssignees = {
      ...mockTask,
      assignees: [
        { user: { id: 'user-1', name: 'John Doe' } },
        { user: { id: 'user-2', name: 'Jane Smith' } },
        { user: { id: 'user-3', name: 'Bob Johnson' } },
        { user: { id: 'user-4', name: 'Alice Brown' } },
        { user: { id: 'user-5', name: 'Charlie Wilson' } },
      ],
    }
    render(<TaskCard task={taskWithManyAssignees} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  it('renders add buttons when showAddButtons is true', () => {
    const onAddToPrimary = vi.fn()
    const onAddToSecondary = vi.fn()
    render(
      <TaskCard
        task={mockTask}
        workspaceSlug="test-ws"
        showAddButtons={true}
        onAddToPrimary={onAddToPrimary}
        onAddToSecondary={onAddToSecondary}
      />,
      { wrapper: createWrapper() }
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('calls onAddToPrimary when primary button is clicked', async () => {
    const onAddToPrimary = vi.fn()
    render(
      <TaskCard
        task={mockTask}
        workspaceSlug="test-ws"
        showAddButtons={true}
        onAddToPrimary={onAddToPrimary}
      />,
      { wrapper: createWrapper() }
    )
    const primaryButton = screen.getAllByTitle(/Set as Primary task/i)[0]
    if (primaryButton) {
      await primaryButton.click()
      expect(onAddToPrimary).toHaveBeenCalledWith('task-1')
    }
  })

  it('calls onAddToSecondary when secondary button is clicked', async () => {
    const onAddToSecondary = vi.fn()
    render(
      <TaskCard
        task={mockTask}
        workspaceSlug="test-ws"
        showAddButtons={true}
        onAddToSecondary={onAddToSecondary}
      />,
      { wrapper: createWrapper() }
    )
    const secondaryButton = screen.getAllByTitle(/Add to Secondary/i)[0]
    if (secondaryButton) {
      await secondaryButton.click()
      expect(onAddToSecondary).toHaveBeenCalledWith('task-1')
    }
  })

  it('disables primary button when isPrimaryDisabled is true', () => {
    render(
      <TaskCard
        task={mockTask}
        workspaceSlug="test-ws"
        showAddButtons={true}
        isPrimaryDisabled={true}
      />,
      { wrapper: createWrapper() }
    )
    const primaryButton = screen.getAllByTitle(/Primary task already set/i)[0]
    expect(primaryButton).toBeDisabled()
  })

  it('disables primary button when isInPrimary is true', () => {
    render(
      <TaskCard
        task={mockTask}
        workspaceSlug="test-ws"
        showAddButtons={true}
        isInPrimary={true}
      />,
      { wrapper: createWrapper() }
    )
    const primaryButton = screen.getAllByTitle(/Already your primary task/i)[0]
    expect(primaryButton).toBeDisabled()
  })

  it('disables secondary button when isInSecondary is true', () => {
    render(
      <TaskCard
        task={mockTask}
        workspaceSlug="test-ws"
        showAddButtons={true}
        isInSecondary={true}
      />,
      { wrapper: createWrapper() }
    )
    const secondaryButton = screen.getAllByTitle(/Already a secondary task/i)[0]
    expect(secondaryButton).toBeDisabled()
  })

  it('disables buttons when loadingTaskId matches', () => {
    render(
      <TaskCard
        task={mockTask}
        workspaceSlug="test-ws"
        showAddButtons={true}
        loadingTaskId="task-1"
        loadingType="primary"
      />,
      { wrapper: createWrapper() }
    )
    const primaryButton = screen.getAllByTitle(/Set as Primary task/i)[0]
    expect(primaryButton).toBeDisabled()
  })

  it('renders without description', () => {
    const taskWithoutDescription = { ...mockTask, description: null }
    render(<TaskCard task={taskWithoutDescription} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('Complete Testing Roadmap')).toBeInTheDocument()
  })

  it('renders with zero engagement counts', () => {
    const taskWithZeroCounts = {
      ...mockTask,
      _count: { comments: 0, subtasks: 0, files: 0 },
    }
    render(<TaskCard task={taskWithZeroCounts} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('Complete Testing Roadmap')).toBeInTheDocument()
  })

  it('renders task with due date without time tracking', () => {
    const taskWithDueDate = {
      ...mockTask,
      timeTracking: null,
      dueDate: '2026-08-15T00:00:00Z',
    }
    render(<TaskCard task={taskWithDueDate} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('8/15/2026')).toBeInTheDocument()
  })
})

describe('WorkspaceTasks/TaskList', () => {
  const tasks = [mockTask, { ...mockTask, id: 'task-2', title: 'Second Task' }]

  it('renders multiple tasks', () => {
    render(<TaskList tasks={tasks} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.getByText('Complete Testing Roadmap')).toBeInTheDocument()
    expect(screen.getByText('Second Task')).toBeInTheDocument()
  })

  it('renders empty list', () => {
    render(<TaskList tasks={[]} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    expect(screen.queryByText('Complete Testing Roadmap')).not.toBeInTheDocument()
  })

  it('passes workspaceSlug to TaskCard', () => {
    render(<TaskList tasks={tasks} workspaceSlug="test-ws" />, { wrapper: createWrapper() })
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('href', expect.stringContaining('test-ws'))
    })
  })

  it('passes showAddButtons to TaskCard', () => {
    render(<TaskList tasks={tasks} workspaceSlug="test-ws" showAddButtons={true} />, { wrapper: createWrapper() })
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})

describe('WorkspaceTasks/FilterPanel', () => {
  const mockProps = {
    selectedStatus: 'all',
    onStatusChange: vi.fn(),
    selectedPriority: 'all',
    onPriorityChange: vi.fn(),
    selectedProject: 'all',
    onProjectChange: vi.fn(),
    selectedAssignee: 'all',
    onAssigneeChange: vi.fn(),
    selectedLabels: [],
    onToggleLabel: vi.fn(),
    projects: [{ id: 'proj-1', name: 'Project 1' }],
    labels: [{ id: 'label-1', name: 'Bug', color: '#ef4444' }],
    members: [{ id: 'user-1', name: 'John Doe' }],
    focusRequired: false,
    onFocusRequiredChange: vi.fn(),
  }

  it('renders status filter', () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders priority filter', () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Priority')).toBeInTheDocument()
  })

  it('renders project filter', () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Project')).toBeInTheDocument()
  })

  it('renders assignee filter', () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Assignee')).toBeInTheDocument()
  })

  it('renders labels filter when labels exist', () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Labels')).toBeInTheDocument()
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('does not render labels filter when no labels', () => {
    render(<FilterPanel {...mockProps} labels={[]} />, { wrapper: createWrapper() })
    expect(screen.queryByText('Labels')).not.toBeInTheDocument()
  })

  it('calls onStatusChange when status is changed', async () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    const selects = screen.getAllByRole('combobox')
    const statusSelect = selects[0]
    await statusSelect.click()
    expect(mockProps.onStatusChange).toBeDefined()
  })

  it('calls onPriorityChange when priority is changed', async () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    const selects = screen.getAllByRole('combobox')
    const prioritySelect = selects[1]
    await prioritySelect.click()
    expect(mockProps.onPriorityChange).toBeDefined()
  })

  it('calls onProjectChange when project is changed', async () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    const selects = screen.getAllByRole('combobox')
    const projectSelect = selects[2]
    await projectSelect.click()
    expect(mockProps.onProjectChange).toBeDefined()
  })

  it('calls onAssigneeChange when assignee is changed', async () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    const selects = screen.getAllByRole('combobox')
    const assigneeSelect = selects[3]
    await assigneeSelect.click()
    expect(mockProps.onAssigneeChange).toBeDefined()
  })

  it('calls onToggleLabel when label is clicked', async () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    const labelButton = screen.getByText('Bug')
    await labelButton.click()
    expect(mockProps.onToggleLabel).toHaveBeenCalledWith('label-1')
  })

  it('renders project options', () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Project 1')).toBeInTheDocument()
  })

  it('renders member options', () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders "All Status" option', () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('All Status')).toBeInTheDocument()
  })

  it('renders "All Priority" option', () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('All Priority')).toBeInTheDocument()
  })

  it('renders "All Projects" option', () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('All Projects')).toBeInTheDocument()
  })

  it('renders "All Assignees" option', () => {
    render(<FilterPanel {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('All Assignees')).toBeInTheDocument()
  })
})

describe('WorkspaceTasks/TaskStatsGrid', () => {
  it('renders all stat cards', () => {
    render(<TaskStatsGrid stats={mockStats} />, { wrapper: createWrapper() })
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Due Today')).toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  it('renders stat values', () => {
    render(<TaskStatsGrid stats={mockStats} />, { wrapper: createWrapper() })
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders with zero stats', () => {
    const zeroStats = {
      totalTasks: 0,
      inProgress: 0,
      completed: 0,
      dueToday: 0,
      overdue: 0,
    }
    render(<TaskStatsGrid stats={zeroStats} />, { wrapper: createWrapper() })
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getAllByText('0').length).toBeGreaterThan(0)
  })
})

describe('WorkspaceTasks/TaskSearchAndFilters', () => {
  const mockProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    showFilters: false,
    onToggleFilters: vi.fn(),
    activeFiltersCount: 0,
    sortBy: 'dueDate' as const,
    onSortChange: vi.fn(),
    selectedStatus: 'all',
    onStatusChange: vi.fn(),
    selectedPriority: 'all',
    onPriorityChange: vi.fn(),
    selectedProject: 'all',
    onProjectChange: vi.fn(),
    selectedAssignee: 'all',
    onAssigneeChange: vi.fn(),
    selectedLabels: [],
    onToggleLabel: vi.fn(),
    onClearFilters: vi.fn(),
    projects: [],
    labels: [],
    members: [],
    focusRequired: false,
    onFocusRequiredChange: vi.fn(),
  }

  it('renders search input', () => {
    render(<TaskSearchAndFilters {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument()
  })

  it('renders filters button', () => {
    render(<TaskSearchAndFilters {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('renders sort dropdown', () => {
    render(<TaskSearchAndFilters {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByDisplayValue('Due Date')).toBeInTheDocument()
  })

  it('calls onSearchChange when search input changes', async () => {
    render(<TaskSearchAndFilters {...mockProps} />, { wrapper: createWrapper() })
    const input = screen.getByPlaceholderText('Search tasks...')
    await input.click()
    expect(mockProps.onSearchChange).toBeDefined()
  })

  it('calls onToggleFilters when filters button is clicked', async () => {
    render(<TaskSearchAndFilters {...mockProps} />, { wrapper: createWrapper() })
    const filterButton = screen.getByText('Filters')
    await filterButton.click()
    expect(mockProps.onToggleFilters).toHaveBeenCalled()
  })

  it('shows filter count when activeFiltersCount > 0', () => {
    render(<TaskSearchAndFilters {...mockProps} activeFiltersCount={3} />, { wrapper: createWrapper() })
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows clear filters button when filters are active', () => {
    render(
      <TaskSearchAndFilters {...mockProps} showFilters={true} activeFiltersCount={2} />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Clear all filters')).toBeInTheDocument()
  })

  it('calls onClearFilters when clear button is clicked', async () => {
    render(
      <TaskSearchAndFilters {...mockProps} showFilters={true} activeFiltersCount={2} />,
      { wrapper: createWrapper() }
    )
    const clearButton = screen.getByText('Clear all filters')
    await clearButton.click()
    expect(mockProps.onClearFilters).toHaveBeenCalled()
  })

  it('shows FilterPanel when showFilters is true', () => {
    render(<TaskSearchAndFilters {...mockProps} showFilters={true} />, { wrapper: createWrapper() })
    expect(screen.getAllByText('Status').length).toBeGreaterThan(0)
  })

  it('does not show FilterPanel when showFilters is false', () => {
    render(<TaskSearchAndFilters {...mockProps} showFilters={false} />, { wrapper: createWrapper() })
    expect(screen.queryByText('All Status')).not.toBeInTheDocument()
  })

  it('calls onSortChange when sort is changed', async () => {
    render(<TaskSearchAndFilters {...mockProps} />, { wrapper: createWrapper() })
    const select = screen.getByDisplayValue('Due Date')
    await select.click()
    expect(mockProps.onSortChange).toBeDefined()
  })

  it('shows ascending text when sortOrder is asc', () => {
    render(<TaskSearchAndFilters {...mockProps} sortOrder="asc" />, { wrapper: createWrapper() })
    expect(screen.getByText('(Ascending)')).toBeInTheDocument()
  })

  it('shows descending text when sortOrder is desc', () => {
    render(<TaskSearchAndFilters {...mockProps} sortOrder="desc" />, { wrapper: createWrapper() })
    expect(screen.getByText('(Descending)')).toBeInTheDocument()
  })

  it('does not show sort order text when sortOrder is undefined', () => {
    render(<TaskSearchAndFilters {...mockProps} sortOrder={undefined} />, { wrapper: createWrapper() })
    expect(screen.queryByText('(Ascending)')).not.toBeInTheDocument()
    expect(screen.queryByText('(Descending)')).not.toBeInTheDocument()
  })
})

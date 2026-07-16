import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../../utils/renderWithProviders'
import { GeneralTab } from '@/components/Dashboard/Workspaces/project/Settings/GeneralTab'
import { BoardColumn } from '@/components/Dashboard/Workspaces/project/Tasks/BoardColumn'
import { EmptyTasks } from '@/components/Dashboard/Workspaces/project/Tasks/EmptyTasks'

const mockProject = {
  id: 'proj-1',
  name: 'Test Project',
  slug: 'test-project',
  description: 'A test project',
  status: 'ACTIVE',
  color: '#3b82f6',
  workspaceId: 'ws-1',
  members: [],
  stats: {
    totalTasks: 10,
    completedTasks: 5,
    totalMembers: 2,
  },
} as any

const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  status: 'TODO',
  priority: 'HIGH',
  dueDate: '2026-08-01T00:00:00Z',
  project: { name: 'Test Project', color: '#3b82f6', slug: 'test-project' },
  assignees: [],
  _count: { comments: 0, subtasks: 0, files: 0 },
} as any

describe('Workspaces/project/Settings/GeneralTab', () => {
  it('renders project info section', () => {
    render(<GeneralTab project={mockProject} canManage={true} />, { wrapper: createWrapper() })
    expect(screen.getByText('Project Info')).toBeInTheDocument()
  })

  it('renders project name input', () => {
    render(<GeneralTab project={mockProject} canManage={true} />, { wrapper: createWrapper() })
    expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument()
  })

  it('renders project description input', () => {
    render(<GeneralTab project={mockProject} canManage={true} />, { wrapper: createWrapper() })
    expect(screen.getByDisplayValue('A test project')).toBeInTheDocument()
  })

  it('renders save button when canManage is true', () => {
    render(<GeneralTab project={mockProject} canManage={true} />, { wrapper: createWrapper() })
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  it('does not render save button when canManage is false', () => {
    render(<GeneralTab project={mockProject} canManage={false} />, { wrapper: createWrapper() })
    expect(screen.queryByText('Save Changes')).not.toBeInTheDocument()
  })

  it('renders project visibility section', () => {
    render(<GeneralTab project={mockProject} canManage={true} />, { wrapper: createWrapper() })
    expect(screen.getByText('Project Visibility')).toBeInTheDocument()
  })

  it('disables inputs when canManage is false', () => {
    render(<GeneralTab project={mockProject} canManage={false} />, { wrapper: createWrapper() })
    expect(screen.getByDisplayValue('Test Project')).toBeDisabled()
    expect(screen.getByDisplayValue('A test project')).toBeDisabled()
  })
})

describe('Workspaces/project/Tasks/BoardColumn', () => {
  it('renders column with label', () => {
    render(
      <BoardColumn
        status="TODO"
        label="To Do"
        icon={<span>📋</span>}
        color="text-blue-500"
        tasks={[]}
        workspaceSlug="test-workspace"
        onAddTask={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })

  it('renders empty state when no tasks', () => {
    render(
      <BoardColumn
        status="TODO"
        label="To Do"
        icon={<span>📋</span>}
        color="text-blue-500"
        tasks={[]}
        workspaceSlug="test-workspace"
        onAddTask={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('No tasks')).toBeInTheDocument()
  })

  it('renders task count', () => {
    render(
      <BoardColumn
        status="TODO"
        label="To Do"
        icon={<span>📋</span>}
        color="text-blue-500"
        tasks={[mockTask]}
        workspaceSlug="test-workspace"
        onAddTask={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renders tasks', () => {
    render(
      <BoardColumn
        status="TODO"
        label="To Do"
        icon={<span>📋</span>}
        color="text-blue-500"
        tasks={[mockTask]}
        workspaceSlug="test-workspace"
        onAddTask={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders add task button', () => {
    render(
      <BoardColumn
        status="TODO"
        label="To Do"
        icon={<span>📋</span>}
        color="text-blue-500"
        tasks={[]}
        workspaceSlug="test-workspace"
        onAddTask={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Add task')).toBeInTheDocument()
  })

  it('calls onAddTask when add button is clicked', async () => {
    const onAddTask = vi.fn()
    render(
      <BoardColumn
        status="TODO"
        label="To Do"
        icon={<span>📋</span>}
        color="text-blue-500"
        tasks={[]}
        workspaceSlug="test-workspace"
        onAddTask={onAddTask}
      />,
      { wrapper: createWrapper() }
    )
    const addButton = screen.getByLabelText('Add task to To Do')
    await addButton.click()
    expect(onAddTask).toHaveBeenCalled()
  })

  it('renders multiple tasks', () => {
    const tasks = [
      mockTask,
      { ...mockTask, id: 'task-2', title: 'Second Task' },
    ]
    render(
      <BoardColumn
        status="TODO"
        label="To Do"
        icon={<span>📋</span>}
        color="text-blue-500"
        tasks={tasks}
        workspaceSlug="test-workspace"
        onAddTask={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Second Task')).toBeInTheDocument()
  })
})

describe('Workspaces/project/Tasks/EmptyTasks', () => {
  it('renders empty tasks state', () => {
    render(<EmptyTasks />, { wrapper: createWrapper() })
    expect(screen.getByText('No tasks found')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<EmptyTasks />, { wrapper: createWrapper() })
    expect(screen.getByText(/Adjust filters or create the first task/)).toBeInTheDocument()
  })
})

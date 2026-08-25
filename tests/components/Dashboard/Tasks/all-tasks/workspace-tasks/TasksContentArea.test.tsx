import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TasksContentArea } from '@/components/dashboard/tasks/all-tasks/workspace-tasks/TasksContentArea'
import type { Task } from '@/hooks/useTask'

vi.mock('lucide-react', () => ({
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="Loader2" {...props} />,
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="AlertCircle" {...props} />,
}))

vi.mock('@/components/dashboard/tasks/all-tasks/workspace-tasks/EmptyState', () => ({
  EmptyState: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="EmptyState">Empty</div>,
}))

vi.mock('@/components/dashboard/tasks/all-tasks/workspace-tasks/TaskList', () => ({
  TaskList: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="TaskList">TaskList</div>,
}))

vi.mock('@/components/shared/Pagination', () => ({
  Pagination: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="Pagination">Pagination</div>,
}))

const baseTask: Task = {
  id: 't1', title: 'Task', description: '', status: 'TODO', priority: 'MEDIUM',
  dueDate: null, createdBy: { id: 'u1', name: 'A' }, assignees: [],
  _count: { comments: 0, subtasks: 0, files: 0 }, createdAt: '', updatedAt: '',
}

const defaults = {
  tasks: [] as Task[],
  isLoading: false,
  isError: false,
  searchQuery: '',
  activeFiltersCount: 0,
  workspaceSlug: 'ws-1',
  onCreateTask: vi.fn(),
  currentPage: 1,
  onPageChange: vi.fn(),
  memberRole: 'MEMBER' as const,
}

describe('TasksContentArea', () => {
  it('shows spinner when loading', () => {
    render(<TasksContentArea {...defaults} isLoading={true} />)
    expect(screen.getByTestId('Loader2')).toBeInTheDocument()
  })

  it('shows error state when isError', () => {
    render(<TasksContentArea {...defaults} isError={true} />)
    expect(screen.getByText('Failed to load tasks')).toBeInTheDocument()
  })

  it('shows EmptyState when tasks array is empty', () => {
    render(<TasksContentArea {...defaults} />)
    expect(screen.getByTestId('EmptyState')).toBeInTheDocument()
  })

  it('shows TaskList when tasks exist', () => {
    render(<TasksContentArea {...defaults} tasks={[baseTask]} />)
    expect(screen.getByTestId('TaskList')).toBeInTheDocument()
  })
})

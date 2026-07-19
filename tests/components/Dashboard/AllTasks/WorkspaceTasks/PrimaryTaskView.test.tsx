import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PrimaryTasksView } from '@/components/Dashboard/AllTasks/WorkspaceTasks/PrimaryTaskView'
import type { Task } from '@/hooks/useTask'

vi.mock('lucide-react', () => ({
  Sparkles: (props: any) => <svg data-testid="Sparkles" {...props} />,
  ListChecks: (props: any) => <svg data-testid="ListChecks" {...props} />,
}))

vi.mock('@/components/Dashboard/AllTasks/WorkspaceTasks/RemovalTaskCard', () => ({
  RemovableTaskCard: (props: any) => <div data-testid="RemovableTaskCard">{props.task.title}</div>,
}))

const baseTask: Task = {
  id: 't1', title: 'Primary Task', description: '', status: 'IN_PROGRESS', priority: 'HIGH',
  dueDate: null, createdBy: { id: 'u1', name: 'A' }, assignees: [],
  _count: { comments: 0, subtasks: 0, files: 0 }, createdAt: '', updatedAt: '',
}

const defaults = {
  primaryTask: null as Task | null,
  secondaryTasks: [] as Task[],
  workspaceSlug: 'ws-1',
  onRemove: vi.fn(),
}

describe('PrimaryTasksView', () => {
  it('shows empty state when no tasks', () => {
    render(<PrimaryTasksView {...defaults} />)
    expect(screen.getByText('No Primary Tasks Yet')).toBeInTheDocument()
  })

  it('renders primary task title', () => {
    render(<PrimaryTasksView {...defaults} primaryTask={baseTask} />)
    expect(screen.getAllByText('Primary Task').length).toBeGreaterThanOrEqual(1)
  })

  it('renders secondary tasks heading with count', () => {
    const sec = { ...baseTask, id: 't2', title: 'Secondary Task' }
    render(<PrimaryTasksView {...defaults} primaryTask={baseTask} secondaryTasks={[sec]} />)
    expect(screen.getByText(/Secondary Tasks \(1\)/)).toBeInTheDocument()
  })
})

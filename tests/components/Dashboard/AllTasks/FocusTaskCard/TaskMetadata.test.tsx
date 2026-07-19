import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskMetadata } from '@/components/Dashboard/AllTasks/FocusTaskCard/TaskMetadata'
import type { Task } from '@/hooks/useTask'

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: any) => <svg data-testid={name} {...props} />
  return {
    Folder: icon('Folder'),
    Timer: icon('Timer'),
    AlertCircle: icon('AlertCircle'),
    TrendingUp: icon('TrendingUp'),
    Calendar: icon('Calendar'),
  }
})

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: (props: any) => <div data-testid="Avatar">{props.name}</div>,
}))

vi.mock('@/utils/taskcard.utils', () => ({
  formatHoursSinceCreation: (h: number) => `${h}h`,
  getProgressBarColor: () => 'bg-blue-500',
}))

vi.mock('@/utils/task.utils', () => ({
  getStatusColor: () => 'bg-blue-500',
  getTimeStatusColor: () => 'text-red-500',
  formatTimeDuration: (h: number) => `${h}h left`,
}))

const baseTask: Task = {
  id: 't1', title: 'Task', description: '', status: 'TODO', priority: 'MEDIUM',
  dueDate: null, createdBy: { id: 'u1', name: 'A' }, assignees: [],
  _count: { comments: 2, subtasks: 1, files: 0 }, createdAt: '', updatedAt: '',
}

describe('TaskMetadata', () => {
  it('renders status text', () => {
    render(<TaskMetadata task={baseTask} />)
    expect(screen.getByText('TODO')).toBeInTheDocument()
  })

  it('renders comment and subtask counts', () => {
    render(<TaskMetadata task={baseTask} />)
    expect(screen.getByText(/2.*💬/)).toBeInTheDocument()
    expect(screen.getByText(/1.*✓/)).toBeInTheDocument()
  })

  it('renders project name when present', () => {
    const task = {
      ...baseTask,
      project: { id: 'p1', slug: 'p', name: 'Alpha', color: '#00f', workspace: { id: 'w1', name: 'W' } },
    }
    render(<TaskMetadata task={task} />)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })

  it('renders assignee avatars', () => {
    const task = {
      ...baseTask,
      assignees: [{ user: { id: 'u1', name: 'Alice' } }, { user: { id: 'u2', name: 'Bob' } }],
    }
    render(<TaskMetadata task={task} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })
})

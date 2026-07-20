import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TaskCard } from '@/components/Dashboard/AllTasks/TaskCard'

vi.mock('framer-motion', () => ({
  motion: { div: (p: any) => <div {...p} /> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))
vi.mock('@/utils/task.utils', () => ({
  getStatusColor: () => 'bg-green-100',
  getPriorityColor: () => 'text-red-500',
  getTimeStatusColor: () => 'text-green-500',
  formatTimeDuration: (h: number) => h + 'h',
}))
vi.mock('@/utils/taskcard.utils', () => ({
  formatHoursSinceCreation: (h: number) => h + 'h',
}))
vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name }: any) => <div data-testid="avatar">{name}</div>,
}))

const baseTask = {
  id: 't-1',
  title: 'Test Task',
  description: 'A test description',
  status: 'TODO',
  priority: 'HIGH',
  dueDate: '2025-12-31',
  project: { id: 'p-1', name: 'Project Alpha', color: '#3b82f6' },
  assignees: [
    { user: { id: 'u-1', name: 'Alice', image: null } },
    { user: { id: 'u-2', name: 'Bob', image: null } },
  ],
  _count: { comments: 3, subtasks: 2, files: 1 },
  timeTracking: null,
  estimatedHours: null,
}

describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={baseTask as any} index={0} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('shows description when provided', () => {
    render(<TaskCard task={baseTask as any} index={0} />)
    expect(screen.getByText('A test description')).toBeInTheDocument()
  })

  it('shows project badge when task has project', () => {
    render(<TaskCard task={baseTask as any} index={0} />)
    expect(screen.getByText('Project Alpha')).toBeInTheDocument()
  })

  it('shows status pill', () => {
    render(<TaskCard task={baseTask as any} index={0} />)
    expect(screen.getByText('TODO')).toBeInTheDocument()
  })

  it('shows assignee avatars', () => {
    render(<TaskCard task={baseTask as any} index={0} />)
    expect(screen.getAllByTestId('avatar')).toHaveLength(2)
  })
})

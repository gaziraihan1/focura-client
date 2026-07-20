import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ActivityItem } from '@/components/Dashboard/ActivityLogs/ActivityItem'

vi.mock('next/image', () => ({ default: (p: Record<string, unknown>) => <img {...p} /> }))
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => <a href={href} {...props}>{children}</a>,
}))
vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 hours ago',
}))

const createMockActivity = (overrides: Record<string, unknown> = {}) => ({
  id: 'act-1',
  action: 'CREATED' as const,
  entityType: 'TASK' as const,
  entityId: 'task-1',
  userId: 'user-1',
  workspaceId: 'ws-1',
  createdAt: new Date().toISOString(),
  user: { id: 'user-1', name: 'John Doe', email: 'john@test.com', image: null },
  workspace: { id: 'ws-1', name: 'Test Workspace' },
  task: { id: 'task-1', title: 'Test Task', project: { id: 'p-1', name: 'Project A', color: '#3b82f6' } },
  metadata: null,
  ...overrides,
})

describe('ActivityItem', () => {
  it('renders user name', () => {
    render(<ActivityItem activity={createMockActivity()} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('shows task title when activity has task', () => {
    render(<ActivityItem activity={createMockActivity()} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('shows project name when task has project', () => {
    render(<ActivityItem activity={createMockActivity()} />)
    expect(screen.getByText('Project A')).toBeInTheDocument()
  })

  it('shows timestamp', () => {
    render(<ActivityItem activity={createMockActivity()} />)
    expect(screen.getByText('2 hours ago')).toBeInTheDocument()
  })

  it('renders link to task entity', () => {
    render(<ActivityItem activity={createMockActivity()} />)
    const link = screen.getByLabelText('View task')
    expect(link).toHaveAttribute('href', '/dashboard/tasks/task-1')
  })

  it('shows action description', () => {
    render(<ActivityItem activity={createMockActivity()} />)
    expect(screen.getByText(/created task/i)).toBeInTheDocument()
  })
})

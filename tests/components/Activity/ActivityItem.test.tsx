import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ActivityItem } from '@/components/Dashboard/ActivityLogs/ActivityItem'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}))

vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 hours ago',
}))

const mockActivity = {
  id: '1',
  action: 'CREATED',
  entityType: 'TASK',
  entityId: 'task-1',
  createdAt: new Date().toISOString(),
  user: { id: 'u1', name: 'John Doe', image: null },
  workspace: { id: 'ws1', name: 'My Workspace' },
  task: { id: 'task-1', title: 'Test Task', project: null },
  metadata: null,
}

describe('ActivityItem', () => {
  it('renders user name', () => {
    render(<ActivityItem activity={mockActivity as any as Record<string, unknown>} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders activity description', () => {
    render(<ActivityItem activity={mockActivity as any as Record<string, unknown>} />)
    expect(screen.getByText(/created task/)).toBeInTheDocument()
  })

  it('renders task title when task exists', () => {
    render(<ActivityItem activity={mockActivity as any as Record<string, unknown>} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders timestamp', () => {
    render(<ActivityItem activity={mockActivity as any as Record<string, unknown>} />)
    expect(screen.getByText('2 hours ago')).toBeInTheDocument()
  })

  it('renders link to task details', () => {
    render(<ActivityItem activity={mockActivity as any as Record<string, unknown>} />)
    const link = screen.getByLabelText('View task')
    expect(link).toHaveAttribute('href', '/dashboard/tasks/task-1')
  })

  it('renders compact mode', () => {
    const { container } = render(<ActivityItem activity={mockActivity as any as Record<string, unknown>} compact />)
    const item = container.firstChild as HTMLElement
    expect(item.className).toContain('p-2')
  })

  it('renders user initials when no image', () => {
    render(<ActivityItem activity={mockActivity as any as Record<string, unknown>} />)
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('renders project name when task has project', () => {
    const activityWithProject = {
      ...mockActivity,
      task: { ...mockActivity.task, project: { id: 'p1', name: 'My Project', color: '#3b82f6' } },
    }
    render(<ActivityItem activity={activityWithProject as any as Record<string, unknown>} />)
    expect(screen.getByText('My Project')).toBeInTheDocument()
  })
})

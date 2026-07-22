import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '@/components/Dashboard/TaskDetails/ActivityList/EmptyState'
import { ActivityIcon } from '@/components/Dashboard/TaskDetails/ActivityList/ActivityIcon'
import { ActivityItem } from '@/components/Dashboard/TaskDetails/ActivityList/ActivityItem'

vi.mock('lucide-react', () => ({
  Clock: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="clock-icon" {...props} />,
  CheckCircle2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="check-circle-icon" {...props} />,
  Circle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="circle-icon" {...props} />,
  Pencil: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="pencil-icon" {...props} />,
  Plus: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="plus-icon" {...props} />,
  Trash2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="trash-icon" {...props} />,
  Users: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="users-icon" {...props} />,
  MessageSquare: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="message-icon" {...props} />,
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="alert-icon" {...props} />,
}))

vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 hours ago',
}))

vi.mock('@/components/Dashboard/TaskDetails/ActivityList/UserAvatar', () => ({
  UserAvatar: ({ user }: { user: unknown }) => <div data-testid="user-avatar">{user.name}</div>,
}))

vi.mock('@/utils/task-activity.utils', () => ({
  getActivityIcon: (action: string) => {
    const map: Record<string, string> = {
      CREATED: 'Plus',
      UPDATED: 'Pencil',
      DELETED: 'Trash2',
      STATUS_CHANGED: 'CheckCircle2',
    }
    return map[action] || 'Circle'
  },
  getActionColor: () => 'text-gray-500',
  getActivityDescription: (action: string) => {
    const map: Record<string, string> = {
      CREATED: 'created this task',
      UPDATED: 'updated this task',
      DELETED: 'deleted this task',
      STATUS_CHANGED: 'changed status',
    }
    return map[action] || 'performed an action'
  },
}))

describe('EmptyState', () => {
  it('renders no activity message', () => {
    render(<EmptyState />)
    expect(screen.getByText('No activity yet')).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<EmptyState />)
    expect(screen.getByText(/Activity will appear here/)).toBeInTheDocument()
  })

  it('renders clock icon', () => {
    render(<EmptyState />)
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
  })
})

describe('ActivityIcon', () => {
  it('renders Plus icon for CREATED action', () => {
    render(<ActivityIcon iconName="Plus" />)
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
  })

  it('renders Pencil icon for UPDATED action', () => {
    render(<ActivityIcon iconName="Pencil" />)
    expect(screen.getByTestId('pencil-icon')).toBeInTheDocument()
  })

  it('renders Trash2 icon for DELETED action', () => {
    render(<ActivityIcon iconName="Trash2" />)
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
  })

  it('renders CheckCircle2 icon for STATUS_CHANGED action', () => {
    render(<ActivityIcon iconName="CheckCircle2" />)
    expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument()
  })

  it('renders Circle icon for unknown action', () => {
    render(<ActivityIcon iconName="Unknown" />)
    expect(screen.getByTestId('circle-icon')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<ActivityIcon iconName="Plus" className="h-6 w-6" />)
    const icon = screen.getByTestId('plus-icon')
    expect(icon).toHaveClass('h-6', 'w-6')
  })
})

describe('ActivityItem', () => {
  const baseActivity = {
    id: 'act-1',
    action: 'CREATED',
    description: 'created this task',
    entityType: 'TASK',
    createdAt: new Date().toISOString(),
    user: { id: 'user-1', name: 'Alice', image: null },
    metadata: {},
  }

  it('renders user name', () => {
    render(<ActivityItem activity={baseActivity} />)
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0)
  })

  it('renders activity description', () => {
    render(<ActivityItem activity={baseActivity} />)
    expect(screen.getByText('created this task')).toBeInTheDocument()
  })

  it('renders time ago', () => {
    render(<ActivityItem activity={baseActivity} />)
    expect(screen.getByText('2 hours ago')).toBeInTheDocument()
  })

  it('renders user avatar', () => {
    render(<ActivityItem activity={baseActivity} />)
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument()
  })

  it('renders activity icon', () => {
    render(<ActivityItem activity={baseActivity} />)
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
  })

  it('renders subtask title from metadata when available', () => {
    const activity = {
      ...baseActivity,
      metadata: { subtaskTitle: 'Fix login bug' },
    }
    render(<ActivityItem activity={activity} />)
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
  })

  it('renders task title from metadata when subtaskTitle is not available', () => {
    const activity = {
      ...baseActivity,
      metadata: { taskTitle: 'Implement feature' },
    }
    render(<ActivityItem activity={activity} />)
    expect(screen.getByText('Implement feature')).toBeInTheDocument()
  })
})

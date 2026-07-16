import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PriorityDisplay } from '@/components/Dashboard/TaskDetails/TaskSidebar/PriorityDisplay'
import { TaskDetailItem } from '@/components/Dashboard/TaskDetails/TaskSidebar/TaskDetailItem'
import { TaskAssigneesList } from '@/components/Dashboard/TaskDetails/TaskSidebar/TaskAssigneesList'
import { TaskTimestamps } from '@/components/Dashboard/TaskDetails/TaskSidebar/TaskTimeStamps'

vi.mock('lucide-react', () => ({
  Clock: (props: any) => <svg data-testid="clock-icon" {...props} />,
  Calendar: (props: any) => <svg data-testid="calendar-icon" {...props} />,
  User: (props: any) => <svg data-testid="user-icon" {...props} />,
  Check: (props: any) => <svg data-testid="check-icon" {...props} />,
}))

vi.mock('@/utils/task.utils', () => ({
  getPriorityColor: () => 'border-red-300',
}))

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name }: any) => <div data-testid="avatar">{name}</div>,
}))

describe('PriorityDisplay', () => {
  it('renders priority label', () => {
    render(<PriorityDisplay priority="HIGH" />)
    expect(screen.getByText('Priority')).toBeInTheDocument()
  })

  it('renders priority value', () => {
    render(<PriorityDisplay priority="HIGH" />)
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('renders different priority values', () => {
    const { rerender } = render(<PriorityDisplay priority="LOW" />)
    expect(screen.getByText('LOW')).toBeInTheDocument()

    rerender(<PriorityDisplay priority="URGENT" />)
    expect(screen.getByText('URGENT')).toBeInTheDocument()

    rerender(<PriorityDisplay priority="MEDIUM" />)
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
  })
})

describe('TaskDetailItem', () => {
  it('renders label and value', () => {
    render(
      <TaskDetailItem
        icon={(props: any) => <svg data-testid="test-icon" {...props} />}
        label="Estimated Hours"
        value="8h"
      />
    )
    expect(screen.getByText('Estimated Hours')).toBeInTheDocument()
    expect(screen.getByText('8h')).toBeInTheDocument()
  })

  it('renders icon', () => {
    render(
      <TaskDetailItem
        icon={(props: any) => <svg data-testid="test-icon" {...props} />}
        label="Status"
        value="Active"
      />
    )
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('renders ReactNode value', () => {
    render(
      <TaskDetailItem
        icon={(props: any) => <svg {...props} />}
        label="Custom"
        value={<span data-testid="custom-value">Custom Value</span>}
      />
    )
    expect(screen.getByTestId('custom-value')).toBeInTheDocument()
  })
})

describe('TaskAssigneesList', () => {
  const assignees = [
    { user: { id: 'user-1', name: 'Alice', image: undefined } },
    { user: { id: 'user-2', name: 'Bob', image: undefined } },
  ]

  it('renders nothing when assignees is empty', () => {
    const { container } = render(<TaskAssigneesList assignees={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders assignees heading', () => {
    render(<TaskAssigneesList assignees={assignees} />)
    expect(screen.getByText('Assignees')).toBeInTheDocument()
  })

  it('renders all assignee names', () => {
    render(<TaskAssigneesList assignees={assignees} />)
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Bob').length).toBeGreaterThan(0)
  })

  it('renders avatars for each assignee', () => {
    render(<TaskAssigneesList assignees={assignees} />)
    const avatars = screen.getAllByTestId('avatar')
    expect(avatars.length).toBe(2)
  })
})

describe('TaskTimestamps', () => {
  it('renders created date', () => {
    render(<TaskTimestamps createdAt="2026-07-10T00:00:00Z" />)
    expect(screen.getByText(/Created/)).toBeInTheDocument()
  })

  it('renders completed date when provided', () => {
    render(
      <TaskTimestamps
        createdAt="2026-07-10T00:00:00Z"
        completedAt="2026-07-15T00:00:00Z"
      />
    )
    expect(screen.getByText(/Completed/)).toBeInTheDocument()
  })

  it('hides completed date when not provided', () => {
    render(<TaskTimestamps createdAt="2026-07-10T00:00:00Z" />)
    expect(screen.queryByText(/Completed/)).not.toBeInTheDocument()
  })

  it('hides completed date when null', () => {
    render(
      <TaskTimestamps createdAt="2026-07-10T00:00:00Z" completedAt={null} />
    )
    expect(screen.queryByText(/Completed/)).not.toBeInTheDocument()
  })

  it('renders clock icon', () => {
    render(<TaskTimestamps createdAt="2026-07-10T00:00:00Z" />)
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
  })

  it('renders check icon when completed', () => {
    render(
      <TaskTimestamps
        createdAt="2026-07-10T00:00:00Z"
        completedAt="2026-07-15T00:00:00Z"
      />
    )
    expect(screen.getByTestId('check-icon')).toBeInTheDocument()
  })
})

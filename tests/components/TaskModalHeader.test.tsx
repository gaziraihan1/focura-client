import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskModalHeader } from '@/components/Dashboard/CalendarView/TaskModal/TaskModalHeader'

vi.mock('lucide-react', () => ({
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
  AlertCircle: (props: any) => <svg {...props} />,
}))

describe('TaskModalHeader', () => {
  const onClose = vi.fn()

  beforeEach(() => vi.clearAllMocks())

  it('renders task title', () => {
    render(
      <TaskModalHeader title="My Task" status="TODO" priority="HIGH" isOverdue={false} onClose={onClose} />
    )
    expect(screen.getByText('My Task')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(
      <TaskModalHeader title="Task" status="IN_PROGRESS" priority="HIGH" isOverdue={false} onClose={onClose} />
    )
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
  })

  it('renders priority badge', () => {
    render(
      <TaskModalHeader title="Task" status="TODO" priority="URGENT" isOverdue={false} onClose={onClose} />
    )
    expect(screen.getByText('URGENT')).toBeInTheDocument()
  })

  it('renders overdue badge when overdue', () => {
    render(
      <TaskModalHeader title="Task" status="TODO" priority="HIGH" isOverdue={true} onClose={onClose} />
    )
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  it('does not render overdue badge when not overdue', () => {
    render(
      <TaskModalHeader title="Task" status="TODO" priority="HIGH" isOverdue={false} onClose={onClose} />
    )
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument()
  })

  it('calls onClose when X button is clicked', () => {
    render(
      <TaskModalHeader title="Task" status="TODO" priority="HIGH" isOverdue={false} onClose={onClose} />
    )
    fireEvent.click(screen.getByTestId('x-icon').closest('button')!)
    expect(onClose).toHaveBeenCalled()
  })
})

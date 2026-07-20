import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { EmptyState } from '@/components/Dashboard/AllTasks/WorkspaceTasks/EmptyState'

describe('WorkspaceTasks EmptyState', () => {
  const defaultProps = {
    hasFilters: false,
    searchQuery: '',
    onCreateTask: vi.fn(),
    memberRole: null as string | null,
  }

  it('renders "No tasks yet" when no filters', () => {
    render(<EmptyState {...defaultProps} />)
    expect(screen.getByText('No tasks yet')).toBeInTheDocument()
  })

  it('renders "No tasks match your filters" when hasFilters=true', () => {
    render(<EmptyState {...defaultProps} hasFilters={true} />)
    expect(screen.getByText('No tasks match your filters')).toBeInTheDocument()
  })

  it('shows Create Task button when not guest and no filters', () => {
    render(<EmptyState {...defaultProps} memberRole="ADMIN" />)
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument()
  })

  it('hides Create Task button when memberRole is GUEST', () => {
    render(<EmptyState {...defaultProps} memberRole="GUEST" />)
    expect(screen.queryByRole('button', { name: /create task/i })).not.toBeInTheDocument()
  })

  it('calls onCreateTask when Create Task button clicked', async () => {
    const user = userEvent.setup()
    const onCreateTask = vi.fn()
    render(<EmptyState {...defaultProps} memberRole="ADMIN" onCreateTask={onCreateTask} />)
    await user.click(screen.getByRole('button', { name: /create task/i }))
    expect(onCreateTask).toHaveBeenCalledTimes(1)
  })
})
